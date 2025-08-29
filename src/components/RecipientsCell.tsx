// This file is a client component. Next.js requires this directive when
// using hooks and browser-only APIs inside a component imported from
// the server. Without it, hydration errors can occur when the app is
// rendered on the server and rehydrated on the client.
'use client';

import React, { useRef } from 'react';
import { useRecipientsCalculation } from '../hooks/useRecipientsCalculation';
import { useTooltip } from '../hooks/useTooltip';

/**
 * Configuration options for the RecipientsCell component
 */
export interface RecipientsCellConfig {
  /** Maximum width for the container (if not using ref) */
  maxWidth?: number;
  /** Custom ellipsis suffix */
  ellipsisSuffix?: string;
  /** Whether to allow at least one recipient even if it overflows */
  allowOverflow?: boolean;
  /** Minimum width to consider for calculations */
  minWidth?: number;
  /** Tooltip configuration */
  tooltip?: {
    /** Delay before showing tooltip (ms) */
    showDelay?: number;
    /** Delay before hiding tooltip (ms) */
    hideDelay?: number;
    /** Whether tooltip should be disabled */
    disabled?: boolean;
    /** Tooltip positioning strategy */
    position?: 'fixed' | 'absolute';
    /** Custom tooltip content formatter */
    formatter?: (hiddenCount: number) => string;
  };
  /** CSS classes for styling */
  className?: {
    /** Container class */
    container?: string;
    /** Text class */
    text?: string;
    /** Tooltip class */
    tooltip?: string;
  };
}

/**
 * Props for the RecipientsCell component
 */
export interface RecipientsCellProps {
  /**
   * Comma‑separated string of recipient email addresses.
   * Must be valid email addresses separated by commas.
   * 
   * @example "user1@example.com, user2@example.com, user3@example.com"
   */
  recipients: string;
  /**
   * Configuration options for the component behavior
   */
  config?: RecipientsCellConfig;
  /**
   * Callback fired when recipients are truncated
   */
  onTruncate?: (hiddenCount: number, totalCount: number) => void;
  /**
   * Callback fired when tooltip is shown
   */
  onTooltipShow?: (hiddenCount: number) => void;
  /**
   * Callback fired when tooltip is hidden
   */
  onTooltipHide?: () => void;
}

/**
 * Component responsible for rendering the list of email recipients inside
 * a table cell. The list is truncated to fit within the available
 * horizontal space and shows an ellipsis when not all recipients fit
 * visually. When the user hovers over the cell, a tooltip appears
 * containing the count of hidden recipients.
 * 
 * @example
 * ```tsx
 * <RecipientsCell 
 *   recipients="user1@example.com, user2@example.com, user3@example.com"
 *   config={{
 *     tooltip: { showDelay: 300 },
 *     ellipsisSuffix: '...'
 *   }}
 *   onTruncate={(hidden, total) => console.log(`${hidden}/${total} hidden`)}
 * />
 * ```
 */
const RecipientsCell: React.FC<RecipientsCellProps> = ({ 
  recipients, 
  config = {}, 
  onTruncate,
  onTooltipShow,
  onTooltipHide 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Extract configuration with defaults
  const {
    maxWidth,
    ellipsisSuffix = ',...',
    allowOverflow = true,
    minWidth = 50,
    tooltip: tooltipConfig = {},
    className: customClasses = {}
  } = config;

  // Use custom hooks
  const { visibleList, hiddenCount, displayText, isReady } = useRecipientsCalculation(
    recipients,
    containerRef,
    { maxWidth, ellipsisSuffix, allowOverflow, minWidth }
  );

  const { isVisible: showTooltip, show, hide } = useTooltip({
    showDelay: tooltipConfig.showDelay,
    hideDelay: tooltipConfig.hideDelay,
    disabled: tooltipConfig.disabled,
    position: tooltipConfig.position
  });

  // Calculate tooltip position based on container position
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + 8
      });
    }
    show();
  };

  // Default tooltip formatter
  const formatTooltipContent = (count: number): string => {
    if (tooltipConfig.formatter) {
      return tooltipConfig.formatter(count);
    }
    return `${count} e-mail${count > 1 ? 's' : ''} oculto${count > 1 ? 's' : ''}`;
  };

  // Handle callbacks
  React.useEffect(() => {
    if (isReady && hiddenCount > 0) {
      onTruncate?.(hiddenCount, visibleList.length + hiddenCount);
    }
  }, [hiddenCount, isReady, onTruncate, visibleList.length]);

  React.useEffect(() => {
    if (showTooltip && hiddenCount > 0) {
      onTooltipShow?.(hiddenCount);
    }
  }, [showTooltip, hiddenCount, onTooltipShow]);

  React.useEffect(() => {
    if (!showTooltip) {
      onTooltipHide?.();
    }
  }, [showTooltip, onTooltipHide]);

  // Default CSS classes
  const defaultClasses = {
    container: "relative truncate",
    text: "",
    tooltip: "fixed z-50 bg-gray-800 text-white text-xs p-2 rounded shadow-lg border border-gray-600"
  };

  const classes = {
    container: `${defaultClasses.container} ${customClasses.container || ''}`.trim(),
    text: `${defaultClasses.text} ${customClasses.text || ''}`.trim(),
    tooltip: `${defaultClasses.tooltip} ${customClasses.tooltip || ''}`.trim()
  };



  return (
    <>
      <div
        ref={containerRef}
        className={classes.container}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={hide}
      >
        <span className={classes.text}>{displayText}</span>
      </div>
      {showTooltip && hiddenCount > 0 && (
        <div
          className={classes.tooltip}
          style={{ 
            pointerEvents: 'none',
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            minWidth: 'max-content',
            zIndex: 50
          }}
        >
          {formatTooltipContent(hiddenCount)}
        </div>
      )}
    </>
  );
};

export default RecipientsCell;