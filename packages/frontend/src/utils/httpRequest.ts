type API = {
  '/api/github/authenticate': { token: string | null };
  '/api/github/search/commits/:datasetId': {
    urlParams: { datasetId: string };
    returns: Array<{
      repoLabel: string;
      repoURL: string;
      commitLabel: string;
      commitURL: string;
      commitDate: string;
      commitDescription: string;
    }>;
  };
  '/api/github/search/code/:datasetId': {
    urlParams: { datasetId: string };
    returns: Array<{
      repoURL: string;
      repoLabel: string;
      codeFileLabel: string;
      codeFileURL: string;
    }>;
  };
};

type HTTPRequestConfig = {
  body?: Record<string, unknown>;
  urlParams?: Record<string, unknown>;
  headers?: Record<string, string>;
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE';
  token?: string;
};

/**
 * This is a simple wrapper around the `fetch` API to make life easier for us.
 * It is lightly based off of the wrapper used by Kent C. Dodds here:
 * https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper
 */
export default async function httpRequest<Endpoint extends keyof API>(
  endpoint: Endpoint,
  config: API[Endpoint] extends { params: Record<string, unknown> }
    ? HTTPRequestConfig & { urlParams: API[Endpoint]['params'] }
    : HTTPRequestConfig,
): Promise<
  API[Endpoint] extends { returns: unknown }
    ? API[Endpoint]['returns']
    : API[Endpoint]
> {
  const { body, headers, token, urlParams, ...customConfig } = config || {};

  // insert urlParams into the endpoint if necessary
  let newEndpoint;
  if (endpoint.includes(':') && urlParams) {
    const urlParts = endpoint.split('/');
    // replace all tokens starting with a colon with their value in `urlParams`
    const newParts = urlParts.map(part => {
      if (part.startsWith(':')) {
        const tokenName = part.slice(1);
        return tokenName in urlParams ? urlParams[tokenName] : part;
      }
      return part;
    });
    newEndpoint = newParts.join('/');
  } else {
    newEndpoint = endpoint;
  }

  // build headers
  const newHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    newHeaders.Authorization = `Token ${token}`;
  }

  const newConfig = {
    method: config?.method ?? (config?.body ? 'POST' : 'GET'),
    headers: {
      ...newHeaders,
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...customConfig,
  };

  const response = await window.fetch(newEndpoint, newConfig);
  if (response.ok) {
    return response.json();
  }

  const errorMessage = await response.text();
  return Promise.reject(new Error(errorMessage));
}
