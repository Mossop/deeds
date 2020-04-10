/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionDeed, Deed, Reducer, makeReducer } from "./base";

export { Deed, ActionDeed, Reducer } from "./base";

type ActionReducer<S, A extends any[] = any[]> = (state: S, ...args: A) => S;

type ActionReducerArgs<R> = R extends (state: any, ...args: infer A) => any ? A : never;

export interface ActionReducerMap<S = any> {
  [key: string]: ActionReducer<S>;
}

type ActionCreator<M, K extends keyof M> =
  (...args: ActionReducerArgs<M[K]>) => ActionDeed<K, ActionReducerArgs<M[K]>>;

export type ActionMap<M extends {}> = {
  [K in keyof M]: ActionCreator<M, K>;
};

/**
 * Creates an object of action creators. You must specify the generic type as the type of your
 * reducers object, typically as `actionCreators<typeof reducers>()`. The type of each property of
 * the returned object will match a property of the reducers object and will be a function that
 * takes the arguments the reducer property uses excluding the initial store state argument and
 * returns an action that can be dispatched to the store.
 */
export function actionCreators<M extends ActionReducerMap>(): ActionMap<M> {
  let creators = new Proxy({}, {
    get: function <K extends keyof M>(_target: {}, prop: K): ActionCreator<M, K> {
      return (...args: ActionReducerArgs<M[K]>): ActionDeed<K, ActionReducerArgs<M[K]>> => {
        return {
          type: prop,
          payload: args,
        };
      };
    },
  });

  return creators as ActionMap<M>;
}

/**
 * Creates a reducer function that accepts the store's state and an action and passes it to the
 * appropriate reducer function property of the passed reducers object.
 */
export function baseReducer<S>(reducers: ActionReducerMap<S>): Reducer<S> {
  return (state: S, action: Deed): S => {
    if (action.type in reducers) {
      return reducers[action.type](state, ...action.payload);
    }
    return state;
  };
}

/**
 * Creates a reducer function that accepts the store's state and an action. If the state is
 * undefined then an exception is thrown, otherwise the actiion is passed to the appropriate reducer
 * function property of the passed reducers object.
 */
export function reducer<S>(reducers: ActionReducerMap<S>): Reducer<S | undefined, S> {
  return makeReducer<S>(reducers, baseReducer);
}
