import gensim
import pandas as pd
import json
import re
import argparse
from pathlib import Path

def load_portal_defs():
    with open('../src/portal_configs.json', 'r') as f:
        configs = json.load(f)
    return configs
                            
def read_corpus(datasets, tokens_only=False):
    lookup ={}
    rlookup={}
    corpus =[]
    for index,dataset in enumerate(datasets):
        tokens = gensim.utils.simple_preprocess(dataset['resource']['name'] + " " + dataset['resource']['description'])
        lookup[dataset['resource']['id']] = index
        rlookup[index] = dataset['resource']['id']
        corpus.append(gensim.models.doc2vec.TaggedDocument(tokens, [index]))
    return (corpus, lookup, rlookup)

def generate_similarity(datasets):
    train_corpus, lookup, rlookup = read_corpus(datasets)
    model = gensim.models.doc2vec.Doc2Vec(vector_size=50, min_count=2, epochs=40)
    model.build_vocab(train_corpus)
    model.train(train_corpus, total_examples=model.corpus_count, epochs=model.epochs)

    results = {}
    for datasetid in lookup.keys():
        inferred_vector = model.infer_vector(train_corpus[lookup[datasetid]].words)
        sims = model.docvecs.most_similar([inferred_vector], topn=30)
        sims = [ {'dataset': rlookup[sim[0]], 'similarity': sim[1]} for sim in sims]
        results[datasetid] = sims
        
    return results

def load_metadata(portal):
    portal_short = '.'.join(portal.split(".")[0:-1])
    with open(f'metadata/{portal_short}.json','r') as f:
        datasets = json.load(f)
    return datasets

if __name__ =='__main__':
    
    portals = load_portal_defs()
#     parser = argparse.ArgumentParser(description='Generate similarity results for portal')
#     parser.add_argument('--portal',  type=str, help='the portal to run results for or simply "All" ', default='All')
#     parser.parse_args()
#     print(parser)

#     if(parser.portal):
#         portal = parser.portal
#     else:
#         portal = "All"
    portal = 'All'    
    if portal=='All':
        to_run = [ {"socrata": portals[k]['socrataDomain'], 'key':k } for k in  portals.keys()]
    else:
        to_run = [{'socrata':portals[portal]['socrataDomain'], "key" : portal}]
        
    for p in to_run:
        key = p['key']

        print(f'Running {key}')
        base_path = Path(f'../public/metadata/{key}')
        base_path.mkdir(exist_ok=True)
        
        datasets = load_metadata(p['socrata'])
        results = generate_similarity(datasets)
        with open(base_path / 'similarity_metrics.json', 'w') as f:
            json.dump(results,f)