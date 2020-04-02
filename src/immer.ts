import { produce, Draft } from "immer";

import { Reducer, rootReducer as buildReducer } from "./deeds";

export { ActionDeed, Deed, actionCreators, Reducer } from "./deeds";

interface DraftReducerMap<S = unknown> {
  [key: string]: (state: Draft<S>, ...args: unknown[]) => void;
}

type ImmutableReducer<S, R> = R extends (state: Draft<S>, ...args: infer A) => void ? (state: S, ...args: A) => S : never;

export type ImmutableReducerMap<S, M> = {
  [K in keyof M]: ImmutableReducer<S, M[K]>;
};

export function immutableReducers<S, M extends DraftReducerMap<S>>(reducers: M): ImmutableReducerMap<S, M> {
  let newReducers = {};
  for (let [type, reducer] of Object.entries(reducers)) {
    newReducers[type] = produce(reducer);
  }

  return newReducers as ImmutableReducerMap<S, M>;
}

export function rootReducer<S>(reducers: DraftReducerMap<S>): Reducer<S> {
  let newReducers = immutableReducers<S, typeof reducers>(reducers);
  return buildReducer(newReducers);
}
