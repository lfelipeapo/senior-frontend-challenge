/**
 * Custom hook for measuring text width using canvas 2D context.
 * Provides a consistent way to measure text dimensions across components.
 * 
 * @returns Object containing measurement functions and utilities
 */
export const useTextMeasurement = () => {
  /**
   * Measures the width of a given text string using a canvas 2D context.
   * The font applied to the container element is used so the measurement
   * matches the rendered width in the DOM.
   * 
   * @param text - The text string to measure
   * @param font - CSS font string (e.g., "normal 400 14px Arial")
   * @returns Width of the text in pixels, or 0 if measurement fails
   */
  const measureTextWidth = (text: string, font: string): number => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return 0;
      
      context.font = font;
      const metrics = context.measureText(text);
      return metrics.width;
    } catch (error) {
      console.warn('Failed to measure text width:', error);
      return 0;
    }
  };

  /**
   * Gets the computed font string from a DOM element.
   * 
   * @param element - The DOM element to get font from
   * @returns CSS font string
   */
  const getComputedFont = (element: HTMLElement): string => {
    const style = window.getComputedStyle(element);
    return `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  };

  return {
    measureTextWidth,
    getComputedFont,
  };
};
