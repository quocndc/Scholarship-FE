import LoadMoreTrigger from '@components/data-table/LoadMoreTrigger';
import { Skeleton } from '@components/Skeleton';
import Checkbox from '@components/tailus-ui/Checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/tailus-ui/Table';
import { IconCheck, IconMinus } from '@tabler/icons-react';
import { ColumnDef, flexRender, getCoreRowModel, OnChangeFn, RowSelectionState, TableOptions, useReactTable } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';

type DataTableProps<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  renderEmpty?: () => React.ReactNode;
  onLoadMore?: () => void;
  hasMore?: boolean;
  selectionMode?: 'single' | 'multiple';
  onSelectionChange?: (selection: string[]) => void;
} & Pick<TableOptions<TData>, 'getRowId'>;
function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const { data, columns, isLoading, isLoadingMore, hasMore, selectionMode, renderEmpty, onLoadMore, onSelectionChange, ...rest } = props;
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const onRowSelectionChange = useCallback<OnChangeFn<RowSelectionState>>(
    (selection) => {
      setRowSelection(selection);
      const updated = (selection as any)();
      const ids = Object.keys(updated);
      onSelectionChange?.(ids);
    },
    [onSelectionChange]
  );

  const customColumns = useMemo(() => {
    const preArr: ColumnDef<TData, TValue>[] = [];
    const postArr: ColumnDef<TData, TValue>[] = [];
    if (selectionMode) {
      postArr.push({
        id: 'selection',
        header: ({ table }) => (
          <Checkbox.Root
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            intent="secondary"
          >
            <Checkbox.Indicator>
              {table.getIsAllPageRowsSelected() ? <IconCheck className="size-3.5" /> : <IconMinus className="size-3.5" />}
            </Checkbox.Indicator>
          </Checkbox.Root>
        ),
        cell: ({ row }) => (
          <Checkbox.Root
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            intent="secondary"
          >
            <Checkbox.Indicator>
              <IconCheck className="size-3.5" />
            </Checkbox.Indicator>
          </Checkbox.Root>
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    return [...postArr, ...columns, ...preArr];
  }, [columns, selectionMode]);

  const table = useReactTable({
    data,
    columns: customColumns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: !!selectionMode,
    onRowSelectionChange,
    enableMultiRowSelection: selectionMode === 'multiple',
    state: {
      //   sorting,
      //   columnFilters,
      //   columnVisibility,
      rowSelection,
    },
    ...rest,
  });

  const renderLoading = () => {
    return (
      <>
        {Array.from({ length: 10 }).map((_, i) => (
          <TableRow key={i}>
            {columns.map((column) => (
              <TableCell key={column.id}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    );
  };

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading && renderLoading()}
        {table.getRowModel().rows?.length > 0 &&
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        {table.getRowModel().rows?.length === 0 && (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              {renderEmpty ? renderEmpty() : 'Không có dữ liệu'}
            </TableCell>
          </TableRow>
        )}
        {isLoadingMore && renderLoading()}
        <LoadMoreTrigger hasMore={hasMore} isLoading={isLoadingMore ?? true} onLoadMore={() => onLoadMore?.()} />
      </TableBody>
    </Table>
  );
}

export default DataTable;
