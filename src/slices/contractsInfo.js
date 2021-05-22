// @ts-check
/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove';

const slice = createSlice({
  name: 'contractsInfo',
  initialState: {
    kickstarter: {},
    contracts: [],
  },
  reducers: {
    setContractsData: (state, { payload }) => {
      const { kickstarter } = payload;
      state.kickstarter = kickstarter;
    },
    addContract: (state, { payload }) => {
      const { contract } = payload;
      state.contracts.push(contract);
    },
  },
});

export const { actions } = slice;
export default slice.reducer;

