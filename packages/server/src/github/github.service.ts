import axios from 'axios';
import { Injectable } from '@nestjs/common';
import scrapeIt from 'scrape-it';
import { CommitResult, CodeResult } from './types';

function githubURLConverter(urlStr: string) {
  if (urlStr.startsWith('/')) {
    return `https://github.com${urlStr}`;
  }
  return urlStr;
}

const COMMIT_REPO_SELECTOR = 'a.Link--secondary';
const COMMIT_LABEL_SELECTOR = 'a.message';

// parser config for scrape-it so that it knows how to pull
// the commit information we need
const COMMIT_RESULT_SCRAPER_CONFIG = {
  commitResults: {
    listItem: '#commit_search_results .commits-list-item',
    data: {
      repoLabel: COMMIT_REPO_SELECTOR,
      repoURL: {
        selector: COMMIT_REPO_SELECTOR,
        attr: 'href',
        convert: githubURLConverter,
      },
      commitLabel: COMMIT_LABEL_SELECTOR,
      commitURL: {
        selector: COMMIT_LABEL_SELECTOR,
        attr: 'href',
        convert: githubURLConverter,
      },
      commitDate: {
        selector: '.commit-meta relative-time',
        attr: 'datetime',
      },
      commitDescription: '.commit-desc pre',
    },
  },
};

@Injectable()
export class GithubService {
  async getGithubCommitSearchResults(
    datasetId: string,
    githubAuthToken: string,
  ): Promise<CommitResult[]> {
    if (githubAuthToken) {
      const response = await axios.get(
        `https://api.github.com/search/commits?q=${datasetId}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: githubAuthToken,
          },
        },
      );
      if (response.status === 200) {
        // transform the data returned by GitHub API to what we need
        return response.data.items.map(
          (result: {
            html_url: string;
            repository: { html_url: string; full_name: string };
            commit: { message: string; committer: { date: string } };
          }) => {
            const { repository, commit, html_url } = result;
            const commitMsgParts = commit.message.split('\n');
            const commitMessage = commitMsgParts[0];
            const commitDescription = commitMsgParts.slice(1).join('\n');
            return {
              repoLabel: repository.full_name,
              repoURL: repository.html_url,
              commitLabel: commitMessage,
              commitURL: html_url,

              // TODO: format date?
              commitDate: commit.committer.date,
              commitDescription: commitDescription,
            };
          },
        );
      } else {
        throw new Error(
          `ERROR: github COMMITS search failed (using API). Response status ${response.status}`,
        );
      }
    }

    // If we have no auth token then scrape for results straight from github
    const { data, response } = await scrapeIt<{
      commitResults: CommitResult[];
    }>(
      `https://github.com/search?q=${datasetId}&type=commits`,
      COMMIT_RESULT_SCRAPER_CONFIG,
    );

    if (response.statusCode === 200) {
      return data.commitResults;
    }

    throw new Error(
      `ERROR: github commit search failed (using web scraper). Response status ${response.status}`,
    );
  }

  // TODO: this one requires authentication
  async getGithubCodeSearchResults(
    datasetId: string,
    githubAuthToken: string,
  ): Promise<CodeResult[]> {
    console.log(githubAuthToken);
    if (githubAuthToken) {
      const response = await axios.get(
        `https://api.github.com/search/code?q=${datasetId}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: githubAuthToken,
          },
        },
      );

      if (response.status === 200) {
        console.log(response.data);
        return response.data.items.map(
          (result: {
            html_url: string;
            path: string;
            repository: { html_url: string; full_name: string };
          }) => {
            const { repository, html_url, path } = result;

            // get the last 2 parts of the path
            const pathParts = path.split('/').slice(-2);
            const fileLabel = pathParts.join('/');

            return {
              repoLabel: repository.full_name,
              repoURL: repository.html_url,
              codeFileLabel: fileLabel,
              codeFileURL: html_url,
            };
          },
        );
      } else {
        throw new Error(
          `ERROR: github CODE search failed (using API). Response status ${response.status}`,
        );
      }
    } else {
      return [];
    }
  }
}
