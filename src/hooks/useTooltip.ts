import { useState, useCallback } from 'react';

/**
 * Configuration options for tooltip behavior
 */
export interface TooltipConfig {
  /** Delay before showing tooltip (ms) */
  showDelay?: number;
  /** Delay before hiding tooltip (ms) */
  hideDelay?: number;
  /** Whether tooltip should be disabled */
  disabled?: boolean;
  /** Custom positioning strategy */
  position?: 'fixed' | 'absolute';
}

/**
 * Custom hook for managing tooltip state and behavior.
 * Provides consistent tooltip functionality across components.
 * 
 * @param config - Tooltip configuration options
 * @returns Object containing tooltip state and control functions
 */
export const useTooltip = (config: TooltipConfig = {}) => {
  const {
    showDelay = 0,
    hideDelay = 0,
    disabled = false,
    position = 'fixed'
  } = config;

  const [isVisible, setIsVisible] = useState(false);
  const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  /**
   * Shows the tooltip with optional delay
   */
  const show = useCallback(() => {
    if (disabled) return;

    // Clear any existing hide timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }

    if (showDelay > 0) {
      const timeout = setTimeout(() => setIsVisible(true), showDelay);
      setShowTimeout(timeout);
    } else {
      setIsVisible(true);
    }
  }, [disabled, showDelay, hideTimeout]);

  /**
   * Hides the tooltip with optional delay
   */
  const hide = useCallback(() => {
    // Clear any existing show timeout
    if (showTimeout) {
      clearTimeout(showTimeout);
      setShowTimeout(null);
    }

    if (hideDelay > 0) {
      const timeout = setTimeout(() => setIsVisible(false), hideDelay);
      setHideTimeout(timeout);
    } else {
      setIsVisible(false);
    }
  }, [hideDelay, showTimeout]);

  /**
   * Immediately shows the tooltip (bypasses delay)
   */
  const showImmediate = useCallback(() => {
    if (disabled) return;
    
    if (showTimeout) {
      clearTimeout(showTimeout);
      setShowTimeout(null);
    }
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    
    setIsVisible(true);
  }, [disabled, showTimeout, hideTimeout]);

  /**
   * Immediately hides the tooltip (bypasses delay)
   */
  const hideImmediate = useCallback(() => {
    if (showTimeout) {
      clearTimeout(showTimeout);
      setShowTimeout(null);
    }
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    
    setIsVisible(false);
  }, [showTimeout, hideTimeout]);

  return {
    isVisible,
    show,
    hide,
    showImmediate,
    hideImmediate,
    position,
  };
};
