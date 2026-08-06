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
  buttonsVariant?: 'default' | 'outline' | 'ghost' | 'secondary' | "destructive" | "link" | null
}

export function QuantityControler({
  value,
  onValueChange,
  min: minProp = 1,
  max: maxProp = 9999,
  placeholder,
  className,
  disabled = false,
  buttonsVariant = "ghost",
}: QuantityControlerProps) {

  const min = Math.min(1, minProp, maxProp);
  const max = Math.max(1, minProp, maxProp);

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
            variant={buttonsVariant}
            onClick={handleMinus}
            className="px-3"
          >-</InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput
          disabled={disabled}
          inputMode="numeric"
          placeholder={placeholder}
          value={value || ""}
          className="text-center w-[2rem] text-sm"
          onChange={e => {
            handleValueChange(Number(e.target.value) || 0);
          }}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            disabled={disabled}
            variant={buttonsVariant}
            onClick={handleAdd}
            className="px-3"
          >+</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
