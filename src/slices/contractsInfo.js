// @ts-check
/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove';

const slice = createSlice({
  name: 'contractsInfo',
  initialState: {
    kickstarter: {},
    pledges: [],
    contracts: [],
  },
  reducers: {
    setContractsData: (state, { payload }) => {
      const { kickstarter } = payload;
      state.kickstarter = kickstarter;
      state.pledges = kickstarter.pledges;
      state.contracts = kickstarter.pledges.flatMap(({ contracts }) => contracts);
    },
    addContract: (state, { payload }) => {
      const { contract } = payload;
      state.contracts.push(contract);
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
