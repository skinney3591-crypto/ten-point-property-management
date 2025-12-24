'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TrendingUp, TrendingDown, Home } from 'lucide-react'
import type { Property, Booking, Expense } from '@/types/database'

interface BookingWithProperty extends Booking {
  properties: Property
}

interface ExpenseWithDetails extends Expense {
  properties: Property
}

interface PropertyBreakdownProps {
  properties: Property[]
  bookings: BookingWithProperty[]
  expenses: ExpenseWithDetails[]
}

export function PropertyBreakdown({
  properties,
  bookings,
  expenses,
}: PropertyBreakdownProps) {
  const propertyData = useMemo(() => {
    return properties.map((property) => {
      const propertyBookings = bookings.filter(
        (b) => b.property_id === property.id
      )
      const propertyExpenses = expenses.filter(
        (e) => e.property_id === property.id
      )

      const revenue = propertyBookings.reduce(
        (sum, b) => sum + (b.payout_amount || b.total_amount || 0),
        0
      )
      const expenseTotal = propertyExpenses.reduce((sum, e) => sum + e.amount, 0)
      const profit = revenue - expenseTotal
      const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0
      const bookingCount = propertyBookings.length

      // Calculate average nightly rate
      const totalNights = propertyBookings.reduce((sum, b) => {
        const checkIn = new Date(b.check_in)
        const checkOut = new Date(b.check_out)
        return sum + Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      }, 0)
      const avgNightlyRate = totalNights > 0 ? revenue / totalNights : 0

      return {
        property,
        revenue,
        expenses: expenseTotal,
        profit,
        profitMargin,
        bookingCount,
        avgNightlyRate,
      }
    }).sort((a, b) => b.revenue - a.revenue)
  }, [properties, bookings, expenses])

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Home className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No properties</h3>
          <p className="text-muted-foreground">
            Add properties to see their financial breakdown.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Calculate totals
  const totalRevenue = propertyData.reduce((sum, p) => sum + p.revenue, 0)
  const totalExpenses = propertyData.reduce((sum, p) => sum + p.expenses, 0)
  const totalProfit = totalRevenue - totalExpenses

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Net Profit</TableHead>
                <TableHead className="text-right">Margin</TableHead>
                <TableHead className="text-right">Bookings</TableHead>
                <TableHead className="text-right">Avg/Night</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propertyData.map(({ property, revenue, expenses, profit, profitMargin, bookingCount, avgNightlyRate }) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell className="text-right text-green-600">
                    ${revenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-red-500">
                    ${expenses.toLocaleString()}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${profit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    ${profit.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={profitMargin >= 50 ? 'text-green-600 border-green-200' : profitMargin >= 20 ? 'text-yellow-600 border-yellow-200' : 'text-red-600 border-red-200'}
                    >
                      {profitMargin >= 0 ? (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3" />
                      )}
                      {profitMargin.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{bookingCount}</TableCell>
                  <TableCell className="text-right">
                    ${avgNightlyRate.toFixed(0)}
                  </TableCell>
                </TableRow>
              ))}
              {/* Totals row */}
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right text-green-600">
                  ${totalRevenue.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-red-500">
                  ${totalExpenses.toLocaleString()}
                </TableCell>
                <TableCell className={`text-right ${totalProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  ${totalProfit.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%
                </TableCell>
                <TableCell className="text-right">
                  {bookings.length}
                </TableCell>
                <TableCell className="text-right">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
