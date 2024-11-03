import Tabs from '@components/tailus-ui/tabs';
import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react';
import { type TabsIndicatorProps as IndicatorProps, type TabsListProps as ListProps } from '@tailus/themer';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useEffect, useRef } from 'react';

type TabsAppProps = 'light' | 'system' | 'dark';

interface TabsUIProps extends ListProps {
  indicatorVariant?: IndicatorProps['variant'];
}

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useLocalStorage<TabsAppProps>('theme', 'light');

  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const activeTrigger = document.getElementById(theme) as HTMLElement;
    if (spanRef.current) {
      spanRef.current.style.left = activeTrigger.offsetLeft + 'px';
      spanRef.current.style.width = activeTrigger.offsetWidth + 'px';
    }
  }, [theme]);

  useEffect(() => {
    document.body.classList.remove('light', 'dark', 'system');
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <Tabs.Root className="space-y-4" defaultValue={theme} onValueChange={(value) => setTheme(value as TabsAppProps)}>
      <Tabs.List variant="soft" triggerVariant="plain" size="md">
        <Tabs.Indicator ref={spanRef} variant="elevated" className="bg-white" />
        <Tabs.Trigger value="light" id="light">
          <IconSun />
        </Tabs.Trigger>
        <Tabs.Trigger value="system" id="system">
          <IconDeviceDesktop />
        </Tabs.Trigger>
        <Tabs.Trigger value="dark" id="dark">
          <IconMoon />
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
};
