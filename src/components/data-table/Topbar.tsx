import Button, { ButtonProps } from '@components/tailus-ui/Button';
import { Caption } from '@components/tailus-ui/typography';
import { cn } from '@lib/utils';
import { IconFilter, IconPointFilled } from '@tabler/icons-react';
import { useCallback } from 'react';
export type TopbarAction = {
  label: string;
  icon?: React.ReactNode;
} & ButtonProps;
type TopBarProps<TData> = {
  selectedItems?: TData[];
  actions?: TopbarAction[][];
  isFilterActive?: boolean;
  onFilterClick?: () => void;
  totalItems?: number;
} & React.HTMLAttributes<HTMLDivElement>;
function TopBar<TData>(props: TopBarProps<TData>) {
  const { actions, className, onFilterClick, isFilterActive, totalItems, ...rest } = props;

  const renderItem = useCallback(({ ...item }: TopbarAction, i?: number) => {
    return (
      <Button.Root key={i + item.label} {...item}>
        {item.icon && <Button.Icon type="leading">{item.icon}</Button.Icon>}
        <Button.Label>{item.label}</Button.Label>
      </Button.Root>
    );
  }, []);

  return (
    <div className={cn('flex', className)} {...rest}>
      <div className="flex-1 flex divide-x-2">
        {actions?.map((action, i) => action.length > 0 && <div className="px-2 flex gap-2">{action.map((a) => renderItem(a, i))}</div>)}
      </div>
      <div className="mr-auto w-fit flex gap-2 pr-2">
        {totalItems && (
          <div className="flex items-center justify-center gap-2">
            <Caption>Tổng số: {totalItems}</Caption>
          </div>
        )}
        {onFilterClick && (
          <Button.Root size="sm" intent="gray" variant="outlined" className="relative" onClick={() => onFilterClick?.()}>
            {isFilterActive && <IconPointFilled className="absolute -top-3 -right-3 size-6 origin-center text-primary-500" />}
            <Button.Icon type="only">
              <IconFilter />
            </Button.Icon>
          </Button.Root>
        )}
        {/* <Button.Root size="sm" intent="gray" variant="outlined">
          <Button.Icon type="only">
            <IconTableAlias />
          </Button.Icon>
        </Button.Root> */}
      </div>
    </div>
  );
}

export default TopBar;
