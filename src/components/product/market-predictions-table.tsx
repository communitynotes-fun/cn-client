"use client";

import * as React from "react";
import {
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconHelpHexagon,
} from "@tabler/icons-react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export const schema = z.object({
	id: z.number(),
	predictedNote: z.string(),
	score: z.number(),
	volume: z.number(),
	pnl: z.number(),
	myBet: z.number().optional(),
	myPayout: z.number().optional(),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
	{
		accessorKey: "predictedNote",
		header: "Predicted Community Note",
		cell: ({ row }) => {
			return (
				<div className="font-medium break-words whitespace-normal pr-4">
					{row.getValue("predictedNote")}
				</div>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: "score",
		header: () => (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger className="flex items-center gap-1">
						Score
						<IconHelpHexagon className="h-4 w-4 text-muted-foreground" />
					</TooltipTrigger>
					<TooltipContent>
						<p>Prediction score based on community consensus</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		),
		cell: ({ row }) => (
			<div className="text-left font-medium">{row.getValue("score")}</div>
		),
	},
	{
		accessorKey: "volume",
		header: "Volume",
		cell: ({ row }) => {
			const myBet = row.original.myBet ?? 0;
			return (
				<div className="flex flex-col gap-1 text-left font-medium">
					{row.getValue("volume")}
					{myBet > 0 && (
						<Badge variant="outline" className="text-muted-foreground px-1.5">
							Bet: {myBet}
						</Badge>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "pnl",
		header: "PnL",
		cell: ({ row }) => {
			const value = row.getValue("pnl") as number;
			const isNegative = value < 0;
			const myPayout = row.original.myPayout ?? 0;
			return (
				<div className="flex flex-col gap-1 text-left font-medium">
					<div
						className={cn(
							"text-left font-medium",
							isNegative ? "text-red-400" : "text-green-400"
						)}
					>
						{isNegative ? "-" : "+"}
						{Math.abs(value)} USDC
					</div>
					{myPayout > 0 && (
						<Badge variant="outline" className="text-muted-foreground px-1.5">
							Payout: {myPayout}
						</Badge>
					)}
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: () => <Button size="sm">Bet</Button>,
	},
];

export function MarketPredictionsTable({
	data: initialData,
	className,
}: {
	data: z.infer<typeof schema>[];
	className?: string;
}) {
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const table = useReactTable({
		data: initialData,
		columns,
		state: {
			sorting,
			columnVisibility,
			columnFilters,
			pagination,
		},
		getRowId: (row) => row.id.toString(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	return (
		<Tabs
			defaultValue="outline"
			className={cn("w-full flex-col justify-start gap-6", className)}
		>
			<TabsContent
				value="outline"
				className="relative flex flex-col gap-4 overflow-auto"
			>
				<div className="overflow-hidden rounded-lg border">
					<Table className="w-full">
						<colgroup>
							<col className="w-[52%]" />
							<col className="w-[10%]" />
							<col className="w-[14%]" />
							<col className="w-[14%]" />
							<col className="w-[10%]" />
						</colgroup>
						<TableHeader className="bg-muted sticky top-0 z-10">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead
												key={header.id}
												colSpan={header.colSpan}
												className="px-6 py-4"
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
													  )}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id} className="px-6 py-4">
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-between px-4">
					<div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
						{table.getFilteredRowModel().rows.length} row(s) total.
					</div>
					<div className="flex w-full items-center gap-8 lg:w-fit">
						<div className="hidden items-center gap-2 lg:flex">
							<Label htmlFor="rows-per-page" className="text-sm font-medium">
								Rows per page
							</Label>
							<Select
								value={`${table.getState().pagination.pageSize}`}
								onValueChange={(value) => {
									table.setPageSize(Number(value));
								}}
							>
								<SelectTrigger size="sm" className="w-20" id="rows-per-page">
									<SelectValue
										placeholder={table.getState().pagination.pageSize}
									/>
								</SelectTrigger>
								<SelectContent side="top">
									{[10, 20, 30, 40, 50].map((pageSize) => (
										<SelectItem key={pageSize} value={`${pageSize}`}>
											{pageSize}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex w-fit items-center justify-center text-sm font-medium">
							Page {table.getState().pagination.pageIndex + 1} of{" "}
							{table.getPageCount()}
						</div>
						<div className="ml-auto flex items-center gap-2 lg:ml-0">
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Go to first page</span>
								<IconChevronsLeft />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Go to previous page</span>
								<IconChevronLeft />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Go to next page</span>
								<IconChevronRight />
							</Button>
							<Button
								variant="outline"
								className="hidden size-8 lg:flex"
								size="icon"
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Go to last page</span>
								<IconChevronsRight />
							</Button>
						</div>
					</div>
				</div>
			</TabsContent>
		</Tabs>
	);
}
