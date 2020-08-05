# Roadmap

This document outlines the roadmap for development of scout. The aim is to keep this populated with roughly 6 months of planned features. We will try to adhere to this timelime though things might change as we progress. 

If you would like to request a new feature or prioritize one over the others, open a github issue and we can discuss further.

## August 2020
-   Launch to all possible cities that use Socrata as a platform with the ability to easily search between cities.
-   Add a feature to allow the suggestion of datasets across cities.
-   Launch the tool for a few select other cities using Socrata.

## September 2020
-   Improve column name and id matching through fuzzy matching. This might involve looking at some fuzzy matching metrics, manually creating mappings for common id structures (e.g., BBL as a single entry vs three columns for "Borough", "Block", and "Lot"), or something else entirely.
-   Explore adding the ability to share collections and browse other peoples public collections.
-   Explore adding the ability to share collections and browse other peoples public collections.

## October 2020 
-   Work to abstract the metadata model so that we can add datasets from other sources (e.g., ArcGIS, CKAN, etc.).
-   Migrate the app to typescript to help facilitate this.

## November 2002 
-   Prototype searching by geography and by time range

## December 2002 

-   Build interoperability with the other Data Clinic tools (smooshr and Newerhoods). This would consist of adding "Open in X" buttons for both tools and potentially embedding a paired down version of scout within those apps to allow for the direct browsing of datasets.
-   Integrate ways for people to link projects back to a dataset or collection. For example, if a blog post is written about a given dataset or a derivative dataset is produced, allow individuals to submit these to scout for display alongside that dataset or collection.

## January 2020 

-   Start developing smart ways to link datasets at an entity level (e.g., school, BBL number, council_district, etc.). Integrate these as a new browsing option within scout.
