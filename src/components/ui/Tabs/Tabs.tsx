/**
 * Tabs Component
 * 
 * Accessible tabbed content with keyboard navigation.
 */

import {
  type ReactNode,
  useState,
  useCallback,
  useRef,
  useId,
  createContext,
  useContext,
} from 'react';
import clsx from 'clsx';
import './Tabs.css';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

export interface TabsProps {
  /** Default active tab value */
  defaultValue?: string;
  /** Controlled active tab */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Tab content */
  children: ReactNode;
  /** Additional class */
  className?: string;
}

/**
 * Tabs container.
 * 
 * @example
 * ```tsx
 * <Tabs defaultValue="overview">
 *   <TabsList>
 *     <TabsTrigger value="overview">Overview</TabsTrigger>
 *     <TabsTrigger value="answers">Answers</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="overview">Overview content</TabsContent>
 *   <TabsContent value="answers">Answers content</TabsContent>
 * </Tabs>
 * ```
 */
export function Tabs({
  defaultValue,
  value,
  onChange,
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const baseId = useId();

  const activeTab = value ?? internalValue;

  const setActiveTab = useCallback((newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }, [value, onChange]);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
      <div className={clsx('tabs', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: ReactNode;
  className?: string;
}

/**
 * Tab triggers container
 */
export function TabsList({ children, className }: TabsListProps) {
  const tabsRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!tabsRef.current) return;

    const tabs = Array.from(
      tabsRef.current.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
    );
    const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);

    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    tabs[nextIndex]?.focus();
  }, []);

  return (
    <div
      ref={tabsRef}
      role="tablist"
      className={clsx('tabs__list', className)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  /** Tab value (must match TabsContent value) */
  value: string;
  /** Tab label */
  children: ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Additional class */
  className?: string;
}

/**
 * Individual tab trigger
 */
export function TabsTrigger({
  value,
  children,
  disabled = false,
  className,
}: TabsTriggerProps) {
  const { activeTab, setActiveTab, baseId } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      id={`${baseId}-trigger-${value}`}
      aria-controls={`${baseId}-content-${value}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      className={clsx(
        'tabs__trigger',
        isActive && 'tabs__trigger--active',
        className
      )}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  /** Content value (must match TabsTrigger value) */
  value: string;
  /** Content */
  children: ReactNode;
  /** Additional class */
  className?: string;
}

/**
 * Tab panel content
 */
export function TabsContent({
  value,
  children,
  className,
}: TabsContentProps) {
  const { activeTab, baseId } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-content-${value}`}
      aria-labelledby={`${baseId}-trigger-${value}`}
      tabIndex={0}
      className={clsx('tabs__content', className)}
    >
      {children}
    </div>
  );
}
