// @ts-check
/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'foundedKickstartersInfo',
  initialState: {
    foundedKickstarters: [],
    currentPage: 1,
  },
  reducers: {
    setFoundedKickstarters: (state, { payload }) => {
      const { foundedKickstarters } = payload;
      state.foundedKickstarters = foundedKickstarters;
    },
    cleanFoundedKickstarters: (state) => {
      state.foundedKickstarters = [];
    },
    switchFoundedKicstarter: (state, { payload }) => {
      const { foundedKickstarterId } = payload;
      const kickstarter = state.foundedKickstarters.find((kick) => {
        const id = kick.kickstarter.kickstarter_id;
        return id === foundedKickstarterId;
      });
      if (kickstarter) {
        kickstarter.selected = !kickstarter.selected;
      }
    },
    selectPage: (state, { payload }) => {
      const { page } = payload;
      state.currentPage = page;
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
