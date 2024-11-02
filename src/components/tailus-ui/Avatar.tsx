import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { avatar, fallback, image, type AvatarFallbackProps, type AvatarRootProps } from '@tailus/themer';
import React from 'react';

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & AvatarRootProps
>(({ className, size = 'md', status = 'online', bottomStatus = false, topStatus = false, ...props }, ref) => {
  return <AvatarPrimitive.Root {...props} ref={ref} className={avatar({ size, status: status && status, topStatus, bottomStatus, className })} />;
});

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & AvatarFallbackProps
>(({ className, variant = 'solid', intent = 'primary', ...props }, ref) => {
  return <AvatarPrimitive.Fallback {...props} ref={ref} className={fallback[variant]({ intent, className })} />;
});

const AvatarImage = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Image>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>>(
  ({ className, ...props }, ref) => {
    return <AvatarPrimitive.Image {...props} ref={ref} className={image({ className })} />;
  }
);

export default {
  Root: AvatarRoot,
  Fallback: AvatarFallback,
  Image: AvatarImage,
};

export { AvatarFallback, AvatarImage, AvatarRoot };
