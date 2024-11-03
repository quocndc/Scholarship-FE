import { aligner, type AlignerProps as AlignerVariants } from '@tailus/themer';
import React from 'react';

export interface AlignerProps extends React.HTMLAttributes<HTMLDivElement>, AlignerVariants {}

export const Aligner = React.forwardRef<HTMLDivElement, AlignerProps>(({ className, children, fromRight, ...props }, forwardedRef) => {
  return <div className={aligner({ fromRight, className })} ref={forwardedRef} children={children} {...props} />;
});

export default Aligner;
