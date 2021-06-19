// @ts-check
/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove';

const slice = createSlice({
  name: 'kickstartersInfo',
  initialState: {
    kickstarters: [],
    currentPage: 0,
  },
  reducers: {
    setKickstarters: (state, { payload }) => {
      const { kickstarters } = payload;
      state.kickstarters = kickstarters;
    },
    addKickstarter: (state, { payload }) => {
      const { kickstarter } = payload;
      state.kickstarters.push(kickstarter);
    },
    removeKikstarter: (state, { payload }) => {
      const { kickstarterId } = payload;
      remove(state.kickstarters, ({ id }) => id === kickstarterId);
    },
    selectPage: (state, { payload }) => {
      const { page } = payload;
      state.currentPage = page;
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
