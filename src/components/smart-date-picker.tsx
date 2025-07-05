'use client'

import {Button} from '@/components/ui/button'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {cn} from '@/lib/utils'
import {Calendar} from '@/components/ui/calendar'
import {format} from 'date-fns'
import {tr} from 'date-fns/locale'
import {CalendarIcon, X} from 'lucide-react'
import * as React from 'react'
import {type DateRange} from 'react-day-picker'

interface SmartDatePickerProps {
  onDateRangeChange: (start?: string, end?: string) => void
  className?: string
  defaultToLastWeek?: boolean
}

export default function SmartDatePicker({
  onDateRangeChange,
  className,
  defaultToLastWeek = false,
}: SmartDatePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    if (defaultToLastWeek) {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - 7)
      return {from: startDate, to: endDate}
    }
    return undefined
  })
  const [isOpen, setIsOpen] = React.useState(false)

  // Initialize with last week if defaultToLastWeek is true
  React.useEffect(() => {
    if (defaultToLastWeek && date?.from && date?.to) {
      onDateRangeChange(
        `${format(date.from, 'yyyy-MM-dd')}T00:00`,
        `${format(date.to, 'yyyy-MM-dd')}T23:59`,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultToLastWeek]) // Only run when defaultToLastWeek changes

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate)

    if (selectedDate?.from && selectedDate?.to) {
      // Range selected
      onDateRangeChange(
        `${format(selectedDate.from, 'yyyy-MM-dd')}T00:00`,
        `${format(selectedDate.to, 'yyyy-MM-dd')}T23:59`,
      )
    } else if (selectedDate?.from) {
      // Single date selected
      onDateRangeChange(
        `${format(selectedDate.from, 'yyyy-MM-dd')}T00:00`,
        `${format(selectedDate.from, 'yyyy-MM-dd')}T23:59`,
      )
    } else {
      // No date selected
      onDateRangeChange(undefined, undefined)
    }
  }

  const clearDate = () => {
    setDate(undefined)
    onDateRangeChange(undefined, undefined)
    setIsOpen(false)
  }

  const formatDisplayText = () => {
    if (!date?.from) return 'Tarih seç...'

    if (date.to && date.from.getTime() !== date.to.getTime()) {
      // Range
      return `${format(date.from, 'dd MMM', {locale: tr})} - ${format(
        date.to,
        'dd MMM',
        {locale: tr},
      )}`
    } else {
      // Single date
      return format(date.from, 'dd MMM yyyy', {locale: tr})
    }
  }

  return (
    <div className={cn('relative', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'bg-[var(--color-theme-surface-secondary)]',
              'w-full justify-start text-left font-normal text-xs h-8 pr-8',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-3 w-3" />
            {formatDisplayText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-3 border shadow-lg z-[9999] bg-[var(--color-theme-surface-secondary)]"
          align="start"
        >
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>

      {date && (
        <button
          onClick={clearDate}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
