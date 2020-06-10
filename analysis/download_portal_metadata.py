import pandas as pd
import json
import requests
import math
from pathlib import Path
from tqdm import tqdm

def get_portal_list():
    return requests.get('http://api.us.socrata.com/api/catalog/v1/domains').json()['results']


def get_portal_metadata(portal, per_page=100):
    inital_request = requests.get(f'https://api.us.socrata.com/api/catalog/v1?domains={portal}&search_context={portal}&limit=1').json()
    if('error' in inital_request.keys()):
        raise Exception(f"No data for domain {portal}")
        
    result_count = inital_request['resultSetSize']
    datasets = []
    for page in range(math.ceil(result_count/per_page)):
        dataet_page = requests.get(f'https://api.us.socrata.com/api/catalog/v1?domains={portal}&search_context={portal}&limit={per_page}&offset={per_page*page}').json()
        datasets.extend(dataet_page['results'])
    return datasets

def download_all_portals(output_path = "metadata"):
    output_dir = Path('metadata')
    output_dir.mkdir(exist_ok=True)

    for portal in tqdm(get_portal_list()):
        domain = portal['domain']
        try:
            data = get_portal_metadata(portal['domain'])
            with open((output_dir / domain).with_suffix('.json'), 'w' ) as f:
                json.dump(data,f)
        except Exception as e:
            print("Issue with gettting ", domain)
            print(e)
            
download_all_portals()