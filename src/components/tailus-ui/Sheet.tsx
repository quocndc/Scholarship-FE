'use client';

import { cn } from '@lib/utils';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { IconX } from '@tabler/icons-react';
import { caption, dialog, DialogProps, title } from '@tailus/themer';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> & DialogProps
>(({ className, fancy, mixed, ...props }, ref) => {
  const { overlay } = dialog({ fancy, mixed, className });
  return <SheetPrimitive.Overlay className={overlay()} {...props} ref={ref} />;
});
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  'fixed z-10 gap-4 py-0 px-0 transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out translate-y-0 translate-x-0 h-auto',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom: 'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'left-2 top-2 bottom-2 w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left max-h-none !h-auto right-auto',
        right:
          'right-2 top-2 bottom-2 w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right max-h-none !h-auto left-auto',
      },
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
      },
    },
    defaultVariants: {
      side: 'right',
      size: 'md',
    },
  }
);

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>, VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps & DialogProps>(
  ({ side = 'right', className, children, size, mixed, fancy, ...props }, ref) => {
    const { content, close } = dialog({ className, mixed, fancy });
    return (
      <SheetPortal>
        <SheetOverlay mixed={mixed} fancy={fancy} />
        <SheetPrimitive.Content ref={ref} className={cn(content(), sheetVariants({ side, size }), className)} {...props}>
          <SheetPrimitive.Close className={close()}>
            <IconX className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
          {children}
        </SheetPrimitive.Content>
      </SheetPortal>
    );
  }
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const ref = React.useRef<HTMLDivElement>(null);
  return <div ref={ref} className={cn('flex flex-col space-y-2 text-center sm:text-left p-[--feedback-padding]', className)} {...props} />;
};
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-[--feedback-padding]', className)} {...props} />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Title>, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>>(
  ({ className, ...props }, ref) => {
    const titleStyles = title({
      size: 'lg',
      weight: 'semibold',
    });
    return <SheetPrimitive.Title ref={ref} className={cn(titleStyles, className)} {...props} />;
  }
);
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => {
  const capStyles = caption();
  return <SheetPrimitive.Description ref={ref} className={cn(capStyles, className)} {...props} />;
});
SheetDescription.displayName = SheetPrimitive.Description.displayName;

const SheetBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col px-[--feedback-padding]', className)} {...props} />
));
SheetBody.displayName = 'SheetBody';

export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
