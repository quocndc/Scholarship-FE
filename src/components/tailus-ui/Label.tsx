import * as LabelPrimitive from '@radix-ui/react-label';
import { form, type LabelProps } from '@tailus/themer';
import React from 'react';

export interface FormLabelProps extends Omit<LabelProps, 'asTextarea' | 'floating' | 'variant'> {
  className?: string;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & FormLabelProps
>(({ className, size = 'sm', ...props }, forwardedRef) => {
  const { label } = form();

  return <LabelPrimitive.Root ref={forwardedRef} className={label({ size, className })} {...props} />;
});

export default Label;
