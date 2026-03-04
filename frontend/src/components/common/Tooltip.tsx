import React, { useState, useRef, useEffect } from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  children: React.ReactElement;
  delay?: number;
  maxWidth?: string;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  delay = 400,
  maxWidth = 'max-w-xs',
  className = '',
}) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  const show = () => {
    timerRef.current = window.setTimeout(() => setVisible(true), delay);
  };
  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const positionClasses: Record<TooltipPosition, string> = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
  };
  const arrowClasses: Record<TooltipPosition, string> = {
    top:    'top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-l-transparent border-r-transparent border-t-transparent',
    left:   'left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-t-transparent border-b-transparent border-r-transparent',
    right:  'right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-t-transparent border-b-transparent border-l-transparent',
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={`absolute z-50 pointer-events-none ${positionClasses[position]} ${className}`}
        >
          <div className={`${maxWidth} bg-slate-800 dark:bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded-xl shadow-lg leading-relaxed animate-pop`}>
            {content}
          </div>
          <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
        </div>
      )}
    </span>
  );
};

// ─── Help Icon with Tooltip ───────────────────────────────────────────────────
import { HelpCircle } from 'lucide-react';

export const HelpTooltip: React.FC<{ content: string; position?: TooltipPosition }> = ({ content, position = 'top' }) => (
  <Tooltip content={content} position={position}>
    <span className="cursor-help">
      <HelpCircle className="w-4 h-4 text-neutral-400 dark:text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors" />
    </span>
  </Tooltip>
);

export default Tooltip;
