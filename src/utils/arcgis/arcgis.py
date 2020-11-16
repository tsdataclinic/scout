import requests

base_url = "https://services1.arcgis.com/tp9wqSVX1AitKgjd/ArcGIS/rest/services/"
service_name = "Asthma_2013to2014_CHISNE"
service_url = base_url + service_name + "/FeatureServer"

example_url = "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"

# pass this param to get a json formatted response
params = {"f": "json"}

# get list of services
r = requests.get(base_url, params=params)
feature_services = r.json()["services"]

print("========== LA CITY FEATURE SERVICES ==========")
for fs in feature_services:
    print(fs["name"])
    fs_url = fs["url"]
    r1 = requests.get(fs_url, params=params)
    layers = r1.json()["layers"]
    for layer in layers:
        print("  " + layer["name"])
        layer_index = layer["id"]
        r2 = requests.get(fs_url + "/" + str(layer_index), params=params)
        fields = r2.json()["fields"]
        print("    - fields:", [f["name"] for f in fields])