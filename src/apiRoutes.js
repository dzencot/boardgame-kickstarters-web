// @ts-check

const apiPath = process.env.REACT_APP_API_URL;

export default { // eslint-disable-line
  apiPath: () => apiPath,
  projectPath: () => [apiPath, 'projects'].join('/'),
  projectContracts: () => [apiPath, 'project-contracts'].join('/'),
  kickstartersSearchPath: () => [apiPath, 'kickstarters', 'search'].join('/'),
  kickstartersPath: () => [apiPath, 'kickstarters'].join('/'),
};
