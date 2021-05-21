// @ts-check

import { combineReducers } from '@reduxjs/toolkit';
import modal, { actions as modalActions } from './modal.js';
import kickstartersInfo, { actions as kickstartersActions } from './kickstartersInfo.js';
import contractsInfo, { actions as contractsActions } from './contractsInfo.js';
import pledgesInfo, { actions as pledgesActions } from './pledgesInfo.js';

const actions = {
  ...modalActions,
  ...kickstartersActions,
  ...contractsActions,
  ...pledgesActions,
};

export {
  actions,
};

export default combineReducers({
  modal,
  kickstartersInfo,
  contractsInfo,
  pledgesInfo,
});
