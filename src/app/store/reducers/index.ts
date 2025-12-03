import {
  ActionReducerMap,
  createSelector,
} from '@ngrx/store';
import * as fromLayout from './layout-reducers';

export interface RootReducerState {
  layout: fromLayout.LayoutState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
  layout: fromLayout.layoutReducer,
};

// Create a selector to retrieve the initial Layout state
export const getLayoutState = (state: RootReducerState) => state.layout;

export const getLayoutTheme = createSelector(
  getLayoutState,
  fromLayout.getLayoutTheme
);
export const getLayoutMode = createSelector(
  getLayoutState,
  fromLayout.getLayoutMode
);
export const getLayoutWith = createSelector(
  getLayoutState,
  fromLayout.getLayoutWidth
);
export const getLayoutPosition = createSelector(
  getLayoutState,
  fromLayout.getLayoutPosition
);
export const getTopbarColor = createSelector(
  getLayoutState,
  fromLayout.getTopbarColor
);
export const getSidebarSize = createSelector(
  getLayoutState,
  fromLayout.getSidebarSize
);
export const getSidebarView = createSelector(
  getLayoutState,
  fromLayout.getSidebarView
);
export const getSidebarColor = createSelector(
  getLayoutState,
  fromLayout.getSidebarColor
);
export const getSidebarImage = createSelector(
  getLayoutState,
  fromLayout.getSidebarImage
);
export const getPreloader = createSelector(
  getLayoutState,
  fromLayout.getPreloader
);
