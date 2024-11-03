import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@components/tailus-ui/Breadcrumb';
import React from 'react';

type BreadcrumbItem = {
  title: string;
  href: string;
  disabled?: boolean;
};
type BreadcrumbContext = {
  items: BreadcrumbItem[];
  setItems: (items: BreadcrumbItem[]) => void;
  addItems: (items: BreadcrumbItem[]) => void;
};

const BreadcrumbContext = React.createContext<BreadcrumbContext | null>(null);

function useBreadcrumb() {
  const context = React.useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumb must be used within a Breadcrumb.');
  }

  return context;
}

const BreadcrumbProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & {
    defaultItems?: BreadcrumbItem[];
  }
>(({ defaultItems = [], children, ...props }, ref) => {
  const [items, setItems] = React.useState(defaultItems);
  const addItems = (items: BreadcrumbItem[]) => {
    setItems((prev) => [...prev, ...items]);
  };
  const value = React.useMemo<BreadcrumbContext>(
    () => ({
      items,
      setItems,
      addItems,
    }),
    [items, setItems]
  );

  return (
    <BreadcrumbContext.Provider value={value}>
      <nav ref={ref} aria-label="breadcrumb" {...props}>
        {children}
      </nav>
    </BreadcrumbContext.Provider>
  );
});
BreadcrumbProvider.displayName = 'BreadcrumbProvider';

export function AdminBreadcrumb({ ...props }: React.ComponentPropsWithoutRef<'nav'>) {
  const { items } = useBreadcrumb();
  const renderItem = (item: BreadcrumbItem, i: number) => {
    if (i === items.length - 1) {
      return <BreadcrumbPage key={item.href}>{item.title}</BreadcrumbPage>;
    }

    if (item.href) {
      return (
        <React.Fragment key={item.href}>
          <BreadcrumbLink to={item.href}>{item.title}</BreadcrumbLink>
          <BreadcrumbSeparator />
        </React.Fragment>
      );
    }
  };
  return (
    <Breadcrumb {...props}>
      <BreadcrumbList>{items.map((item, i) => renderItem(item, i))}</BreadcrumbList>
    </Breadcrumb>
  );
}

export { BreadcrumbProvider, useBreadcrumb };
