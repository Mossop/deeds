import { baseReducer, actionCreators } from "../src/immer";

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
};

test("actions", (): void => {
  let { add, del } = actionCreators<typeof reducers>();

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

  let state: State = {
    value: 1,
  };
  let newState = reducer(state, {
    type: "add",
    payload: [5],
  });

  expect(state).toEqual({
    value: 1,
  });
  expect(newState).toEqual({
    value: 6,
  });
  expect(newState).not.toBe(state);

  newState = reducer(state, {
    type: "del",
    payload: [5],
  });

  expect(state).toEqual({
    value: 1,
  });
  expect(newState).toEqual({
    value: -4,
  });
  expect(newState).not.toBe(state);
});
