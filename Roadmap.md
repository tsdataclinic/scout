# Roadmap

This document outlines the roadmap for development of scout. The aim is to keep this populated with roughly 6 months of planned features, these might change as we build scout out but we will aim as much as possible to adhere to this timeline.

If you would like to request a feature or want a feature prioritized over others, open a github issue and we can discuss on there.

## March 2020

-   Implement bug and performance fixes / polish from the beta.
-   Launching the tool for a select few other cities.

## April 2020

-   Add a feature to allow the suggestion of datasets between cities
-   Explore adding the ability to share collections and browse other peoples collections.
-   Work with MODA to develop a strategy for datasets that have no metadata on the open data portal (for example a lot of the geospatial datasets)

## May 2020

-   Launch to all possible cities that use Socrata as a platform with the ability to easily search between cities as well.
-   Work on making the matching of column names and id's within columns much fuzzier. This could involve looking at some fuzzy matching metrics, manually creating mappings for common id structures (for example BBL as a single entry vs three columns for Borough Block and Lot) or something else entirely.

## June 2002

-   Work to abstract the meta data model so that we can potentially add datasets from other sources (Arcgis, CRAN etc)
-   Migrate the app to typescript to help facilitate this.
-   Build adaptors for these other solutions

## July 2002

-   Integrate ways for people to link projects back to a dataset or collection. For example if a blog post is written about a given dataset, or a derivative dataset is produced, allow individuals to submit these to scout for display alongside that dataset or collection.
-   Build interoperability with the other Data Clinic tools (Smooshrand Newerhoods). This would consist of adding "Open in X" buttons for both tools and even potentially embedding a cut down version of scout in those apps to allow the direct browsing of datasets within them.

## August 2020

-   Start developing smart ways to link datasets at an entity level (school, BBL number, council_district etc). Integrate these as a new browsing option within scout.
