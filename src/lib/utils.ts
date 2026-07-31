import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (str: string): string => {
  if (typeof str !== "string" || !str.trim()) return "?";

  return (
    str
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?"
  );
};

export function formatCurrency(
  amount: number,
  opts?: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    noDecimals?: boolean;
  },
) {
  const { currency = "USD", locale = "en-US", minimumFractionDigits, maximumFractionDigits, noDecimals } = opts ?? {};

  const formatOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    minimumFractionDigits: noDecimals ? 0 : minimumFractionDigits,
    maximumFractionDigits: noDecimals ? 0 : maximumFractionDigits,
  };

  return new Intl.NumberFormat(locale, formatOptions).format(amount);
}

export function fixLocalName(input: string) {
  return input
    .replace(/^Thành\sphố\s/g, 'TP.')
    .replace(/^Tỉnh\s/g, 'T.')
    .replace(/^Huyện\s/g, 'H.')
    .replace(/^Quận\s/g, 'Q.')
    .replace(/^Xã\s/g, 'X.')
    .replace(/^Thị\sxã\s/g, 'TX.')
    .replace(/^Phường\s/g, 'P.')
    .replace(/^Thị\strấn\s/g, 'TT.')
}