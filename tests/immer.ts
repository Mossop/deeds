import { rootReducer } from "../immer";

interface State {
  value: number;
}

let reducers = {
  add: (state: State, val: number): void => {
    state.value += val;
  },
  del: (state: State, val: number): void => {
    state.value -= val;
  }
};

test("reducer", () => {
  let reducer = rootReducer(reducers);

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
