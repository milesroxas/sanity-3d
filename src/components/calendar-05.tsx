"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

type Calendar05Props = {
  from?: string
  to?: string
  onChange?: (range: { from?: string; to?: string }) => void
  numberOfMonths?: number
  disablePast?: boolean
  className?: string
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

export default function Calendar05({
  from,
  to,
  onChange,
  numberOfMonths = 2,
  disablePast = true,
  className,
}: Calendar05Props) {
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

  return (
    <Calendar
      mode="range"
      defaultMonth={selected?.from ?? today}
      selected={selected}
      onSelect={(range) => {
        const next = {
          from: range?.from ? formatYMD(range.from) : undefined,
          to: range?.to ? formatYMD(range.to) : undefined,
        }
        onChange?.(next)
      }}
      numberOfMonths={numberOfMonths}
      disabled={disablePast ? { before: today } : undefined}
      className={"rounded-lg border shadow-sm " + (className ?? "")}
    />
  )
}
