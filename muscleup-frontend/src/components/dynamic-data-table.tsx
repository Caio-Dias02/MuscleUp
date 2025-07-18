import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
  IconPlus,
  IconChevronRight as IconExpand,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Tipos genéricos
export interface BaseDataItem {
  id: string
  [key: string]: any
}

export interface TableConfig<T extends BaseDataItem> {
  title: string
  columns: ColumnDef<T>[]
  data: T[]
  isLoading?: boolean
  error?: Error | null
  onAddNew?: () => void
  addButtonText?: string
  expandableContent?: (item: T) => React.ReactNode
  emptyMessage?: string
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  showActions?: boolean
}

// Componente para exibir conteúdo expandível
function ExpandableContent<T extends BaseDataItem>({ 
  item, 
  content 
}: { 
  item: T
  content: (item: T) => React.ReactNode 
}) {
  return (
    <div className="p-4 bg-muted/30">
      {content(item)}
    </div>
  )
}

// Coluna de expansão genérica
function createExpandColumn<T extends BaseDataItem>(
  expandableContent?: (item: T) => React.ReactNode
): ColumnDef<T> | null {
  if (!expandableContent) return null;

  return {
    id: "expand",
    header: "Detalhes",
    cell: ({ row }) => {
      const [isExpanded, setIsExpanded] = React.useState(false);
      
      return (
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1"
          >
            <IconExpand 
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
            />
            Ver detalhes
          </Button>
          {isExpanded && (
            <ExpandableContent item={row.original} content={expandableContent} />
          )}
        </div>
      );
    },
  };
}

// Coluna de ações genérica
function createActionsColumn<T extends BaseDataItem>(
  onEdit?: (item: T) => void,
  onDelete?: (item: T) => void
): ColumnDef<T> | null {
  if (!onEdit && !onDelete) return null;

  return {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconEdit className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <IconEdit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          )}
          {onEdit && onDelete && <DropdownMenuSeparator />}
          {onDelete && (
            <DropdownMenuItem 
              onClick={() => onDelete(row.original)}
              className="text-red-600"
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  };
}

// Coluna de seleção padrão
function createSelectColumn<T extends BaseDataItem>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

export function DynamicDataTable<T extends BaseDataItem>({
  title,
  columns,
  data,
  isLoading = false,
  error = null,
  onAddNew,
  addButtonText = "Adicionar",
  expandableContent,
  emptyMessage = "Nenhum resultado encontrado.",
  onEdit,
  onDelete,
  showActions = true
}: TableConfig<T>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Adicionar colunas padrão
  const allColumns = React.useMemo(() => {
    const selectColumn = createSelectColumn<T>();
    const expandColumn = createExpandColumn(expandableContent);
    const actionsColumn = showActions ? createActionsColumn(onEdit, onDelete) : null;
    
    const baseColumns = [selectColumn, ...columns];
    if (expandColumn) {
      baseColumns.push(expandColumn);
    }
    if (actionsColumn) {
      baseColumns.push(actionsColumn);
    }
    
    return baseColumns;
  }, [columns, expandableContent, onEdit, onDelete, showActions]);

  const table = useReactTable({
    data,
    columns: allColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between px-4 lg:px-6 mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between px-4 lg:px-6 mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500">Erro ao carregar dados</p>
            <p className="text-sm text-muted-foreground mt-1">
              {error.message || 'Erro desconhecido'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-4 lg:px-6 mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Personalizar Colunas</span>
                <span className="lg:hidden">Colunas</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {onAddNew && (
            <Button onClick={onAddNew} size="sm">
              <IconPlus className="w-4 h-4 mr-2" />
              {addButtonText}
            </Button>
          )}
        </div>
      </div>
      
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={allColumns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Linhas por página</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              className="h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 