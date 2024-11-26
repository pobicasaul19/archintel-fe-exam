const getBaseUrl = (path: string) => path;

type CrudEndpoints = {
  GET_ALL: string;
  POST: string;
  // GET_DETAILS: (uuid: string) => string;
  // PUT_DETAILS: (uuid: string) => string;
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
    DELETE: (id: number) => `${getBaseUrl(base)}/${id}`,
  };

  return { ...crud, ...additionalEndpoints } as CrudEndpoints & T;
};


// Endpoints related to authentication operations.
export const AUTH_ENDPOINTS = {
  POST_LOGIN: getBaseUrl("auth/login"),
  POST_SIGNUP: getBaseUrl("auth/register"),
};

// USER_ENDPOINTS
export const USER_ENDPOINTS = createCrudEndpoints("users");
