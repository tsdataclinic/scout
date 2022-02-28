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
  async _getGithubCommitSearchResults(): Promise<{
    data: CommitResult;
    response: { statusCode: number };
  }> {
    // Scrape for results straight from github
    return scrapeIt(
      'https://github.com/search?q=43nn-pn8j&type=commits',
      COMMIT_RESULT_SCRAPER_CONFIG,
    );
  }

  // TODO: this one requires authentication
  _getGithubCodeSearchResults(): {
    data: CodeResult;
    response: { statusCode: number };
  } {
    return {
      data: {
        repoURL: 'test',
        repoLabel: 'test',
        codeFileLabel: 'test',
        codeFileURL: 'test',
      },
      response: {
        statusCode: 200,
      },
    };
  }

  async getGithubSearchResults(
    searchType: 'commits' | 'code',
  ): Promise<CodeResult | CommitResult | string> {
    const { data, response } =
      searchType === 'commits'
        ? await this._getGithubCommitSearchResults()
        : this._getGithubCodeSearchResults();

    if (response && response.statusCode === 200) {
      // success!
      return data;
    } else {
      // failure!! :'(
      console.log('Failure');
      return 'Failure!';
    }
  }
}
