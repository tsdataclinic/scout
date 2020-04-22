# Getting started with scout 

Thanks for trying out _scout_, a new way to explore the New York City (NYC) Open Data portal. This document will walk you through some exercises to help you get familiar with _scout_'s features.

To get started, load up _scout_ in another browser tab or window by going to this link: [https://www.twosigma.com/scout](https://www.twosigma.com/scout)

Let's dive in!

## Home page - searching and filtering

When you first load up _scout_ you should see a page like this:

![scout main page](https://tsdataclinic.github.io/scout/tutorial_images/home_page.png)

This page shows a list of the 2,800+ datasets from NYC Open Data, complete with their title, a short description, and information about when the dataset was last updated.

Currently the datasets are ordered by name, but you can change that by selecting a different option at the top right of the screen. You can sort by the names of the datasets, when they were created, when they were last updated, and how many views or downloads they've had through NYC Open Data. You can also use the small triangle next to the sort by column to to switch between ascending ▲ and descending ▼ ordering. 

Each page shows a maximum of about 5 datasets, but you can see more by clicking the page links at the bottom of the screen.


With over 2,800 datasets, it would take a long time to go through each page and search for something specific. To make it easier, _scout_ allows you to search and filter datasets in a number of different ways.

Click the **Filters** strip to the left of the dataset list to expand it.

![scout filters collapsed](https://tsdataclinic.github.io/scout/tutorial_images/filters_expanded.png)

Doing so uncovers four different ways you can filter the currently shown datasets:

- **Categories**: Filter by thematic categories assigned to datasets on NYC Open Data. For example: education, finance, infrastructure, demographics, etc.
- **Departments**: Filter by the department that uploaded the data. For example: Department of Education (DOE), Department of Transportation (DOT), etc.
- **Columns**: Filter for datasets that have a specific column label. For example: BBL (Borough-Block-Lot), School Name, Community Board, etc.
- **Tags**: Filter by descriptive tags assigned to datasets on NYC Open Data. Notes that tags can be added to a dataset by City agencies or by members of the public. For example: gis, parks, client inquiries, etc

Some filters, like **Columns** and **Tags**, include a large amount of entries (16,550 and 3,160, respectively). To make it easier to find the values you want to filter on, scout allows you to search within each filter. For example, searching for "school" in the **Columns** filter gives only those columns that include the word school.


![scout filter filters](https://tsdataclinic.github.io/scout/tutorial_images/filters_search.png)


Selecting multiple column names under the **Columns** filter, for example _School Name_, _School Type_, and _School Year_, will show any dataset that includes at least one of those columns


![scout filter active](https://tsdataclinic.github.io/scout/tutorial_images/filters_selected.png)

Now the datasets list narrows to show only those that have been published by the Department of Education (DOE) and contain at least one of the columns selected.

That still leaves around 223 datasets! You can then use _scout_'s search feature to narrow that down a little further.

In the top bar, you can search the names and descriptions of datasets for a specific term. Say you are interested in finding information related to math in NYC schools. Simply enter “math” into the search bar, and the list should narrow down to only 20 datasets.

![scot filtered by math](https://tsdataclinic.github.io/scout/tutorial_images/search_math.png)

## Dataset page - finding interesting datasets to join to

Great, you can then look in closer detail to the _2013-2018 School Math Results_ dataset. Simply click on the name of that dataset to see the following page:

![dataset page](https://tsdataclinic.github.io/scout/tutorial_images/dataset_page.png)

The dataset page shows information on the dataset itself. The left hand side of the page displays the dataset's name, full description, and associated metadata, as well as a button to view the dataset on NYC Open Data.

On the right, you will see a list of other recommended datasets that you might want to explore. This is the heart of scout: it automatically suggests datasets that might be useful based on your interest in the current dataset. Now take a look at the 
**Potential Join Columns** tab.


![potential join column tab](https://tsdataclinic.github.io/scout/tutorial_images/potential_join_columns.png)

This tab shows a list of columns that exist in the current dataset along with the type of each column. On the far right, you can see a number indicating how many additional datasets in NYC Open Data also have that column. Why is this useful? For some columns, like _latitude_ or _longitude_, this might not tell us much about the dataset apart from the fact that it has some geographical information. However, for columns that contain a common identifier, like _DBN_, _School Name_, or _BBL_, this can give an idea of how many datasets this dataset can be joined with.

What exactly does join mean? Well, the dataset you are currently looking at is _2013-2018 School Math Results_. Perhaps not surprisingly, it contains data about how students at a particular school did on their math exams in the years 2013 to 2018. Looking at the columns list, however, it doesn't tell you much about the schools themselves.

_Scout_ is helpfully informing you that there are 305 datasets that share the column _DBN_. DBN stands for "District Borough Number," which is NYC’s unique school identifier. One of those datasets might tell you more about each of the schools within the current dataset.

By clicking on the _DBN_ entry in the **Column** list, you can see all the other datasets that share the _DBN_ column:

![dbn expand](https://tsdataclinic.github.io/scout/tutorial_images/dbn_expanded.png)

_Scout_ also provides the percentage of overlap in IDs matched, in relation to the number of IDs in the reference dataset (in this case, _2013-2018 School Math Results_). For example, 97% of the IDs found in _2013-2018 School Math Results_ are also found in _2017-2018 SCHOOL LEVEL CLASS SIZE REPORT_.

A lot of the datasets in the _DBN_ joinable list are other exam results for other years. This is great, as it may enable comparisons in math results from a school over time and to other types of exams. You also see entries for _2017 - 2018 Average Class Size Report School K-8_ and _2017 - 2018 November2017 Avg Class Size School K8 - Open Data Portal_, which may provide information about the class sizes at different schools. Joinable data such as historical exam results and class sizes can give important context to the original dataset. 
Clicking on the _2017 - 2018 November2017 Avg Class Size School K8 - Open Data Portal_ entry will show some of the common ids that exist in both datasets:

![expand ids](https://tsdataclinic.github.io/scout/tutorial_images/ids_expanded.png)

## Collections - building your library of datasets.

Now that you have found some datasets to combine together, it’s important to not lose track of them. To do this, you can use another handy feature of _scout_: collections. On the left side of the page, under the dataset description, you will see a button labeled _Add to Collection_. Click this, and you will see a red circle with the number 1 on it appear next to the **Collections** button on the navigation bar to the far left.

![added collection](https://tsdataclinic.github.io/scout/tutorial_images/collection_number.png)

Next, click on the **Collections** button to see what just happened.

![collections expanded](https://tsdataclinic.github.io/scout/tutorial_images/collection_tab.png)

You should see a pop-up that lists the _2013-2018 School Math Result_ dataset and includes two buttons: _Create Collection_ and _My Collections_. Click on the _Create Collection_ button and enter "School Math Results" as the collection name when prompted, and then click _Create_. You can also add the class size datasets to the current collection by clicking the _Add to collection_ buttons in the **Potential Join Columns** list. Now add both the _2017 - 2018 November2017 Avg Class Size School K8 - Open Data Portal_ and _2018 - 2019 Average Class Size Report School K-8_ datasets to our collection. Doing so, you will notice that the number in the red circle increases to 3 to show the number of datasets in the current collection.

_Scout_ lets you create any number of collections. These can be used as a personal reference, and can also be shared with anyone else on the internet. To see how to do that, click on the _My Collections_ button.


![collections expanded](https://tsdataclinic.github.io/scout/tutorial_images/collections_multi.png)

The **Collections** page shows you all the dataset groupings that you have created. Currently, there is only one collection: _School Math Results_. Clicking through, you can see the list of included datasets, as well as shortcuts to share the collection via social media and directly copy its persistent link. 

![Collection page](https://tsdataclinic.github.io/scout/tutorial_images/collections.png)

Currently, _scout_ stores all of your collections in the browser. This means that if you move to another computer or hard reload the website on your current computer, you will no longer see the same list of collections. The links you use to share the collection, however, always refer exactly to the collection you made. We are currently working on a way to let _scout_ sync collections between users.

For now, go back to the **Explore** page and look at a new dataset. This time, try to find a  dataset about how the city uses its budget. Start by searching for one called "Capital Budget" and click through to its dataset page.


![Capital budget page](https://tsdataclinic.github.io/scout/tutorial_images/capital_budget.png)

According to the description, the dataset “contains capital appropriation data by project type, budget line and source of funds." That's really interesting. Next, start a new collection to keep track of the budget data. Click on the **Collections** button and click _Create Collection_. Enter "City Spending" as the name to create a new empty collection. Now that you have two collections, you should see a new button labeled _Switch Collection_. Clicking this will enable you to switch the collection you are currently adding to. For now, though, begin this new collection by clicking the _Add to Collection_ button for the _Capital Budget_ dataset.

You could find more datasets that can potentially join with the _Capital Budget_ dataset using the **Potential Join Columns** tab as you did before with the math exam results, but this time, check out **Thematically Similar**, the other way _scout_ suggests interesting datasets.


![Thematically Similar](https://tsdataclinic.github.io/scout/tutorial_images/thematically_similar.png)

If you click on that tab, you will see a list of datasets that _scout_ thinks have a similar theme as the current dataset. To do this, _scout_ employs machine learning to find datasets that may pertain to a similar topic based on their names and descriptions. For example, here you can see a lot of datasets about how the city spends money. Some of these have similar words in their titles and descriptions as the _Capital Budget_ dataset, but, notably, _Expense Actuals_ does not. The machine learning used behind the scenes is smart enough to know that they are about a similar topic and offers it up as a suggestion. You can easily add it to your collection as before.

In this tutorial, you have explored some of _scout_’s features. It allows you to quickly filter and search datasets on the New York Open Data portal, find datasets that might easily be joined together or have a similar theme, and create collections of datasets for your own use or for sharing. We think that _scout_ will make everyone's interactions with open data just a little bit easier and hopefully help people find the information they need for their next open source project, or just to satisfy their own curiosity.

~~~~~~~~
