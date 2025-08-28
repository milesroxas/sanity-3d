"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Calendar23Props = {
  from?: string
  to?: string
  onChange?: (range: { from?: string; to?: string }) => void
  numberOfMonths?: number
  disablePast?: boolean
  className?: string
  placeholder?: string
}

function parseYMD(value?: string) {
  if (!value) return undefined
  const parts = value.split("-").map(Number)
  if (parts.length !== 3) return undefined
  const [y, m, d] = parts
  if (!y || !m || !d) return undefined
  return new Date(y, m - 1, d)
}

function formatYMD(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export default function Calendar23({
  from,
  to,
  onChange,
  numberOfMonths = 2,
  disablePast = true,
  className,
  placeholder = "Select date",
}: Calendar23Props) {
  const selected: DateRange | undefined = React.useMemo(() => {
    const f = parseYMD(from)
    const t = parseYMD(to)
    if (!f && !t) return undefined
    return { from: f, to: t }
  }, [from, to])

  const today = React.useMemo(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }, [])

  const displayText = selected?.from && selected?.to
    ? `${selected.from.toLocaleDateString()} - ${selected.to.toLocaleDateString()}`
    : placeholder

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={"w-full justify-between font-normal " + (className ?? "")}
        >
          {displayText}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="range"
          selected={selected}
          defaultMonth={selected?.from ?? today}
          numberOfMonths={numberOfMonths}
          disabled={disablePast ? { before: today } : undefined}
          captionLayout="dropdown"
          onSelect={(range) => {
            const next = {
              from: range?.from ? formatYMD(range.from) : undefined,
              to: range?.to ? formatYMD(range.to) : undefined,
            }
            onChange?.(next)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
