# Getting started with scout 

Thanks for trying out scout, a new way to explore the New York City open data portal. This document will walk you through some exercises to help you get familiar with  scout's features. 

To get started, load up scout in another browser tab or window by going to this link: [https://twosigma.com/scout](https://twosigma.com/scout)

Let's dive in! 

## Home page - searching and filtering

When you first load up scout you should see a page like this 

![scout main page](https://tsdataclinic.github.io/scout/tutorial_images/home_page.png)

This page shows a list of all of the 2800 datasets from the New York City open data portal, complete with their title, a short description and information about when the dataset was last updated.



 Currently they are ordered by name but you can change that by selecting a different option at the top left of the screen. You can sort by name, created at, updated at, views or downloads. You can also use the small triangle next to the sort by column to to switch between ascending and descending ordering.
 


Each page shows a maximum of about 5 datasets, but you can see more by clicking the page links at the bottom of the screen.



With 2800 datasets, it would take a long time to go through each page and search for something that we are interested in. To make it easier to find what you are looking for, scout allows you to search and filter datasets in a number of different ways.

Let’s start by looking at the filters. Click the Filters strip next to the dataset list to expand it.

![scout filters collapsed](https://tsdataclinic.github.io/scout/tutorial_images/filters_expanded.png)



Doing so we see 4 different ways we can filter the currently shown datasets : 

- Categories: filter by categories assigned to datasets on the open data portal. For example : education, finance, infrastructure, demographics etc
- Departments : filter by the department that uploaded the data. For example: Department of Education(DOE), Department of Transportation (DOT) etc
- Columns: Filter for datasets that have a specific column. For example BBL, School Name, community board etc,
- Tags: Filter for datasets that have a specific tag. These can be added to a dataset by either the city or by members of the public. For example: gis, parks, client inquiries etc 

You might notice for some the filters  like columns and tags there are a lot of entries for example there are 16,550 possible column names and 3,160 different tags. To make it easier to find the entry you want to filter on, scout allows you to search within each filter. 

For example searching for school in the Columns filter gives only those columns that match school.

![scout filter filters](https://tsdataclinic.github.io/scout/tutorial_images/filters_search.png)

Let's narrow down our search by selecting "Department of Education ( DOE )" in the departments filter and "School Name", "School Type", "School Year" and "School" in hte column name. 


![scout filter active](https://tsdataclinic.github.io/scout/tutorial_images/filters_selected.png)

We can see that the datasets list narrows down to show us only datasets that have been published by the Department of Education and contain at least one of the columns we have selected. 

That still leaves us around 223 datasets! Let's use scouts search feature to narrow that down a little further. 

In the top bar you can search the names and descriptions of datasets for a specific term. Let's say we are interested in finding datasets that are to do with  "Math" in New York schools. Simply enter math in to the top bar and the datasets should narrow down further to show only 20. 

![scot filtered by math](https://tsdataclinic.github.io/scout/tutorial_images/search_math.png)

## Dataset page - finding interesting datasets to join to.

Great, let's look in some closer detail to the "2013 -2018 School Math Results" dataset. Simply click on the name of that dataset to see the following page:

![dataset page](https://tsdataclinic.github.io/scout/tutorial_images/dataset_page.png)

The dataset page shows us information on the dataset itself, including on the left hand side of the page, the datasets name, its full description, associated metadata and a button to view the dataset on the Open Data portal website. 



On the right we see a list of other recommended datasets that you might want to explore. This is the heart of scout, it tries to automatically suggest datasets to you that might be useful or interesting based on your interest in the current dataset. Let's take a look at the "Potential Join Columns" tab. 

![potential join column tab](https://tsdataclinic.github.io/scout/tutorial_images/potential_join_columns.png)

This tab shows a list of columns that exist in the current dataset along with the type of each column. On the far right, you can see a number which lists the number of other datasets on the open data portal that also have that column. Why is this useful? For some columns, like latitude or longitude, this might not tell us much about the dataset apart from the fact that it has some geographical information. However for columns that contain a common identifier, like "DBN", "School Name" or "BBL", this can give an idea of how many datasets this dataset can be joined with. What do we mean by join? Well the dataset we are currently looking at is the Math Exam results by school for 2013 - 2018, Perhaps not surprisingly, it contails data about  how students at a particular school did on their math exams in the years 2013 to 2018. Looking at the columns list however it doesn't tell us much about the school itself.


However scout is helpfully informing us that there are 305 datasets that share the column DBN. DBN stands for "District Borough Number" which is a unique identifier that the city uses to identify a school. One of those might tell us more about each of the schools within the current datasets. Let's go hunting for a dataset that might tell us more about the schools.

![dbn expand](https://tsdataclinic.github.io/scout/tutorial_images/dbn_expanded.png)

By clicking on the DBN entry in the list, we can see a list of each of the datasets that have DBN as a column. When you do this, scout will quickly query each dataset to see what the overlap is of DBN numbers in the current dataset and each other dataset with DBN as a column. It will report the % of overlap between the datasets or the number of matches we would expect if we join the two datasets.

A lot of these datasets are other exam results for other years. This is great as it lets us compare the math results from a school over time and to other types of exams. We also see entries for "2017 - 2018 Average Class Size Report School K-8" and  "2017 - 2018 November2017 Avg Class Size School K8 - Open Data Portal' which can provide us information about the class sizes at each of the schools that we have exam results for.

This is really useful information that can give important context to the original dataset. Clicking on the "2017 - 2018 November2017 Avg Class Size School K8 - Open Data Portal" entry will show us some of the common ids that exist in both datasets. 

![expand ids](https://tsdataclinic.github.io/scout/tutorial_images/ids_expanded.png)

## Collections - building your library of datasets.

Now that we have found some datasets we might want to combine together, we want to make sure we don't lose track of them. To do this we can use another handy feature of scout: collections. On the left side of the page where the dataset details are presented, you will see a button called "Add to Collection". Click this and you will see a red circle with the number 1 on it appear next to the "Collections" button on the navigation bar to the far left. 

![added collection]((https://tsdataclinic.github.io/scout/tutorial_images/collection_number.png)
Next let's click on the collections button to see what has just happened. 

![collections expanded](https://tsdataclinic.github.io/scout/tutorial_images/collection_tab.png)

You should see the "2013-2018 School Math Results'' dataset listed and a button to create a collection. Click on the Create Collection button and enter "School Math Results'' as the collection name when prompted and then click "Create". We can also add the class size datasets to the current collection by clicking the Add to collection buttons in the "Potential Join Columns'' list. Let's add both the "2017 - 2018 November2017 Avg Class Size School K8 - Open Data Portal" and "2018 - 2019 Average Class Size Report School K-8" datasets to our collection. Doing so, you will notice that the number in the red circle increments to 3 to show the number of datasets in the current collection. 

scout let's us create any number of collections. These can be used as  a personal reference but can also be shared with anyone else on the internet. To  see how we do that. Let's click on the "My Collections'' button.  

![collections expanded](https://tsdataclinic.github.io/scout/tutorial_images/collections_multi.png)

The collections page shows you a list of all the collections that you have created. Currently there is only one collection, our "School Math Results" collection. Clicking through on this will show us  each of the datasets within that collection along with a number of buttons that you can use to share your collection on social media along with a link that you can copy to reference this collection anywhere you want. 

![Collection page](https://tsdataclinic.github.io/scout/tutorial_images/collections.png)

Currently, scout stores all of your collections in the browser. This means that if you move to another computer, you won't see the same list of collections. The links you use to share the collection will however always refer exactly to the collection you made. We are currently working on a way to let scout sync collections between users.

For now let's go back to the explore page and look at a new dataset. This time let's look for datasets about how the city uses its budget. Let's search for the dataset called "Capital Budget" and click through to it's dataset page.

![Capital budget page](https://tsdataclinic.github.io/scout/tutorial_images/capital_budget.png)

According to the description:  "This dataset contains capital appropriation data by project type, budget line and source of funds". That's really interesting. Let's start a new collection to keep track of our budget data. Click on the collections tab again and click "Create Collection". Enter "City Spending" as the name to create a new empty collection. Now that we have two collections, you should see a new button called "Switch Collection" appear. Clicking this will let you quickly switch the collection that you are currently adding to. For now though let's start this new collection off by clicking the "Add to Collection" button for the "Capital Budget" dataset.

We could find more datasets that can potentially join with the "Capital Budget" dataset using the "Potential Join Columns" dataset as we did before with the Math results but let's this time check out "Thematic Similarity" the other way we can suggest interesting datasets. 

![Thematically Similar](https://tsdataclinic.github.io/scout/tutorial_images/thematically_similar.png)

If you click on that tab you will see a list of datasets that scout thinks have a similar theme as the current dataset. To this, scout uses some machine learning to try and find datasets that have a similar topic to the current dataset based on their name and description. For example, here we see a lot of datasets about how the city spends money. Some of these have similar words in their titles and descriptions as the "Capital Budget" dataset but notable "Expense Actuals'' doesn't. The machine learning we use behind the scenes is smart enough to know that they are about a similar topic and are able to offer it up as a suggestion. We can easily add it to our collection as before.

In this tutorial we have explored some of the features scout provides. It allows you to quickly filter and search datasets on the New York Open Data portal, find datasets what might easily be joined together or have a similar theme and finally it allows us to create collections of datasets for our own use or for sharing with others. 

We think that scout will make everyone's interactions with open data just that little bit easier and help everyone out there find the information they need about New York for their next open source project, their next urban infrastructure class or just to satisfy their own curiosity. 




~~~~~~~~
