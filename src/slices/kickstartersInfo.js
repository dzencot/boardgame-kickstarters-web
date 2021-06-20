// @ts-check
/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove';

const slice = createSlice({
  name: 'kickstartersInfo',
  initialState: {
    kickstarters: [],
    allCount: 0,
  },
  reducers: {
    setKickstarters: (state, { payload }) => {
      const { kickstarters, allCount } = payload;
      state.kickstarters = kickstarters;
      state.allCount = allCount;
    },
    addKickstarter: (state, { payload }) => {
      const { kickstarter } = payload;
      state.kickstarters.push(kickstarter);
    },
    removeKikstarter: (state, { payload }) => {
      const { kickstarterId } = payload;
      remove(state.kickstarters, ({ id }) => id === kickstarterId);
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
