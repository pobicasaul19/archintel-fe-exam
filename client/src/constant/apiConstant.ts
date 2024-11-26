const getBaseUrl = (path: string) => path;

type CrudEndpoints = {
  GET_ALL: string;
  POST: string;
  // GET_DETAILS: (uuid: string) => string;
  UPDATE: (_id: number) => string;
  DELETE: (_id: number) => string;
};

type CustomEndpoints = Record<string, (...args: any[]) => string>;

const createCrudEndpoints = <T extends CustomEndpoints = {}>(
  base: string,
  additionalEndpoints?: T
): CrudEndpoints & T => {
  const crud: CrudEndpoints = {
    GET_ALL: getBaseUrl(base),
    POST: getBaseUrl(base),
    UPDATE: (_id: number) => `${getBaseUrl(base)}/${_id}`,
    DELETE: (_id: number) => `${getBaseUrl(base)}/${_id}`,
  };

  return { ...crud, ...additionalEndpoints } as CrudEndpoints & T;
};


// Endpoints related to authentication operations.
export const AUTH_ENDPOINTS = {
  POST_LOGIN: getBaseUrl('auth/login'),
};

// USER_ENDPOINTS
export const USER_ENDPOINTS = createCrudEndpoints('users');
