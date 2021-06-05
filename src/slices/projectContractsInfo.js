// @ts-check
/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'projectContractsInfo',
  initialState: {
    project: {},
    projectContracts: [],
  },
  reducers: {
    setProjectContractsData: (state, { payload }) => {
      const { project } = payload;
      state.project = project;
      state.projectContracts = project['project-contracts'] || [];
    },
    addProjectContract: (state, { payload }) => {
      const { projectContract } = payload;
      state.projectContracts.push(projectContract);
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
