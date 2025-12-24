'use client'

import { useMemo } from 'react'
import {
  format,
  startOfMonth,
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
  isSameMonth,
} from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { Booking, Expense, Property } from '@/types/database'

interface BookingWithProperty extends Booking {
  properties: Property
}

interface ExpenseWithDetails extends Expense {
  properties: Property
}

interface RevenueChartProps {
  bookings: BookingWithProperty[]
  expenses: ExpenseWithDetails[]
}

export function RevenueChart({ bookings, expenses }: RevenueChartProps) {
  const now = new Date()
  const yearStart = startOfYear(now)
  const yearEnd = endOfYear(now)

  const monthlyData = useMemo(() => {
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd })

    return months.map((month) => {
      const monthBookings = bookings.filter((b) =>
        isSameMonth(new Date(b.check_in), month)
      )
      const monthExpenses = expenses.filter((e) =>
        isSameMonth(new Date(e.date), month)
      )

      const revenue = monthBookings.reduce(
        (sum, b) => sum + (b.payout_amount || b.total_amount || 0),
        0
      )
      const expenseTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
      const profit = revenue - expenseTotal

      return {
        month: format(month, 'MMM'),
        fullMonth: format(month, 'MMMM yyyy'),
        revenue,
        expenses: expenseTotal,
        profit,
        bookingCount: monthBookings.length,
      }
    })
  }, [bookings, expenses, yearStart, yearEnd])

  // Find max value for scaling
  const maxValue = Math.max(
    ...monthlyData.map((d) => Math.max(d.revenue, d.expenses))
  )

  // Calculate totals
  const totalRevenue = monthlyData.reduce((sum, d) => sum + d.revenue, 0)
  const totalExpenses = monthlyData.reduce((sum, d) => sum + d.expenses, 0)
  const totalProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0
    ? ((totalProfit / totalRevenue) * 100).toFixed(1)
    : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Monthly Revenue & Expenses ({now.getFullYear()})</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-green-500" />
              <span>Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-red-400" />
              <span>Expenses</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Simple Bar Chart */}
        <div className="space-y-3">
          {monthlyData.map((data) => (
            <div key={data.month} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium w-12">{data.month}</span>
                <div className="flex-1 mx-4 space-y-1">
                  {/* Revenue bar */}
                  <div className="h-4 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{
                        width: maxValue > 0 ? `${(data.revenue / maxValue) * 100}%` : '0%',
                      }}
                    />
                  </div>
                  {/* Expense bar */}
                  <div className="h-4 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-red-400 transition-all"
                      style={{
                        width: maxValue > 0 ? `${(data.expenses / maxValue) * 100}%` : '0%',
                      }}
                    />
                  </div>
                </div>
                <div className="text-right min-w-[140px]">
                  <div className="text-green-600 font-medium">
                    ${data.revenue.toLocaleString()}
                  </div>
                  <div className="text-red-500 text-xs">
                    -${data.expenses.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-lg font-bold text-green-600">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-lg font-bold text-red-500">
              ${totalExpenses.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Net Profit</p>
            <p className={`text-lg font-bold ${totalProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              ${totalProfit.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Profit Margin</p>
            <div className="flex items-center justify-center gap-1">
              {Number(profitMargin) >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <p className={`text-lg font-bold ${Number(profitMargin) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitMargin}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
