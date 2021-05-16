// @ts-check

const apiPath = '/api/v1';

export default { // eslint-disable-line
  loginPath: () => [apiPath, 'login'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),
  dataPath: () => [apiPath, 'data'].join('/'),
  mainPagePath: () => '/',
  loginPagePath: () => '/login',
  signupPagePath: () => '/signup',
};
