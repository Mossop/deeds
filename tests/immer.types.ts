import { Draft } from "immer";
import { assert, _ } from "spec.ts";

import { reducer, baseReducer, actionCreators, Deed, ActionDeed } from "../src/immer";

interface State {
  readonly value: number;
}

let reducers = {
  add: (state: Draft<State>, val: number): void => {
    state.value += val;
  },
  del: (state: Draft<State>, val: number): void => {
    state.value -= val;
  },
  sum: (state: Draft<State>, values: number[]): void => {
    values.forEach((v: number): number => state.value += v);
  },
  addMult: (state: Draft<State>, a: number, b: number): void => {
    state.value += a * b;
  },
};

let base = baseReducer(reducers);
let main = reducer(reducers);
let actions = actionCreators<typeof reducers>();

// Reducer should have correct type.
assert(base, _ as (state: State, action: Deed) => State);
assert(main, _ as (state: State | undefined, action: Deed) => State);

// Action creators should have the correct types.
interface ExpectedActions {
  add: (value: number) => ActionDeed<"add", [number]>;
  del: (value: number) => ActionDeed<"del", [number]>;
  sum: (value: number[]) => ActionDeed<"sum", [number[]]>;
  addMult: (a: number, b: number) => ActionDeed<"addMult", [number, number]>;
}
assert(actions, _ as ExpectedActions);
