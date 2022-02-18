import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConfigService } from '../config/config.service';
import { DatasetService } from '../dataset/dataset.service';
import { Dataset } from '../dataset/dataset.entity';
import { ScoredDataset } from './types/ScoredDataset';

import '@tensorflow/tfjs-node';
import * as use from '@tensorflow-models/universal-sentence-encoder';

@Injectable()
export class SearchService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => DatasetService))
    private readonly datasetService: DatasetService,
  ) {}

  async createIndex(recreate: boolean) {
    const checkIndex = await this.esService.indices.exists({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
    });

    const indexExists = checkIndex.statusCode === 200;

    if (recreate && indexExists) {
      await this.esService.indices.delete({
        index: this.configService.get('ELASTICSEARCH_INDEX'),
      });
    }

    if (!indexExists || recreate) {
      this.esService.indices.create(
        {
          index: this.configService.get('ELASTICSEARCH_INDEX'),
          body: {
            settings: {
              analysis: {
                analyzer: {
                  autocomplete_analyzer: {
                    tokenizer: 'autocomplete',
                    filter: ['lowercase'],
                  },
                  autocomplete_search_analyzer: {
                    tokenizer: 'keyword',
                    filter: ['lowercase'],
                  },
                },
                tokenizer: {
                  autocomplete: {
                    type: 'edge_ngram',
                    min_gram: 1,
                    max_gram: 30,
                    token_chars: ['letter', 'digit', 'whitespace'],
                  },
                },
              },
            },
            mappings: {
              properties: {
                title: {
                  type: 'text',
                  fields: {
                    complete: {
                      type: 'text',
                      analyzer: 'autocomplete_analyzer',
                      search_analyzer: 'autocomplete_search_analyzer',
                    },
                  },
                },
                description: {
                  type: 'text',
                  fields: {
                    complete: {
                      type: 'text',
                      analyzer: 'autocomplete_analyzer',
                      search_analyzer: 'autocomplete_search_analyzer',
                    },
                  },
                },
                portal: {
                  type: 'text',
                },
                vector: {
                  type: 'dense_vector',
                  dims: 512,
                },
                // year: { type: 'integer' },
                // genres: { type: 'nested' },
                // actors: { type: 'nested' },
              },
            },
          },
        },
        err => {
          if (err) {
            console.error(err);
          }
        },
      );
    }
  }

  async thematicallySimilarForDataset(
    dataset: Dataset,
    portalId?: string,
  ): Promise<ScoredDataset[]> {
    const text = dataset.name + '. ' + dataset.description;
    console.log('finding similar with text ', text);
    return this.findSimilar(text, portalId);
  }

  async findSimilar(
    description: string,
    portalId?: string,
  ): Promise<ScoredDataset[]> {
    const model = await use.load();
    const embedding = await (await model.embed([description])).data();
    console.log('embedding is ', Array.from(embedding));

    const emptyQuery = {
      match_all: {},
    };
    const portalQuery = {
      match: { portal: portalId },
    };
    const query = portalId ? portalQuery : emptyQuery;

    try {
      // Run the elastic search query
      const { body } = await this.esService.search({
        index: this.configService.get('ELASTICSEARCH_INDEX'),
        body: {
          size: 50,
          query: {
            script_score: {
              query: query,
              script: {
                source:
                  "(cosineSimilarity(params.query_vector, 'vector') + 1.0)/2.0",
                params: { query_vector: Array.from(embedding) },
              },
            },
          },
        },
      });

      // Extract ids and scores
      const hits = body.hits.hits;
      const ids = hits.map(item => item._id);
      const scores = hits.map(item => item._score);
      console.log('ids are ', ids);
      console.log('scores are ', scores);
      //Find the datasets in the full database
      const datasets = await this.datasetService.findByIds(ids);

      //Return as Scored Datasets
      const result = datasets.map((d, i) => ({ dataset: d, score: scores[i] }));
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
      console.log(err.body.error.failed_shards[0].reason);
      console.log('___________');
      return [];
    }
  }

  async search(search = 'car', portal?: string, offset = 0, limit = 20) {
    console.log('RUNNING QUERY', search);

    const matchQuery = {
      multi_match: {
        fields: ['title', 'description'],
        query: search,
        fuzziness: 'AUTO',
      },
    };
    const matchAll = { match_all: {} };

    const query = search && search.length > 0 ? matchQuery : matchAll;
    const portalMatch = { match: { portal } };
    const fullQuery: any[] = [query];

    if (portal) {
      fullQuery.push(portalMatch);
    }

    const { body } = await this.esService.search({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
      body: {
        query: {
          bool: {
            must: fullQuery,
          },
        },
        from: offset,
        size: limit,
        _source: ['title'],
      },
    });
    const hits = body.hits.hits;

    const ids = hits.map(item => item._id);

    return { ids, total: body.hits.total.value };
  }

  //** Populates the elastic search index with one batch of the dataset data */
  async populateIndexBatch(batch) {
    return new Promise((resolve, reject) => {
      this.esService.bulk(
        {
          index: this.configService.get('ELASTICSEARCH_INDEX'),
          body: batch,
        },
        err => {
          if (err) {
            // console.error(JSON.stringify(err));
            reject(err);
          }
          resolve(undefined);
        },
      );
    });
  }

  //** Populate the entire elastic search database */
  async populateIndex() {
    console.log('PARSING DATA');
    const body = await this.parseAndPrepareData();
    const batchSize = 100;

    const batches = [];
    body.forEach((inst, index) => {
      const batchIndex = Math.floor(index / (batchSize * 2));
      batches[batchIndex]
        ? batches[batchIndex].push(inst)
        : (batches[batchIndex] = [inst]);
    });

    const done = 0;

    await batches.reduce(async (previousPromise, nextBatch, index) => {
      await previousPromise;
      console.log('loading in batch ', index, ' of ', batches.length);
      return this.populateIndexBatch(nextBatch);
    }, Promise.resolve());

    console.log('done creating index');
  }

  async generateEmbeddingVectors(datasets: Dataset[], model) {
    const datasetText = datasets.map(d => d.name + '. ' + d.description);
    const embeddings = await (await model.embed(datasetText)).data();
    const datasetsWithVector = datasets.map((d, index) => ({
      ...d,
      portalId: d.portalId,
      vector: embeddings.slice(index * 512, (index + 1) * 512),
    }));
    return datasetsWithVector;
  }
  async parseAndPrepareData() {
    const body = [];
    console.log('getting datasets');

    const totalDatasets = await this.datasetService.count();
    const batchSize = 1000;
    const noBatches = Math.ceil(totalDatasets / batchSize);

    console.log(
      'total ',
      totalDatasets,
      ' batch size ',
      batchSize,
      ' no batches ',
      noBatches,
    );
    let datasetsWithVector = [];

    const model = await use.load();
    await [...Array(noBatches)].reduce(async (previousPromise, _, index) => {
      await previousPromise;
      const datasets = await this.datasetService.findAll(
        batchSize,
        index * batchSize,
      );
      console.log(' getting and processing batch ', index, datasets[0].id);
      const datasetsWithVectorBatch = await this.generateEmbeddingVectors(
        datasets,
        model,
      );
      datasetsWithVector = [...datasetsWithVector, ...datasetsWithVectorBatch];
      return Promise.resolve();
    }, Promise.resolve);

    console.log('With vector ', datasetsWithVector[0]);

    datasetsWithVector.map(item => {
      try {
        body.push(
          {
            index: {
              _index: this.configService.get('ELASTICSEARCH_INDEX'),
              _id: item.id,
            },
          },
          {
            title: item.name,
            description: item.description,
            // vector: Array.from(item.embedding),
            vector: Array.from(item.vector),
            portal: item.portalId,
            //   year: item.year,
            //   genres: item.genres.map(genre => ({ genre })),
            //   actors: actorsData,
          },
        );
      } catch (err) {
        console.log('updable to map ', item);
        throw err;
      }
    });

    return body;
  }
}
