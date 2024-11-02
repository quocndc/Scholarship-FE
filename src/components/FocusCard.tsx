import { cn } from '@lib/utils';
import React from 'react';

export const FocusCard = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    children,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    children?: React.ReactNode;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'rounded-card relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out group',
        hovered !== null && hovered !== index && 'blur-sm brightness-75'
      )}
    >
      <div className="absolute inset-0">
        <img src={card.src} alt={card.title} className="object-cover h-full w-full" />
      </div>
      <div
        className={cn(
          'absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300',
          hovered === index ? 'opacity-100' : 'opacity-0'
        )}
      >
        {children ?? (
          <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
            {card.title}
          </div>
        )}
      </div>
    </div>
  )
);

FocusCard.displayName = 'Card';

type Card = {
  title: string;
  src: string;
};

export function FocusCards({ cards }: { cards: Card[] }) {
  return <></>;
}
