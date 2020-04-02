import { Immutable } from "immer";
import { assert, _ } from "spec.ts";

import { rootReducer, actionCreators, Deed, ActionDeed, immutableReducers } from "../immer";

interface State {
  value: number;
}

let reducers = {
  add: (state: State, val: number): void => {
    state.value += val;
  },
  del: (state: State, val: number): void => {
    state.value -= val;
  },
  sum: (state: State, values: number[]): void => {
    values.forEach((v: number) => state.value += v);
  },
  addMult: (state: State, a: number, b: number): void => {
    state.value += a * b;
  }
};

let reducer = rootReducer(reducers);
let actions = actionCreators(reducers);

// Reducer should have correct type.
assert(reducer, _ as (state: Immutable<State>, action: Deed) => Immutable<State>);

// Action creators should have the correct types.
interface ExpectedActions {
  add: (value: number) => ActionDeed<"add", [number]>;
  del: (value: number) => ActionDeed<"del", [number]>;
  sum: (value: number[]) => ActionDeed<"sum", [number[]]>;
  addMult: (a: number, b: number) => ActionDeed<"addMult", [number, number]>;
}
assert(actions, _ as ExpectedActions);

let immutable = immutableReducers(reducers);
interface ImmutableReducers {
  add: (state: Immutable<State>, val: number) => Immutable<State>;
  del: (state: Immutable<State>, val: number) => Immutable<State>;
  sum: (state: Immutable<State>, vals: number[]) => Immutable<State>;
  addMult: (state: Immutable<State>, a: number, b: number) => Immutable<State>;
}

assert(immutable, _ as ImmutableReducers);
