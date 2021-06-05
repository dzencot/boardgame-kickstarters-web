// @ts-check

import { combineReducers } from '@reduxjs/toolkit';
import modal, { actions as modalActions } from './modal.js';
import kickstartersInfo, { actions as kickstartersActions } from './kickstartersInfo.js';
import contractsInfo, { actions as contractsActions } from './contractsInfo.js';
import pledgesInfo, { actions as pledgesActions } from './pledgesInfo.js';
import projectsInfo, { actions as projectsActions } from './projectsInfo.js';
import projectContractsInfo, { actions as projectContractsActions } from './projectContractsInfo.js';

const actions = {
  ...modalActions,
  ...kickstartersActions,
  ...contractsActions,
  ...pledgesActions,
  ...projectsActions,
  ...projectContractsActions,
};

export {
  actions,
};

export default combineReducers({
  modal,
  kickstartersInfo,
  contractsInfo,
  pledgesInfo,
  projectsInfo,
  projectContractsInfo,
});
