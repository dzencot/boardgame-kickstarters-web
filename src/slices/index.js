// @ts-check

import { combineReducers } from '@reduxjs/toolkit';
import modal, { actions as modalActions } from './modal.js';
import kickstartersInfo, { actions as kickstartersActions } from './kickstartersInfo.js';

const actions = {
  ...modalActions,
  ...kickstartersActions,
};

export {
  actions,
};

export default combineReducers({
  modal,
  kickstartersInfo,
});
