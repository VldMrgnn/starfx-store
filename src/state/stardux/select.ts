import { createSelector } from "reselect";
import type { RootState } from "../rootStore";

const _selectSlice =
  <K extends keyof RootState>(sliceName: K) =>
  (s: RootState) =>
    s[sliceName];
/**
 * Selector of a whole slice, by slice name
 * @date 7/27/2023 - 11:30:22 AM
 *
 * @param {K} sliceName
 * @returns { (s: RootState) => RootState[K] }
 * @example const selectApp = selectSlice('app');
 */
export const selectSlice = <K extends keyof RootState>(sliceName: K) =>
  createSelector(_selectSlice(sliceName), (s) => s);
