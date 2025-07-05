'use client'

import {Button, buttonVariants} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import {differenceInCalendarDays} from 'date-fns'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import * as React from 'react'
import {
  DayPicker,
  labelNext,
  labelPrevious,
  useDayPicker,
  type DayPickerProps,
} from 'react-day-picker'

export type CalendarProps = DayPickerProps & {
  /**
   * In the year view, the number of years to display at once.
   * @default 12
   */
  yearRange?: number

  /**
   * Wether to show the year switcher in the caption.
   * @default true
   */
  showYearSwitcher?: boolean

  monthsClassName?: string
  monthCaptionClassName?: string
  weekdaysClassName?: string
  weekdayClassName?: string
  monthClassName?: string
  captionClassName?: string
  captionLabelClassName?: string
  buttonNextClassName?: string
  buttonPreviousClassName?: string
  navClassName?: string
  monthGridClassName?: string
  weekClassName?: string
  dayClassName?: string
  dayButtonClassName?: string
  rangeStartClassName?: string
  rangeEndClassName?: string
  selectedClassName?: string
  todayClassName?: string
  outsideClassName?: string
  disabledClassName?: string
  rangeMiddleClassName?: string
  hiddenClassName?: string
}

type NavView = 'days' | 'years'

/**
 * A custom calendar component built on top of react-day-picker.
 * @param props The props for the calendar.
 * @default yearRange 12
 * @returns
 */
function Calendar({
  className,
  showOutsideDays = true,
  showYearSwitcher = true,
  yearRange = 12,
  numberOfMonths,
  components,
  ...props
}: CalendarProps) {
  const [navView, setNavView] = React.useState<NavView>('days')
  const [displayYears, setDisplayYears] = React.useState<{
    from: number
    to: number
  }>(
    React.useMemo(() => {
      const currentYear = new Date().getFullYear()
      return {
        from: currentYear - Math.floor(yearRange / 2 - 1),
        to: currentYear + Math.ceil(yearRange / 2),
      }
    }, [yearRange]),
  )

  const {onNextClick, onPrevClick, startMonth, endMonth} = props

  const columnsDisplayed = navView === 'years' ? 1 : numberOfMonths

  const monthsClassName = cn('relative flex w-full', props.monthsClassName)
  const monthCaptionClassName = cn(
    'relative mx-10 flex h-7 items-center justify-center',
    props.monthCaptionClassName,
  )
  const weekdaysClassName = cn('flex flex-row', props.weekdaysClassName)
  const weekdayClassName = cn(
    'w-8 text-sm font-normal text-muted-foreground',
    props.weekdayClassName,
  )
  const monthClassName = cn('w-full', props.monthClassName)
  const captionClassName = cn(
    'relative flex items-center justify-center pt-1',
    props.captionClassName,
  )
  const captionLabelClassName = cn(
    'truncate text-sm font-medium',
    props.captionLabelClassName,
  )
  const buttonNavClassName = buttonVariants({
    variant: 'outline',
    className:
      'absolute h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
  })
  const buttonNextClassName = cn(
    buttonNavClassName,
    'right-0',
    props.buttonNextClassName,
  )
  const buttonPreviousClassName = cn(
    buttonNavClassName,
    'left-0',
    props.buttonPreviousClassName,
  )
  const navClassName = cn('flex items-start', props.navClassName)
  const monthGridClassName = cn(
    'mx-auto mt-4 w-full calendar-grid',
    props.monthGridClassName,
  )
  const weekClassName = cn('mt-2 flex w-max items-start', props.weekClassName)
  const dayClassName = cn(
    'flex size-8 flex-1 items-center justify-center p-0 text-sm bg-transparent hover:bg-[var(--color-theme-primary-50)]!',
    props.dayClassName,
  )
  const dayButtonClassName = cn(
    buttonVariants({variant: 'ghost'}),
    'size-8 rounded-md p-0 font-normal transition-none aria-selected:opacity-100 bg-transparent!',
    props.dayButtonClassName,
  )
  const buttonRangeClassName =
    '[&>button]:text-primary-foreground [&>button]:hover:text-primary-foreground [&>button]:hover:bg-transparent'
  const rangeStartClassName = cn(
    buttonRangeClassName,
    'day-range-start rounded-s-md bg-[var(--color-theme-primary-500)]! hover:bg-[var(--color-theme-primary-600)]!',
    props.rangeStartClassName,
  )
  const rangeEndClassName = cn(
    buttonRangeClassName,
    'day-range-start rounded-s-md bg-[var(--color-theme-primary-500)]! hover:bg-[var(--color-theme-primary-600)]!',
    props.rangeEndClassName,
  )
  const rangeMiddleClassName = cn(
    'bg-accent !text-foreground [&>button]:bg-transparent [&>button]:!text-foreground [&>button]:hover:bg-transparent [&>button]:hover:!text-foreground',
    props.rangeMiddleClassName,
  )
  const selectedClassName = cn(
    'bg-[var(--color-theme-primary-100)]! hover:bg-[var(--color-theme-primary-200)]!',
    props.selectedClassName,
  )
  const todayClassName = cn(
    '[&>button]:bg-accent [&>button]:text-accent-foreground',
    props.todayClassName,
  )
  const outsideClassName = cn(
    'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
    props.outsideClassName,
  )
  const disabledClassName = cn(
    'text-muted-foreground opacity-50',
    props.disabledClassName,
  )
  const hiddenClassName = cn('invisible flex-1', props.hiddenClassName)

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('w-full min-w-full', className)}
      style={{
        width: 248.8 * (columnsDisplayed ?? 1) + 'px',
      }}
      classNames={{
        months: monthsClassName,
        month_caption: monthCaptionClassName,
        weekdays: weekdaysClassName,
        weekday: weekdayClassName,
        month: monthClassName,
        caption: captionClassName,
        caption_label: captionLabelClassName,
        button_next: buttonNextClassName,
        button_previous: buttonPreviousClassName,
        nav: navClassName,
        month_grid: monthGridClassName,
        week: weekClassName,
        day: dayClassName,
        day_button: dayButtonClassName,
        range_start: rangeStartClassName,
        range_middle: rangeMiddleClassName,
        range_end: rangeEndClassName,
        selected: selectedClassName,
        today: todayClassName,
        outside: outsideClassName,
        disabled: disabledClassName,
        hidden: hiddenClassName,
      }}
      components={{
        Chevron: ({orientation}) => {
          const Icon = orientation === 'left' ? ChevronLeft : ChevronRight
          return <Icon className="h-4 w-4" />
        },
        Nav: ({className}) => (
          <Nav
            className={className}
            displayYears={displayYears}
            navView={navView}
            setDisplayYears={setDisplayYears}
            startMonth={startMonth}
            endMonth={endMonth}
            onPrevClick={onPrevClick}
            onNextClick={onNextClick}
          />
        ),
        CaptionLabel: props => (
          <CaptionLabel
            showYearSwitcher={showYearSwitcher}
            navView={navView}
            setNavView={setNavView}
            displayYears={displayYears}
            {...props}
          />
        ),
        MonthGrid: ({className, children, ...props}) => (
          <MonthGrid
            className={className}
            displayYears={displayYears}
            startMonth={startMonth}
            endMonth={endMonth}
            navView={navView}
            setNavView={setNavView}
            {...props}
          >
            {children}
          </MonthGrid>
        ),
        ...components,
      }}
      numberOfMonths={columnsDisplayed}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

