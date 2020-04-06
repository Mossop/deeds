/* eslint-disable @typescript-eslint/no-explicit-any */
import { produce, Immutable } from "immer";

import { Reducer, makeReducer } from "./base";
import { baseReducer as buildReducer, ActionReducerMap } from "./deeds";

export { actionCreators } from "./deeds";
export { Deed, ActionDeed, Reducer } from "./base";

type DraftActionReducer<S, A extends any[] = any[]> = (state: S, ...args: A) => void;

interface DraftActionReducerMap<S = unknown> {
  [key: string]: DraftActionReducer<S>;
}

function immutableReducers<
  S,
>(reducers: DraftActionReducerMap<S>): ActionReducerMap<Immutable<S>> {
  let newReducers = {};
  for (let [type, reducer] of Object.entries(reducers)) {
    newReducers[type] = produce(reducer);
  }

  return newReducers as ActionReducerMap<Immutable<S>>;
}

/**
 * Creates a reducer function that accepts the store's state and an action and passes it to the
 * appropriate reducer function property of the passed reducers object.
 */
export function baseReducer<S>(reducers: DraftActionReducerMap<S>): Reducer<Immutable<S>> {
  let newReducers = immutableReducers<S>(reducers);
  return buildReducer<Immutable<S>>(newReducers);
}

/**
 * Creates a reducer function that accepts the store's state and an action. If the state is
 * undefined then an exception is thrown, otherwise the actiion is passed to the appropriate reducer
 * function property of the passed reducers object.
 */
export function reducer<S>(
  reducers: DraftActionReducerMap<S>,
): Reducer<Immutable<S> | undefined, Immutable<S>> {
  return makeReducer<Immutable<S>>(reducers, baseReducer);
}
