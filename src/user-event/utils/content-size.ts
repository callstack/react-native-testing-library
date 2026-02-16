import type { Size } from '../../types';

/**
 * Simple function for getting mock the size of given text.
 *
 * It works by calculating height based on number of lines and width based on
 * the longest line length. It does not take into account font size, font
 * family, as well as different letter sizes.
 *
 * @param text text to be measure
 * @returns width and height of the text
 */
export function getTextContentSize(text: string): Size {
  const lines = text.split('\n');
  const maxLineLength = Math.max(...lines.map((line) => line.length));

  return {
    width: maxLineLength * 5,
    height: lines.length * 16,
  };
}
