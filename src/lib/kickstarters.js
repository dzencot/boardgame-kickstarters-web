// @ts-check

import axios from 'axios';

import route from '../routes.js';
import getAuthToken from './auth.js';

const parseKickstartersJson = (jsonData) => {
  const { projects } = jsonData;
  const result = projects.map((project) => ({
    kickstarter: {
      title: project.name,
      url: project.urls.web.project,
      kickstarter_id: project.id.toString(),
      start_date: new Date(project.launched_at),
      finish_date: new Date(project.deadline),
      slug: project.slug,
      json: JSON.stringify(project),
    },
    images: {
      key: project.photo.key,
      full: project.photo.full,
      ed: project.photo.ed,
      med: project.photo.med,
      little: project.photo.little,
      small: project.photo.small,
      thumb: project.photo.thumb,
      '1024x576': project.photo['1024x576'],
      '1536x864': project.photo['1536x864'],
    },
  }));

  return result;
};

const uploadResources = (kickstarters) => {
  const promises = kickstarters.map(async (kickstarterData) => {
    const { kickstarter, images } = kickstarterData;
    const links = {
      full: images.full,
      ed: images.ed,
      med: images.med,
      little: images.little,
      small: images.small,
      thumb: images.thumb,
    };

    const uploadDataKick = await axios({
      method: 'post',
      url: route.kickstartersPath(),
      data: kickstarter,
      headers: {
        Authorization: getAuthToken(),
      },
    });
    const dataKick = uploadDataKick.data;

    console.log('uploadKick:', uploadDataKick);

    const imagesUploadPromises = Object.entries(links).map(async ([imageType, link]) => {
      const imageData = await axios.get(link, { responseType: 'arraybuffer' });
      console.log('imageData', imageData);

      const image = new Blob([imageData.data], { type: 'image/jpg' });
      const fileName = `${kickstarter.slug}-${imageType}`;

      const uploadData = new FormData();
      uploadData.append('files', image, fileName);
      uploadData.append('path', 'kickstarters');
      uploadData.append('refId', dataKick.id);
      uploadData.append('ref', 'kickstarter');
      uploadData.append('field', `image_${imageType}`);

      const uploadedResponse = await axios({
        method: 'post',
        url: route.uploadImagePath(),
        data: uploadData,
        headers: {
          Authorization: getAuthToken(),
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('uploadData:', uploadedResponse);
    });

    return Promise.all(imagesUploadPromises);
  });

  return Promise.all(promises);
};

export default { parseKickstartersJson, uploadResources };
