import json
import pandas as pd 
from pathlib import Path
from tqdm import tqdm

def extract_columns(dataset):
    resource = dataset['resource']
    names = resource['columns_name']
    field_name = resource['columns_field_name']
    field_type = resource['columns_datatype']
    descriptions = resource['columns_description']
    return pd.DataFrame({'name':names, 'field_type': field_type, 'field_name': field_name, 'description':descriptions, 'dataset-id' : resource['id'], 'dataset_link':dataset['permalink']})

def process_poral_columns(portal_file):
    domain = portal_file.stem
    with open(portal_file, 'r') as f:
        metadata = json.load(f)
    result = pd.DataFrame()
    for dataset in metadata:
        result = result.append(extract_columns(dataset).assign(portal=domain))
    return result

def process_all():
    all_columns = pd.DataFrame()
    for file in tqdm(list(Path('metadata').glob("*.json"))):
        all_columns = all_columns.append(process_poral_columns(file))
    return all_columns


all_columns  = process_all()
all_columns.to_csv('all_dataset_columns.csv.zip',compression='zip', index=False)
NYC = all_columns[all_columns.portal == 'data.cityofnewyork']
NYC.to_csv('nyc_columns.csv.zip', compression='zip', index=False)