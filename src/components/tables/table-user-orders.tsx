"use client"

import * as React from "react"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type SimplifiedOrder = {
  id: string
  createdAt: string
  paid: boolean
  netAmount: number
  taxAmount: number
  totalAmount: number
  currency: string
  invoiceNumber: string
  productName: string
}

type TableUserOrdersProps = {
  orders: SimplifiedOrder[]
}

const ITEMS_PER_PAGE = 5

export function TableUserOrders({ orders }: TableUserOrdersProps) {
  const [page, setPage] = useState(1)
  const [sortAsc, setSortAsc] = useState(false)
  const [searchInvoice, setSearchInvoice] = useState("")
  const [searchTotal, setSearchTotal] = useState("")

  // Filter by invoice_number and total_amount
  const filteredOrders = orders.filter((order) => {
    const invoiceMatch = order.invoiceNumber
      .toLowerCase()
      .includes(searchInvoice.toLowerCase())
    const totalMatch = searchTotal
      ? order.totalAmount === Number(searchTotal)
      : true
    return invoiceMatch && totalMatch
  })

  // Sort by created_at
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return sortAsc ? dateA - dateB : dateB - dateA
  })

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE)
  const paginatedOrders = sortedOrders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  return (
    <>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search invoice number"
          value={searchInvoice}
          onChange={(e) => setSearchInvoice(e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Search total amount"
          type="number"
          value={searchTotal}
          onChange={(e) => setSearchTotal(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="outline" onClick={() => setSortAsc(!sortAsc)}>
          Sort by Date {sortAsc ? "↑" : "↓"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Purchase date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Net</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Product name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.invoiceNumber}</TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <span
                  className={
                    order.paid
                      ? "text-green-600 font-semibold"
                      : "text-orange-500 font-semibold"
                  }
                >
                  {order.paid ? "Yes" : "No"}
                </span>
              </TableCell>
              <TableCell>{order.netAmount}</TableCell>
              <TableCell>{order.taxAmount}</TableCell>
              <TableCell>{order.totalAmount}</TableCell>
              <TableCell>{order.currency.toUpperCase()}</TableCell>
              <TableCell>{order.productName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end gap-4 mt-4">
        <span className="text-sm text-gray-400">
          page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            previous
          </Button>
          <Button
            variant="outline"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            next
          </Button>
        </div>
      </div>
    </>
  )
}
