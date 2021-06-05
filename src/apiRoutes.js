// @ts-check

const apiPath = process.env.REACT_APP_API_URL;

export default { // eslint-disable-line
  apiPath: () => apiPath,
  projectPath: () => [apiPath, 'projects'].join('/'),
};
