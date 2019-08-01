import { React, useReducer } from './../../src';

type ReducerState = {
  count: number;
};

const ACTIONS = {
  INCREASE: 'increase',
  DECREASE: 'decrease',
  LOADING: 'loading',
  RESET: 'reset',
};

const initialState = {
  count: 0,
};

const countReducer = (state: ReducerState, action: { type: string; [key: string]: string }) => {
  switch (action.type) {
    case ACTIONS.INCREASE:
      return { ...state, count: state.count + 1 };
    case ACTIONS.DECREASE:
      return { ...state, count: state.count - 1 };
    case ACTIONS.RESET:
      return { ...state, count: initialState.count };
    // TODO: no running code, so delete it?
    default:
      return state;
  }
}

export const UseCallbackVNode = React.createElement(
  function () {
    const [ state, dispatch ] = useReducer(countReducer, initialState);
    const handleIncrease = async () => {
      dispatch({ type: ACTIONS.INCREASE });
    };
    const handleDecrease = async () => {
      dispatch({ type: ACTIONS.DECREASE });
    };
    const handleReset = async () => {
      dispatch({ type: ACTIONS.RESET });
    };

    return React.createElement(
      'div',
      {},
      React.createElement('span', { id: 'result' }, state.count),
      React.createElement('button', { id: 'increase', onClick: handleIncrease }, 'increase'),
      React.createElement('button', { id: 'decrease', onClick: handleDecrease }, 'decrease'),
      React.createElement('button', { id: 'reset', onClick: handleReset }, 'reset'),
    );
  }
);
