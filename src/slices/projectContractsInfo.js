// @ts-check
/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'projectContractsInfo',
  initialState: {
    project: {},
    contracts: [],
  },
  reducers: {
    setProjectContractsData: (state, { payload }) => {
      const { project } = payload;
      state.project = project;
      state.contracts = project.contracts;
    },
    addProjectContract: (state, { payload }) => {
      const { contract } = payload;
      state.contracts.push(contract);
    },
  },
});

export const { actions } = slice;
export default slice.reducer;

