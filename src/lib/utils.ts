import { clsx, type ClassValue } from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Clone React element.
 * The function clones React element and adds Tailwind CSS classnames to the cloned element
 * @param element the React element to clone
 * @param classNames Tailwind CSS classnames
 * @returns { React.ReactElement } - Cloned React element
 * @example cloneElement(<div />, "text-center text-cyan-500") // => <div className="text-center text-cyan-500" />
 */
export function cloneElement(element: React.ReactElement, classNames: string): React.ReactElement {
  return React.cloneElement(element, {
    className: twMerge(element.props.className, classNames),
  });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
