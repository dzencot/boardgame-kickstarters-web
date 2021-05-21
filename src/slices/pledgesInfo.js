// @ts-check
/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove';

const slice = createSlice({
  name: 'pledgesInfo',
  initialState: {
    pledges: [],
  },
  reducers: {
    setPledges: (state, { payload }) => {
      const { pledges } = payload;
      state.pledges = pledges;
    },
    addPledge: (state, { payload }) => {
      const { pledge } = payload;
      state.pledges.push(pledge);
    },
    removePledge: (state, { payload }) => {
      const { pledgeId } = payload;
      remove(state.pledges, ({ id }) => id === pledgeId);
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
