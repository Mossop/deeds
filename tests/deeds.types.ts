import { assert, _ } from "spec.ts";

import { reducer as buildReducer, actions as buildActions, Deed } from "..";

let reducers = {
  add: (state: number, val: number): number => {
    return state + val;
  },
  del: (state: number, val: number): number => {
    return state - val;
  },
  sum: (state: number, values: number[]): number => {
    values.forEach((v: number) => state += v);
    return state;
  },
  addMult: (state: number, a: number, b: number): number => {
    return state + a * b;
  }
};

let reducer = buildReducer(reducers);
let actions = buildActions(reducers);

// Reducer should have correct type.
assert(reducer, _ as (state: number, action: Deed) => number);

// Action creators should have the correct types.
interface ExpectedActions {
  add: (value: number) => Deed;
  del: (value: number) => Deed;
  sum: (value: number[]) => Deed;
  addMult: (a: number, b: number) => Deed;
}
assert(actions, _ as ExpectedActions);
