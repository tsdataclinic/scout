## Column Consolidation Project 

One of the goals of scout, is to be able to quickly identify datasets that might be easily joined by a common key. The application currently does so by doing a pretty dumb comparison of the field_name's of each datasets metadata and reporting where there is a match. 

This works ok but we know that there are lots of variations on each field name, for example the name of a school might be in a collumn called "School". "schoolName" or "school_name". Additionallym there keys which are sometimes in a single columns for example BBL(Building Block Lot) that are split out in to 3 seperate columns. 

## Goals 

There are two goals for this project 

1. Develop an algorithum aproatch to discovering what keys are likley to refer to the same ID 
2. Coming up with a taxonomy of commonly used id's for NYC which could be used in scout.

The stretch goal is to do this not just for NYC's open data portal but for every one of the open data portals that Socrata maintians

## Data 

We have extracted the meta data for each one of the Socrata open data portals, this can be found as a set of geojson files in the *metadata* folder.
In addition, we have created a csv for every column of every dataset from every socrata portal. You can find a compressed version of that csv in 
this folder called *all_dataset_columns.csv.zip*

Finally a smaller version of that file just for the NYC open data portal can be found in the file *nyc_columns.csv.zip"

## Resources 

[smooshr](https://tsdataclinic.github.io/smooshr/) - A UI built by the data clinic to make it quick and easy to generate condensed taxonomies
[scout](https://tsdataclinic.github.io/scout/) - the tool we built to increase the discoverablity of open data portals
[spaCy](https://spacy.io/) - A NLP package for python 