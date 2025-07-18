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
  IconChevronRight as IconExpand,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { useWorkoutExercises } from "@/hooks/useWorkoutExercises"

// Tipo para os dados dos workout days
export interface WorkoutDay {
  id: string
  name: string
  dayOfWeek: string
  workoutPlanId: string
  createdAt: string
  updatedAt: string
}

// Tipo para os dados dos workout exercises
export interface WorkoutExercise {
  id: string
  name: string
  sets: number
  reps: number
  weight: number
  workoutDayId: string
  createdAt: string
  updatedAt: string
}

// Componente para exibir exercícios de um workout day
function WorkoutDayExercises({ workoutDayId }: { workoutDayId: string }) {
  const { data: exercises, isLoading } = useWorkoutExercises(workoutDayId);

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mx-auto"></div>
        <p className="text-sm text-muted-foreground mt-1">Carregando exercícios...</p>
      </div>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">Nenhum exercício encontrado</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-muted/30">
      <h4 className="font-medium mb-3">Exercícios:</h4>
      <div className="space-y-2">
        {exercises.map((exercise: WorkoutExercise) => (
          <div key={exercise.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
            <div className="flex-1">
              <p className="font-medium">{exercise.name}</p>
              <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                <span>{exercise.sets} séries</span>
                <span>{exercise.reps} repetições</span>
                <span>{exercise.weight}kg</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const columns: ColumnDef<WorkoutDay>[] = [
  {
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
  },
  {
    accessorKey: "name",
    header: "Nome do Treino",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "dayOfWeek",
    header: "Dia da Semana",
    cell: ({ row }) => {
      const dayMap: { [key: string]: string } = {
        MONDAY: "Segunda-feira",
        TUESDAY: "Terça-feira",
        WEDNESDAY: "Quarta-feira",
        THURSDAY: "Quinta-feira",
        FRIDAY: "Sexta-feira",
        SATURDAY: "Sábado",
        SUNDAY: "Domingo",
      }
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {dayMap[row.original.dayOfWeek] || row.original.dayOfWeek}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString('pt-BR')}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Atualizado em",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {new Date(row.original.updatedAt).toLocaleDateString('pt-BR')}
      </div>
    ),
  },
  {
    id: "expand",
    header: "Exercícios",
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
            Ver exercícios
          </Button>
          {isExpanded && (
            <WorkoutDayExercises workoutDayId={row.original.id} />
          )}
        </div>
      );
    },
  },
]

export function WorkoutDaysTable({ data }: { data: WorkoutDay[] }) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
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

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-4 lg:px-6 mb-4">
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
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