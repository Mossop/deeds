# Deeds

A tiny library to generate strongly typed action creators from a set of reducers
for [Redux](https://redux.js.org/).

The core of Redux is dispatching actions containing some data and then writing
reducers that act on the current state and that data. Keeping the data in the
action in sync with that required by the reducer can be tricky.
[TypeScript](https://www.typescriptlang.org/) helps but only if you strongly
type the reducers and strongly type the actions which can be a chore. I found
myself writing out a lot of boilerplate to keep things in sync and make
TypeScript happy.

This library simplifies a lot of this by automatically generating strongly typed
action creators from a set of reducers.

```javascript
import { createStore } from "redux";
import { rootReducer, actionCreators, Deed } from "deeds";

const reducers = {
  add: (state: number, val: number): number => {
    return state + val;
  },
  del: (state: number, val: number): number => {
    return state - val;
  }
}

const store = createStore(rootReducer(reducers), 1);
const actions = actionCreators(reducers);

store.dispatch(actions.add(5));
// state is now 6.
store.dispatch(actions.del(3));
// state is now 3.

let action = actions.add(4);
// action is strongly typed at this point but mostly you will not need that and
// can just cast to Deed.
store.dispatch(action as Deed);
```

Optionally this supports using [immer](https://immerjs.github.io/immer) for an
immutable state:

```javascript
import { createStore } from "redux";
import { Draft } from "immer";
import { rootReducer, actionCreators, Deed } from "deeds/immer";

interface State {
  value: readonly number;
}

const reducers = {
  add: (state: Draft<State>, val: number): void => {
    state.value += val;
  },
  del: (state: Draft<State>, val: number): void => {
    state.value -= val;
  }
}

const store = createStore(rootReducer(reducers), { value: 1 });
const actions = actionCreators(reducers);

store.dispatch(actions.add(5));
// state is now 6.
store.dispatch(actions.del(3));
// state is now 3.
```

The exports of `deeds/immer` are just re-exports of `deeds` with the exception
of `rootReducer`.
