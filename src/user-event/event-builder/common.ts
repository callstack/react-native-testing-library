export const CommonEventBuilder = {
  /**
   * Experimental values:
   * - iOS: `{"changedTouches": [[Circular]], "identifier": 1, "locationX": 253, "locationY": 30.333328247070312, "pageX": 273, "pageY": 141.3333282470703, "target": 75, "timestamp": 875928682.0450834, "touches": [[Circular]]}`
   * - Android: `{"changedTouches": [[Circular]], "identifier": 0, "locationX": 160, "locationY": 40.3636360168457, "pageX": 180, "pageY": 140.36363220214844, "target": 53, "targetSurface": -1, "timestamp": 10290805, "touches": [[Circular]]}`
   */
  touch: () => {
    return {
      persist: jest.fn(),
      currentTarget: { measure: jest.fn() },
      nativeEvent: {
        changedTouches: [],
        identifier: 0,
        locationX: 0,
        locationY: 0,
        pageX: 0,
        pageY: 0,
        target: 0,
        timestamp: Date.now(),
        touches: [],
      },
    };
  },

  /**
   * Experimental values:
   * - iOS: `{"eventCount": 0, "target": 75, "text": ""}`
   * - Android: `{"target": 53}`
   */
  focus: () => {
    return {
      nativeEvent: {
        target: 0,
      },
    };
  },

  /**
   * Experimental values:
   * - iOS: `{"eventCount": 0, "target": 75, "text": ""}`
   * - Android: `{"target": 53}`
   */
  blur: () => {
    return {
      nativeEvent: {
        target: 0,
      },
    };
  },
};
