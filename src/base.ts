/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Deed {
  type: string;
  payload: unknown[];
}

export interface ActionDeed<T = string, P = []> {
  type: T;
  payload: P;
}

export type Reducer<PS, R = PS> = (state: PS, action: Deed) => R;

export function makeReducer<S>(
  reducers: any,
  baseReducer: <S>(reducers: any) => Reducer<S, any>,
): Reducer<S | undefined, S> {
  let reducer = baseReducer<S>(reducers);
  return (state: S | undefined, action: Deed): S => {
    if (!state) {
      throw new Error("Unexpected uninitialized state.");
    }

    return reducer(state, action);
  };
}
