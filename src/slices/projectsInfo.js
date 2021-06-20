// @ts-check
/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove';

const slice = createSlice({
  name: 'projectsInfo',
  initialState: {
    projects: [],
    allCount: 0,
  },
  reducers: {
    setProjects: (state, { payload }) => {
      const { projects, allCount } = payload;
      state.projects = projects;
      state.allCount = allCount;
    },
    addProject: (state, { payload }) => {
      const { project } = payload;
      state.projects.push(project);
    },
    removeProject: (state, { payload }) => {
      const { projectId } = payload;
      remove(state.projects, ({ id }) => id === projectId);
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
