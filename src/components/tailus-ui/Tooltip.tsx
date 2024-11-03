import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { tooltip, type TooltipProps } from '@tailus/themer';
import React from 'react';

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipPortal = TooltipPrimitive.Portal;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & TooltipProps
>(({ className, fancy = false, inverted = true, sideOffset = 4, ...props }, ref) => {
  const { content } = tooltip();

  if (fancy && inverted) {
    throw new Error('The fancy and inverted props cannot be used together.');
  }

  return <TooltipPrimitive.Content sideOffset={sideOffset} className={content({ fancy, inverted, className })} ref={ref} {...props} />;
});

const TooltipArrow = React.forwardRef<SVGSVGElement, React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow> & TooltipProps>(
  ({ fancy, inverted, className, ...props }) => {
    const { arrow } = tooltip();

    if (fancy && inverted) {
      throw new Error('The fancy and inverted props cannot be used together.');
    }

    return <TooltipPrimitive.Arrow className={arrow({ fancy, inverted, className })} {...props} />;
  }
);

export { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger };

export function withTooltip<T extends React.ComponentType<any> | keyof HTMLElementTagNameMap>(Component: T) {
  return React.forwardRef<
    React.ElementRef<T>,
    {
      tooltipContentProps?: Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>, 'children'>;
      tooltipProps?: Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>, 'children'>;
      tooltip?: React.ReactNode;
    } & React.ComponentPropsWithoutRef<T> &
      Omit<TooltipPrimitive.TooltipProviderProps, 'children'>
  >(function ExtendComponent(
    { delayDuration = 0, disableHoverableContent = true, skipDelayDuration = 0, tooltip, tooltipContentProps, tooltipProps, ...props },
    ref
  ) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const component = <Component ref={ref} {...(props as any)} />;

    if (tooltip && mounted) {
      return (
        <TooltipProvider delayDuration={delayDuration} disableHoverableContent={disableHoverableContent} skipDelayDuration={skipDelayDuration}>
          <TooltipRoot {...tooltipProps}>
            <TooltipTrigger asChild>{component}</TooltipTrigger>

            <TooltipPortal>
              <TooltipContent {...tooltipContentProps}>{tooltip}</TooltipContent>
            </TooltipPortal>
          </TooltipRoot>
        </TooltipProvider>
      );
    }

    return component;
  });
}

export const Tooltip = (props: React.ComponentProps<typeof TooltipRoot> & { children: React.ReactNode; tooltip: React.ReactNode }) => {
  return (
    <TooltipProvider>
      <TooltipRoot {...props}>
        <TooltipTrigger asChild>{props.children}</TooltipTrigger>

        <TooltipPortal>
          <TooltipContent className="z-[12]">{props.tooltip}</TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  );
};

export default {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
  Arrow: TooltipArrow,
};
