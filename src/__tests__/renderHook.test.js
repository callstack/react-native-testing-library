import { useState, useEffect } from 'react';
import { renderHook } from '../renderHook';

describe('renderHook', () => {
  test('should call the hook', () => {
    const spy = jest.fn();
    renderHook(spy);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('should trigger cleanup behavior on unmount', () => {
    const hookCleanup = jest.fn();
    const { unmount } = renderHook(() => {
      useEffect(() => {
        return hookCleanup;
      });
    });
    expect(hookCleanup).not.toHaveBeenCalled();
    unmount();
    expect(hookCleanup).toHaveBeenCalledTimes(1);
  });

  test('should rerun hook on rerender', () => {
    let renderCount = 0;
    const { rerender } = renderHook(() => {
      useEffect(() => {
        renderCount++;
      });
    });

    expect(renderCount).toBe(1);
    rerender();
    expect(renderCount).toBe(2);
  });

  test('should pass new parameters to hook on rerender', () => {
    let passedParameters;
    const { rerender } = renderHook(parameters => {
      useEffect(() => {
        passedParameters = parameters;
      });
    }, 'banana');

    expect(passedParameters).toBe('banana');
    rerender('split');
    expect(passedParameters).toBe('split');
  });

  test('getValue should return latest hook execution result', () => {
    const { getResult } = renderHook(() => {
      const [state, setState] = useState(0);

      return {
        state,
        setState,
      };
    });

    expect(getResult().state).toBe(0);
    getResult().setState(5);
    expect(getResult().state).toBe(5);
  });
});