function Nav({
  className,
  navView,
  startMonth,
  endMonth,
  displayYears,
  setDisplayYears,
  onPrevClick,
  onNextClick,
}: {
  className?: string
  navView: NavView
  startMonth?: Date
  endMonth?: Date
  displayYears: {from: number; to: number}
  setDisplayYears: React.Dispatch<
    React.SetStateAction<{from: number; to: number}>
  >
  onPrevClick?: (date: Date) => void
  onNextClick?: (date: Date) => void
}) {
  const {nextMonth, previousMonth, goToMonth} = useDayPicker()

  const isPreviousDisabled = (() => {
    if (navView === 'years') {
      return (
        (startMonth &&
          differenceInCalendarDays(
            new Date(displayYears.from - 1, 0, 1),
            startMonth,
          ) < 0) ||
        (endMonth &&
          differenceInCalendarDays(
            new Date(displayYears.from - 1, 0, 1),
            endMonth,
          ) > 0)
      )
    }
    return !previousMonth
  })()

  const isNextDisabled = (() => {
    if (navView === 'years') {
      return (
        (startMonth &&
          differenceInCalendarDays(
            new Date(displayYears.to + 1, 0, 1),
            startMonth,
          ) < 0) ||
        (endMonth &&
          differenceInCalendarDays(
            new Date(displayYears.to + 1, 0, 1),
            endMonth,
          ) > 0)
      )
    }
    return !nextMonth
  })()

  const handlePreviousClick = React.useCallback(() => {
    if (!previousMonth) return
    if (navView === 'years') {
      setDisplayYears(prev => ({
        from: prev.from - (prev.to - prev.from + 1),
        to: prev.to - (prev.to - prev.from + 1),
      }))
      onPrevClick?.(
        new Date(
          displayYears.from - (displayYears.to - displayYears.from),
          0,
          1,
        ),
      )
      return
    }
    goToMonth(previousMonth)
    onPrevClick?.(previousMonth)
  }, [
    previousMonth,
    goToMonth,
    displayYears.from,
    displayYears.to,
    navView,
    onPrevClick,
    setDisplayYears,
  ])

  const handleNextClick = React.useCallback(() => {
    if (!nextMonth) return
    if (navView === 'years') {
      setDisplayYears(prev => ({
        from: prev.from + (prev.to - prev.from + 1),
        to: prev.to + (prev.to - prev.from + 1),
      }))
      onNextClick?.(
        new Date(
          displayYears.from + (displayYears.to - displayYears.from),
          0,
          1,
        ),
      )
      return
    }
    goToMonth(nextMonth)
    onNextClick?.(nextMonth)
  }, [
    goToMonth,
    nextMonth,
    displayYears.from,
    displayYears.to,
    navView,
    onNextClick,
    setDisplayYears,
  ])
  return (
    <nav className={cn('flex items-center', className)}>
      <Button
        variant="outline"
        className="absolute left-0 h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100"
        type="button"
        tabIndex={isPreviousDisabled ? undefined : -1}
        disabled={isPreviousDisabled}
        aria-label={
          navView === 'years'
            ? `Go to the previous ${
                displayYears.to - displayYears.from + 1
              } years`
            : labelPrevious(previousMonth)
        }
        onClick={handlePreviousClick}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        className="absolute right-0 h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100"
        type="button"
        tabIndex={isNextDisabled ? undefined : -1}
        disabled={isNextDisabled}
        aria-label={
          navView === 'years'
            ? `Go to the next ${displayYears.to - displayYears.from + 1} years`
            : labelNext(nextMonth)
        }
        onClick={handleNextClick}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}

function CaptionLabel({
  children,
  showYearSwitcher,
  navView,
  setNavView,
  displayYears,
  ...props
}: {
  showYearSwitcher?: boolean
  navView: NavView
  setNavView: React.Dispatch<React.SetStateAction<NavView>>
  displayYears: {from: number; to: number}
} & React.HTMLAttributes<HTMLSpanElement>) {
  if (!showYearSwitcher) return <span {...props}>{children}</span>
  return (
    <Button
      className="h-7 w-full truncate text-sm font-medium"
      variant="ghost"
      size="sm"
      onClick={() => setNavView(prev => (prev === 'days' ? 'years' : 'days'))}
    >
      {navView === 'days'
        ? children
        : displayYears.from + ' - ' + displayYears.to}
    </Button>
  )
}

function MonthGrid({
  className,
  children,
  displayYears,
  startMonth,
  endMonth,
  navView,
  setNavView,
  ...props
}: {
  className?: string
  children: React.ReactNode
  displayYears: {from: number; to: number}
  startMonth?: Date
  endMonth?: Date
  navView: NavView
  setNavView: React.Dispatch<React.SetStateAction<NavView>>
} & React.TableHTMLAttributes<HTMLTableElement>) {
  if (navView === 'years') {
    return (
      <YearGrid
        displayYears={displayYears}
        startMonth={startMonth}
        endMonth={endMonth}
        setNavView={setNavView}
        navView={navView}
        className={className}
        {...props}
      />
    )
  }
  return (
    <table className={className} {...props}>
      {children}
    </table>
  )
}

function YearGrid({
  className,
  displayYears,
  startMonth,
  endMonth,
  setNavView,
  navView,
  ...props
}: {
  className?: string
  displayYears: {from: number; to: number}
  startMonth?: Date
  endMonth?: Date
  setNavView: React.Dispatch<React.SetStateAction<NavView>>
  navView: NavView
} & React.HTMLAttributes<HTMLDivElement>) {
  const {goToMonth, selected} = useDayPicker()

  return (
    <div className={cn('grid grid-cols-4 gap-y-2', className)} {...props}>
      {Array.from({length: displayYears.to - displayYears.from + 1}, (_, i) => {
        const isBefore =
          differenceInCalendarDays(
            new Date(displayYears.from + i, 11, 31),
            startMonth!,
          ) < 0

        const isAfter =
          differenceInCalendarDays(
            new Date(displayYears.from + i, 0, 0),
            endMonth!,
          ) > 0

        const isDisabled = isBefore || isAfter
        return (
          <Button
            key={i}
            className={cn(
              'h-7 w-full text-sm font-normal text-foreground',
              displayYears.from + i === new Date().getFullYear() &&
                'bg-accent font-medium text-accent-foreground',
            )}
            variant="ghost"
            onClick={() => {
              setNavView('days')
              goToMonth(
                new Date(
                  displayYears.from + i,
                  (selected as Date | undefined)?.getMonth() ?? 0,
                ),
              )
            }}
            disabled={navView === 'years' ? isDisabled : undefined}
          >
            {displayYears.from + i}
          </Button>
        )
      })}
    </div>
  )
}

export {Calendar}
