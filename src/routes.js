// @ts-check

const apiPath = process.env.REACT_APP_API_URL;

export default { // eslint-disable-line
  loginPath: () => [apiPath, 'auth', 'local'].join('/'),
  signupPath: () => [apiPath, 'auth', 'local', 'register'].join('/'),
  dataPath: () => [apiPath, 'data'].join('/'),
  mainPagePath: () => '/',
  loginPagePath: () => '/login',
  signupPagePath: () => '/signup',
  boardgamePath: () => [apiPath, 'boardgame'].join('/'),
  kickstartersPath: () => [apiPath, 'kickstarters'].join('/'),
  apiPath: () => apiPath,
  uploadImagePath: () => [apiPath, 'upload'].join('/'),
  kickstartersPagePath: () => '/kickstarters/:id',
  projectsPagePath: () => '/projects/:id',
  pledgesPath: () => [apiPath, 'pledges'].join('/'),
  contractsPath: () => [apiPath, 'contracts'].join('/'),
  projectPath: () => '/projects',
};
