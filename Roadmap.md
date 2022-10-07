# Roadmap 2022

**This roadmap is out of date and needs updating.**

This document outlines the roadmap for development of Scout.

If you would like to request a new feature or prioritize one over the others, open a GitHub discussion.

## Multi-portal Scout

### GitHub resources search

**Status:** Complete

Allow users to view GitHub resources (commits and code samples) when viewing a dataset.

### Cloud deployment

**Status:** Complete

Deploy Scout to https://scout.tsdataclinic.com using cloud infrastructure to host Elasticsearch, Postgres, and Authentication.

### Un-authenticated workflows

**Status:** Complete

Allow Scout to remain operational without authenticating. Add a way to bypass authentication locally (with a fake authentication token) so developers do not have to set up complicated Azure auth if they are only developing locally.

### Authentication

**Status:** Complete

Add Azure AD B2C authentication to Scout. Authentication should support email/password as well as Facebook and Google accounts. Allow collections to become associated to users in the database.

### Bug fixes and multi-portal features

**Status:** Complete

Allow Scout to explore **all** portals on Socrata instead of just New York City. This is a major design and functionality overhaul that will involve rewriting the majority of the codebase. Also fix many bugs that stand in the way of launching a multi-portal version of Scout.

## Platform Stability

### DevOps

**Status:** Complete

Add CI/CD, improve startup commands, make local set up easier, and simplify production deployment and troubleshooting.

### Public repo polish

**Status:** 95% Complete

Update repository to contain the essentials of an open source repository: issue and PR templates, code of conduct, processes, branch protection rules, instructions on how to contribute, and this roadmap.

**To do:**

- Add public releases with changelogs via the GitHub "Releases" feature.
- Add a public wiki that explains the codebase structure.

### Documentation

**Status:** Complete

Add a readme with clear step-by-step instructions on how to set up Scout locally. Test this documentation out to make sure that all or most potential problems are covered in a Troubleshooting section.

### TypeScript rewrite

**Status:** In Progress

Rewrite all of Scout in TypeScript to make code more maintainable, less buggy, and easier to read.
Change server's TypeScript setting to `strict=true` and fix the type errors.

### High priority bug fixes and usability improvements

**Status:** In Progress

**To do:**

- Remove unused code
- Refactor React component hierarchy to follow best practices and avoid anti-patterns
- Fix GitHub resources feature to avoid any scraping and to use pagination.
- Improvements to browser navigation with history and back button
- Fix filter and sorting functionality

**Done:**

- About & Welcome page improvements to no longer be NY-specific
- Data syncing improvements
- Switch the "shopping cart" model to an "Add to Collection" button and dropdown that lets the users select what collection they want to add a dataset to.
- Allow basic collections management, such as being able to delete a collection.
- Improve the Collections popover by making it easier to navigate through collections and view the datasets they contain. Also make it easier to remove datasets from a collection directly from this popover.

### Integration with [Smooshr](https://smooshr.tsdataclinic.com)

**Status:** Stalled

Allow users to send Scout datasets to Smooshr and vice versa.

This item has been paused pending a re-imagining of Smooshr.

### Add CKAN or other data portal

**Status:** Not started

Add a new open data portal and API, such as CKAN, to Scout to expand the amount of datasets made available.
