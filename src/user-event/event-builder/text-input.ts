import { ContentSize } from '../utils/content-size';
import { TextRange } from '../utils/text-range';

export const TextInputEventBuilder = {
  /**
   * Experimental values:
   * - iOS: `{"eventCount": 4, "target": 75, "text": "Test"}`
   * - Android: `{"eventCount": 6, "target": 53, "text": "Tes"}`
   */
  change: (text: string) => {
    return {
      nativeEvent: { text, target: 0, eventCount: 0 },
    };
  },

  /**
   * Experimental values:
   * - iOS: `{"eventCount": 3, "key": "a", "target": 75}`
   * - Android: `{"key": "a"}`
   */
  keyPress: (key: string) => {
    return {
      nativeEvent: { key },
    };
  },

  /**
   * Experimental values:
   * - iOS: `{"eventCount": 4, "target": 75, "text": "Test"}`
   * - Android: `{"target": 53, "text": "Test"}`
   */
  submitEditing: (text: string) => {
    return {
      nativeEvent: { text, target: 0 },
    };
  },

  /**
   * Experimental values:
   * - iOS: `{"eventCount": 4, "target": 75, "text": "Test"}`
   * - Android: `{"target": 53, "text": "Test"}`
   */
  endEditing: (text: string) => {
    return {
      nativeEvent: { text, target: 0 },
    };
  },

  /**
   * Experimental values:
   * - iOS: `{"selection": {"end": 4, "start": 4}, "target": 75}`
   * - Android: `{"selection": {"end": 4, "start": 4}}`
   */
  selectionChange: ({ start, end }: TextRange) => {
    return {
      nativeEvent: { selection: { start, end } },
    };
  },

  /**
   * Experimental values:
   * - iOS: `{"eventCount": 2, "previousText": "Te", "range": {"end": 2, "start": 2}, "target": 75, "text": "s"}`
   * - Android: `{"previousText": "Te", "range": {"end": 2, "start": 0}, "target": 53, "text": "Tes"}`
   */
  textInput: (text: string, previousText: string) => {
    return {
      nativeEvent: {
        text,
        previousText,
        range: { start: text.length, end: text.length },
        target: 0,
      },
    };
  },

  /**
   * Experimental values:
   * - iOS: `{"contentSize": {"height": 21.666666666666668, "width": 11.666666666666666}, "target": 75}`
   * - Android: `{"contentSize": {"height": 61.45454406738281, "width": 352.7272644042969}, "target": 53}`
   */
  contentSizeChange: ({ width, height }: ContentSize) => {
    return {
      nativeEvent: { contentSize: { width, height }, target: 0 },
    };
  },
};
