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

## Examples

```javascript
import { createStore } from "redux";
import { reducer, actionCreators, Deed } from "deeds";

const reducers = {
  add: (state: number, val: number): number => {
    return state + val;
  },
  del: (state: number, val: number): number => {
    return state - val;
  }
}

const store = createStore(reducer(reducers), 1);
const actions = actionCreators<typeof reducers>();

store.dispatch(actions.add(5));
// state is now 6.
store.dispatch(actions.del(3));
// state is now 3.

let action = actions.add(4);
// action is strongly typed at this point but mostly you will not need that and
// can just cast to Deed.
let untyped: Deed = action;
store.dispatch(untyped);
```

## immer

Optionally this supports using [immer](https://immerjs.github.io/immer) for an
immutable state:

```javascript
import { createStore } from "redux";
import { Draft } from "immer";
import { reducer, actionCreators, Deed } from "deeds/immer";

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

const store = createStore(reducer(reducers), { value: 1 });
const actions = actionCreators<typeof reducers>();

store.dispatch(actions.add(5));
// state is now 6.
store.dispatch(actions.del(3));
// state is now 3.
```

`deeds/immer` exports functions with the same names as those in `deeds`. While some of those are
just re-exports from `deeds` right now semantic versioning will increased on the basis that you are
only using the exports of one of `deeds` or `deeds/immer` for any given store.

## Uninitialized stores

The reducer you pass to Redux's `createStore` must accept an undefined store state and the reducer
returned from the `reducer` call matches that signature, however in order to avoid having to define
every reducer as accepting an undefined state it will simply throw an exception if an undefined
state is ever passed. This works fine if you always pass an initialized state to `createStore` but
will be a problem if you create an uninitialized store and then use an action to initialize it. In
this case you will need to create your own reducer to handle the unitialized case:

```javascript
import { createStore } from "redux";
import { baseReducer, Deed } from "deeds";

interface InitializeAction {
  type: "INITIALIZE";
  value: number;
}

const reducers = {
  add: (state: number, val: number): number => {
    return state + val;
  },
  del: (state: number, val: number): number => {
    return state - val;
  }
}

// `baseReducer` is identical to `reducer` but only accepts an initialized state.
const reducer = baseReducer(reducers);
const store = createStore((state: number | undefined, action: Deed | InitializeAction) => {
  if (!state) {
    if (action.type == "INITIALIZE") {
      return action.value;
    }

    // Early action?
    state = 0;
  }

  return reducer(state, action);
});
const actions = actionCreators<typeof reducers>();
```
