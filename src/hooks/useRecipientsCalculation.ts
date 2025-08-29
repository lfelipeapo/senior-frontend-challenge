import { useState, useEffect, useRef, useMemo } from 'react';
import { useTextMeasurement } from './useTextMeasurement';

/**
 * Configuration for recipients calculation
 */
export interface RecipientsCalculationConfig {
  /** Maximum width for the container (if not using ref) */
  maxWidth?: number;
  /** Custom ellipsis suffix */
  ellipsisSuffix?: string;
  /** Whether to allow at least one recipient even if it overflows */
  allowOverflow?: boolean;
  /** Minimum width to consider for calculations */
  minWidth?: number;
}

/**
 * Result of recipients calculation
 */
export interface RecipientsCalculationResult {
  /** List of visible recipients */
  visibleList: string[];
  /** Number of hidden recipients */
  hiddenCount: number;
  /** Display text with ellipsis */
  displayText: string;
  /** Whether calculation is ready */
  isReady: boolean;
}

/**
 * Custom hook for calculating which recipients can be displayed within available space.
 * Handles text measurement, overflow detection, and responsive behavior.
 * 
 * @param recipients - Comma-separated string of recipient emails
 * @param containerRef - Ref to the container element
 * @param config - Calculation configuration options
 * @returns Object containing calculation results and utilities
 */
export const useRecipientsCalculation = (
  recipients: string,
  containerRef: React.RefObject<HTMLElement>,
  config: RecipientsCalculationConfig = {}
): RecipientsCalculationResult => {
  const {
    maxWidth,
    ellipsisSuffix = ',...',
    allowOverflow = true,
    minWidth = 50
  } = config;

  const { measureTextWidth, getComputedFont } = useTextMeasurement();
  const [visibleList, setVisibleList] = useState<string[]>([]);
  const [hiddenCount, setHiddenCount] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Parse and validate recipients
  const emails = useMemo(() => {
    if (!recipients || typeof recipients !== 'string') {
      return [];
    }

    return recipients
      .split(',')
      .map((email) => email.trim())
      .filter((email) => {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email.length > 0 && email.length <= 254 && emailRegex.test(email);
      });
  }, [recipients]);

  /**
   * Computes which recipients can be displayed within the available container width.
   * The algorithm iteratively adds email addresses until adding another would exceed
   * the container width when the ellipsis suffix is taken into account.
   * 
   * Complexity: O(n) where n is the number of recipients
   */
  const computeVisibleRecipients = () => {
    if (!containerRef.current || emails.length === 0) {
      setVisibleList([]);
      setHiddenCount(emails.length);
      setIsReady(true);
      return;
    }

    const container = containerRef.current;
    const availableWidth = maxWidth || container.clientWidth;

    // Validate minimum width
    if (availableWidth < minWidth) {
      setVisibleList([]);
      setHiddenCount(emails.length);
      setIsReady(true);
      return;
    }

    try {
      const font = getComputedFont(container);
      const visible: string[] = [];

      // Build the list progressively, measuring after each addition
      for (let i = 0; i < emails.length; i++) {
        const proposedVisible = [...visible, emails[i]];
        const remaining = emails.length - proposedVisible.length;
        const visibleText = proposedVisible.join(', ');
        const suffix = remaining > 0 ? ellipsisSuffix : '';
        const totalText = visibleText + suffix;
        
        const width = measureTextWidth(totalText, font);
        
        // Allow at least one recipient even if it overflows slightly
        if (width <= availableWidth || (visible.length === 0 && allowOverflow)) {
          visible.push(emails[i]);
        } else {
          break;
        }
      }

      setVisibleList(visible);
      setHiddenCount(emails.length - visible.length);
      setIsReady(true);
    } catch (error) {
      console.error('Error computing visible recipients:', error);
      // Fallback: show all recipients
      setVisibleList(emails);
      setHiddenCount(0);
      setIsReady(true);
    }
  };

  // Compose the visible text with ellipsis
  const displayText = useMemo(() => {
    if (!isReady) return '';
    
    const visibleText = visibleList.join(', ');
    return hiddenCount > 0 ? `${visibleText}${ellipsisSuffix}` : visibleText;
  }, [visibleList, hiddenCount, ellipsisSuffix, isReady]);

  // Recompute visible recipients whenever dependencies change
  useEffect(() => {
    computeVisibleRecipients();
  }, [recipients, maxWidth, ellipsisSuffix, allowOverflow, minWidth]);

  // Set up ResizeObserver for responsive behavior
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      computeVisibleRecipients();
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [containerRef.current]);

  return {
    visibleList,
    hiddenCount,
    displayText,
    isReady,
  };
};
