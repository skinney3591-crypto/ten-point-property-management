import {
  getProperties,
  getBookingsInRangeWithProperty,
  getExpensesInRangeWithDetails,
  type BookingWithProperty,
  type ExpenseWithDetails,
} from '@/lib/supabase/queries'
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
import { startOfMonth, endOfMonth, subMonths, format, differenceInDays, startOfYear, endOfYear } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Home,
  Calendar,
  PiggyBank,
  Receipt,
} from 'lucide-react'
import { ExpensesTable } from '@/components/financials/expenses-table'
import { AddExpenseButton } from '@/components/financials/add-expense-button'
import { RevenueChart } from '@/components/financials/revenue-chart'
import { PropertyBreakdown } from '@/components/financials/property-breakdown'
import { OccupancyStats } from '@/components/financials/occupancy-stats'

export default async function FinancialsPage() {
  // TEMPORARILY DISABLED FOR DEMO
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect('/login')
  // }

  const now = new Date()
  const thisMonthStart = startOfMonth(now)
  const thisMonthEnd = endOfMonth(now)
  const lastMonthStart = startOfMonth(subMonths(now, 1))
  const lastMonthEnd = endOfMonth(subMonths(now, 1))
  const yearStart = startOfYear(now)
  const yearEnd = endOfYear(now)

  // Fetch properties, bookings, and expenses in parallel
  const [properties, bookings, expenses] = await Promise.all([
    getProperties(),
    getBookingsInRangeWithProperty(yearStart, yearEnd),
    getExpensesInRangeWithDetails(yearStart, yearEnd),
  ])

  // Calculate this month's revenue
  const thisMonthBookings = bookings.filter((b) => {
    const checkIn = new Date(b.check_in)
    return checkIn >= thisMonthStart && checkIn <= thisMonthEnd
  })
  const thisMonthRevenue = thisMonthBookings.reduce(
    (sum, b) => sum + (b.payout_amount || b.total_amount || 0),
    0
  )

  // Calculate last month's revenue for comparison
  const lastMonthBookings = bookings.filter((b) => {
    const checkIn = new Date(b.check_in)
    return checkIn >= lastMonthStart && checkIn <= lastMonthEnd
  })
  const lastMonthRevenue = lastMonthBookings.reduce(
    (sum, b) => sum + (b.payout_amount || b.total_amount || 0),
    0
  )

  // Calculate this month's expenses
  const thisMonthExpenses = expenses.filter((e) => {
    const date = new Date(e.date)
    return date >= thisMonthStart && date <= thisMonthEnd
  })
  const thisMonthExpenseTotal = thisMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  )

  // Calculate last month's expenses
  const lastMonthExpenseList = expenses.filter((e) => {
    const date = new Date(e.date)
    return date >= lastMonthStart && date <= lastMonthEnd
  })
  const lastMonthExpenseTotal = lastMonthExpenseList.reduce(
    (sum, e) => sum + e.amount,
    0
  )

  // Calculate net profit
  const thisMonthProfit = thisMonthRevenue - thisMonthExpenseTotal
  const lastMonthProfit = lastMonthRevenue - lastMonthExpenseTotal

  // Calculate year-to-date totals
  const ytdRevenue = bookings.reduce(
    (sum, b) => sum + (b.payout_amount || b.total_amount || 0),
    0
  )
  const ytdExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const ytdProfit = ytdRevenue - ytdExpenses

  // Revenue change percentage
  const revenueChange = lastMonthRevenue > 0
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    : 0

  // Calculate occupancy rate for this month
  const totalPropertyDays = properties.length * differenceInDays(thisMonthEnd, thisMonthStart)
  const occupiedDays = thisMonthBookings.reduce((sum, b) => {
    const checkIn = new Date(b.check_in)
    const checkOut = new Date(b.check_out)
    const start = checkIn < thisMonthStart ? thisMonthStart : checkIn
    const end = checkOut > thisMonthEnd ? thisMonthEnd : checkOut
    return sum + Math.max(0, differenceInDays(end, start))
  }, 0)
  const occupancyRate = totalPropertyDays > 0
    ? Math.round((occupiedDays / totalPropertyDays) * 100)
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financials</h2>
          <p className="text-muted-foreground">
            Track revenue, expenses, and profitability across your properties
          </p>
        </div>
        <AddExpenseButton properties={properties} />
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Month Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${thisMonthRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {revenueChange >= 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
              </span>
              <span className="ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Month Expenses
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${thisMonthExpenseTotal.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {thisMonthExpenses.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${thisMonthProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${thisMonthProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(thisMonthStart, 'MMMM yyyy')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              {thisMonthBookings.length} bookings this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Year-to-Date Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Year-to-Date Summary ({now.getFullYear()})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-green-50">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${ytdRevenue.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50">
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                ${ytdExpenses.toLocaleString()}
              </p>
            </div>
            <div className={`text-center p-4 rounded-lg ${ytdProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <p className={`text-2xl font-bold ${ytdProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                ${ytdProfit.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="properties">By Property</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <RevenueChart bookings={bookings} expenses={expenses} />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpensesTable expenses={expenses} properties={properties} />
        </TabsContent>

        <TabsContent value="properties">
          <PropertyBreakdown
            properties={properties}
            bookings={bookings}
            expenses={expenses}
          />
        </TabsContent>

        <TabsContent value="occupancy">
          <OccupancyStats
            properties={properties}
            bookings={bookings}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
