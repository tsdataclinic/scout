import gensim
import pandas as pd
import json
import spacy 

ACTIVE_PORTALS=[

]

def load_portal_defs():
    with open('src/portal_configs.json', 'r') as f:
        return json.load(f)

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


def generate_similarity_spacy(datasets):
    nlp = spacy.load('en_core_web_lg')
    
    dataset_tokens = {}
    for dataset in datasets:
        text_tokens = nlp(dataset['resource']['name'] + " " + dataset['resource']['description'])
        tokens_without_sw = nlp( ' '.join( [str(token) for token in text_tokens if token.pos_ in ['NOUN', 'PROPN']]))
        dataset_tokens[dataset['resource']['id']]  = tokens_without_sw

    result = {}
    for dataset_target, tokens_target in dataset_tokens.items():
        result_small = {}
        for dataset_test, tokens_test in dataset_tokens.items():
            if(dataset_target != dataset_test):
                result_small[dataset_test] = tokens_target.similarity(tokens_test)
        sorted_dataset = {k: v for k, v in sorted(result_small.items(),reverse=True, key=lambda item: item[1])[0:60]}
        result[dataset_target] = [ {'dataset' : k, 'similarity': v} for k,v in sorted_dataset.items()] 
    return result


def generate_similarity(datasets):
    train_corpus, lookup, rlookup = read_corpus(datasets)
    model = gensim.models.doc2vec.Doc2Vec(vector_size=50, min_count=2, epochs=40)
    model.build_vocab(train_corpus)
    model.train(train_corpus, total_examples=model.corpus_count, epochs=model.epochs)

    results = {}
    for datasetid in lookup.keys():
        inferred_vector = model.infer_vector(train_corpus[lookup[datasetid]].words)
        sims = model.docvecs.most_similar([inferred_vector], topn=60)
        sims = [ {'dataset': rlookup[sim[0]], 'similarity': sim[1]} for sim in sims]
        results[datasetid] = sims
        
    return results


def load_metadata(portals=ACTIVE_PORTALS):
    metadata=[]
    domain_lookup = {}
    for portal_name in portals:
        name  = '.'.join(portal_name.split('.')[:-1])
        with open(f'analysis/metadata/{name}.json') as f:
            portal_metadata = json.load(f) 
            metadata.extend(portal_metadata)
            for m in portal_metadata:
                domain_lookup[m['resource']['id']] = portal_name
            
    return metadata, domain_lookup

def assign_data_portal_to_sims(similarities,lookup):
    result = {}
    for dataset_id, sims in similarities.items():
        home_portal = lookup[dataset_id]

        home_sims = []
        away_sims = []
        for sim in sims:
            away_portal = lookup[sim['dataset']]
            sim_with_portal = {'dataset': sim['dataset'], 'similarity': sim['similarity'], 'portal': away_portal}
            if(away_portal == home_portal):
                home_sims.append(sim_with_portal)
            else:
                away_sims.append(sim_with_portal)

        result[dataset_id] = {
            'home':home_sims,
            'away':away_sims
        }
    return result


def write_out(portal_defs, similarities,lookup):
    for portal_name, portal_meta in portal_defs.items():
        portal_domain = portal_meta['socrataDomain']
        portal_sims = {}
        for sim_id, portal in lookup.items():
            if portal == portal_domain:
                portal_sims[sim_id] = similarities[sim_id]
        with open(f'public/metadata/{portal_name}/similarity_metrics.json', 'w') as f:
            json.dump(portal_sims,f)

              
def main():
    portals = load_portal_defs()
    portal_domains = [portal['socrataDomain'] for portal in portals.values()]
    metadata,lookup = load_metadata(portal_domains)
    similarities = generate_similarity_spacy(metadata)
    similarities = assign_data_portal_to_sims(similarities,lookup)
    write_out(portals, similarities, lookup)
    return similarities, metadata, lookup

# if __name__=='__main__':
#     main()
