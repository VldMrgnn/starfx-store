import { fxCreateTable } from ".";
export const LOADERS_NAME = "@@starfx/loaders";
export const loaders = fxCreateTable({
  name: LOADERS_NAME,
  initialState: {},
});

// export const {
//   loading: setLoaderStart,
//   error: setLoaderError,
//   success: setLoaderSuccess,
//   resetById: resetLoaderById,
// } = loaders.actions;
// export const { selectTable: selectLoaders, selectById: selectLoaderById } =
//   loaders.getSelectors((state: any) => state[LOADERS_NAME] || {});
