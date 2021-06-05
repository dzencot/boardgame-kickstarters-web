// @ts-check

import axios from 'axios';

import route from '../routes.js';
import getAuthToken from './auth.js';

const uploadResources = (project, image) => {
  const fileName = image.name;
  const uploadData = new FormData();
  uploadData.append('files', image, fileName);
  uploadData.append('path', 'projects');
  uploadData.append('refId', project.id);
  uploadData.append('ref', 'project');
  uploadData.append('field', 'image');

  const uploadedResponse = axios({
    method: 'post',
    url: route.uploadImagePath(),
    data: uploadData,
    headers: {
      Authorization: getAuthToken(),
      'Content-Type': 'multipart/form-data',
    },
  });

  return uploadedResponse;
};

export default { uploadResources };
