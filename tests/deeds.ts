import { baseReducer, actionCreators } from "../src/deeds";

let reducers = {
  add: (state: number, val: number): number => {
    return state + val;
  },
  del: (state: number, val: number): number => {
    return state - val;
  },
};

test("actions", (): void => {
  let { add, del } = actionCreators(reducers);

  expect(add(1)).toEqual({
    type: "add",
    payload: [1],
  });

  expect(add(5)).toEqual({
    type: "add",
    payload: [5],
  });

  expect(del(1)).toEqual({
    type: "del",
    payload: [1],
  });

  expect(del(5)).toEqual({
    type: "del",
    payload: [5],
  });
});

test("reducer", (): void => {
  let reducer = baseReducer(reducers);

  expect(reducer(1, {
    type: "add",
    payload: [5],
  })).toBe(6);

  expect(reducer(6, {
    type: "add",
    payload: [2],
  })).toBe(8);

  expect(reducer(1, {
    type: "del",
    payload: [5],
  })).toBe(-4);

  expect(reducer(7, {
    type: "del",
    payload: [3],
  })).toBe(4);
});
