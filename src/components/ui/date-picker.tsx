"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DatePickerProps = {
  value?: string
  onChange: (value?: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

function parseYMD(value?: string) {
  if (!value) return undefined
  const parts = value.split("-").map(Number)
  if (parts.length !== 3) return undefined
  const [y, m, d] = parts
  if (!y || !m || !d) return undefined
  // Create date in local time to avoid timezone shifts
  return new Date(y, m - 1, d)
}

function formatYMD(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function DatePicker({ value, onChange, placeholder = "Pick a date", disabled, className }: DatePickerProps) {
  const date = parseYMD(value)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => onChange(d ? formatYMD(d) : undefined)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
