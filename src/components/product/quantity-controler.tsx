"use client"

import * as React from "react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

interface QuantityControlerProps {
  value: number
  onValueChange: (data: number) => void
  min?: number
  max?: number
  placeholder?: string
  disabled?: boolean
  className?: string
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'secondary' | "destructive" | "link" | null
}

export function QuantityControler({
  value,
  min = 0,
  max = 999,
  onValueChange,
  disabled = false,
  placeholder,
  className,
  buttonVariant = "ghost",
}: QuantityControlerProps) {

  const handleValueChange = (value: number) => {
    if (value < min || value > max) return;
    onValueChange(value)
  }

  const handleAdd = () => {
    handleValueChange(value + 1);
  }

  const handleMinus = () => {
    handleValueChange(value - 1);
  }

  return (
    <div className={"grid gap-6 "}>
      <InputGroup className={(className ? className : "")}>
        <InputGroupAddon align="inline-start">
          <InputGroupButton
            disabled={disabled}
            variant={buttonVariant}
            onClick={handleMinus}
            className="px-3"
          >-</InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput
          disabled={disabled}
          inputMode="numeric"
          placeholder={placeholder}
          value={value || min || ""}
          onChange={e => {
            const valStr = e.target.value;
            const val = Number(valStr) || min || 0;
            handleValueChange(val);
          }}
          className="text-center w-[2rem] text-sm"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            disabled={disabled}
            variant={buttonVariant}
            onClick={handleAdd}
            className="px-3"
          >+</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
