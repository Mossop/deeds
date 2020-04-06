import { createStore, Store } from "redux";
import { assert, _ } from "spec.ts";

import { baseReducer, actionCreators, reducer, Deed, ActionDeed } from "../src/deeds";

let reducers = {
  add: (state: number, val: number): number => {
    return state + val;
  },
  del: (state: number, val: number): number => {
    return state - val;
  },
  sum: (state: number, values: number[]): number => {
    values.forEach((v: number): number => state += v);
    return state;
  },
  addMult: (state: number, a: number, b: number): number => {
    return state + a * b;
  },
};

let base = baseReducer(reducers);
let main = reducer(reducers);
let actions = actionCreators(reducers);

// Reducer should have correct type.
assert(base, _ as (state: number, action: Deed) => number);
assert(main, _ as (state: number | undefined, action: Deed) => number);

// Action creators should have the correct types.
interface ExpectedActions {
  add: (value: number) => ActionDeed<"add", [number]>;
  del: (value: number) => ActionDeed<"del", [number]>;
  sum: (value: number[]) => ActionDeed<"sum", [number[]]>;
  addMult: (a: number, b: number) => ActionDeed<"addMult", [number, number]>;
}
assert(actions, _ as ExpectedActions);

let store = createStore(main);
assert(store, _ as Store<number, Deed>);
assert(store.dispatch, _ as <A extends Deed>(action: A) => A);

let typed = actions.add(5);
assert(typed.type, "add");
assert(typed.payload, _ as [number]);
store.dispatch(typed);

let untyped: Deed = actions.del(5);
assert(untyped, _ as Deed);
assert(untyped.type, _ as string);
assert(untyped.payload, _ as unknown[]);
store.dispatch(untyped);
