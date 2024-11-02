import Tabs from '@components/tailus-ui/tabs';
import { cn } from '@lib/utils';
import React, { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
const items = [
  {
    label: 'Account',
    path: '/profile',
  },
  {
    label: 'CV đã nộp',
    path: '/profile/cv',
  },
];

function LayoutTabs({ className, ...props }: React.ComponentPropsWithoutRef<typeof Tabs.Root>) {
  const path = useLocation().pathname;
  const spanRef = useRef<HTMLSpanElement>(null);
  const go = useNavigate();

  useLayoutEffect(() => {
    const activeTrigger = document.getElementById(path) as HTMLElement;
    if (spanRef.current) {
      spanRef.current.style.left = activeTrigger.offsetLeft + 'px';
      spanRef.current.style.width = activeTrigger.offsetWidth + 'px';
    }
  }, [path]);

  return (
    <Tabs.Root {...props} className={cn('space-y-4', className)} defaultValue={path} onValueChange={(value) => go(value)}>
      <Tabs.List data-shade="925" variant="mixed" triggerVariant="plain" size="md">
        <Tabs.Indicator ref={spanRef} variant="elevated" className="bg-white" />
        {items.map((item, index) => (
          <Tabs.Trigger key={index} id={item.path} value={item.path}>
            {item.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}

export default LayoutTabs;
