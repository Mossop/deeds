export interface Deed {
  type: string;
  payload: unknown[];
}

interface ReducerMap<S = unknown> {
  [key: string]: (state: S, ...args: unknown[]) => S;
}

type ReducerArgs<R, S = unknown> = R extends (state: S, ...args: infer A) => S ? A : never;

export type Reducer<S> = (state: S, action: Deed) => S;

export type ActionMap<M extends ReducerMap> = {
  [K in keyof M]: (...args: ReducerArgs<M[K]>) => Deed;
};

export function actions<M extends ReducerMap>(reducers: M): ActionMap<M> {
  let actions = {};
  for (let key of Object.keys(reducers)) {
    actions[key] = (...args: unknown[]): Deed => {
      return {
        type: key,
        payload: args,
      };
    };
  }

  return actions as ActionMap<M>;
}

export function reducer<S>(reducers: ReducerMap<S>): Reducer<S> {
  return (state: S, action: Deed): S => {
    if (action.type in reducers) {
      return reducers[action.type](state, ...action.payload);
    }
    return state;
  };
}
