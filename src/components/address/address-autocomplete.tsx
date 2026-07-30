"use client"

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Spinner } from "../ui/spinner";
import { useDebounce } from '@/hooks/useDebounce';


type locationItem = {
  label: string,
  value: string,
}

type locationDataBasic = {
  formattedAddress: string
  version: number
  vtpL1: number
  vtpL2: number
  vtpL3: number
}

type locationData = locationDataBasic & {
  reference: locationDataBasic
}

const fetchSuggestions = async (key: string): Promise<locationItem[]> => {
  const response = await fetch(`https://location.viettelpost.vn/location/v2.0/autocomplete?system=VTP&q=${encodeURIComponent(key)}`, {
    cache: 'force-cache'
  });
  if (!response.ok) throw new Error('fetch failed');
  const result = await response.json();
  if (!result.suggestions || result.suggestions.length == 0) throw new Error('not found!');
  return result.suggestions.map((item: any) => (
    { label: item.name, value: item.id }
  ));
}

const fetchLocationData = async (id: string): Promise<locationData> => {
  const response = await fetch(`https://location.viettelpost.vn/location/v2.0/autocomplete/${id}?system=VTP`, {
    cache: 'force-cache'
  });
  if (!response.ok) throw new Error('fetch failed');
  const { code, message, ...result } = await response.json();
  if (code) throw new Error(message);
  return result;
}

interface AddressAutoCompleteProps {
  className?: string
  defaultValue?: string
  onChange?: (data: locationData) => void;
}

export function AddressAutoComplete({
  className,
  defaultValue = 'an khánh',
  onChange,
}: AddressAutoCompleteProps) {
  const [addressString, setAddressString] = useState<string | undefined>(defaultValue);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<locationItem[]>([]);
  const debouncedSearchKey = useDebounce(searchKey);
  const searcKeyMinLength = 5;

  useEffect(() => {
    if (!debouncedSearchKey || debouncedSearchKey.length < searcKeyMinLength) return;
    const fetch = async () => {
      setSuggestions([]);
      setIsSearching(true);
      const result = await fetchSuggestions(debouncedSearchKey).catch(() => ([]));
      setSuggestions(result);
      setIsSearching(false);

      console.log({ suggestionsResult: result });
    };
    fetch();
  }, [debouncedSearchKey]);

  const handleItemSelect = async (item: locationItem | null) => {
    if (!item) {
      return;
    }
    console.log({ sellectedItem: item });
    setAddressString(item.label);
    const locationData = await fetchLocationData(item.value).catch(() => null);
    locationData && onChange?.(locationData);

    console.log({ locationData });
  };

  const getStatus = (): string | React.ReactNode => {
    if (!searchKey) {
      return 'Nhập từ khoá để tìm kiếm địa chỉ.'
    }
    if (!debouncedSearchKey || debouncedSearchKey.length < searcKeyMinLength) {
      return (`Từ khoá cần dài tối thiểu ${searcKeyMinLength} ký tự.`);
    }
    if (isSearching) {
      return <><Spinner className="w-4 h-4 mr-2" /><span>Đang tìm...</span></>
    }
    return 'Không có kết quả phù hợp.';
  }

  // Debug
  useEffect(() => {
    console.log({ searchKey });
  }, [searchKey]);

  useEffect(() => {
    console.log({ addressString });
  }, [addressString]);

  return (
    <Combobox
      filteredItems={suggestions}
      inputValue={searchKey || addressString || ''}
      onInputValueChange={(value, { reason }) => {
        console.log({ 'onInputValueChange reason': reason });

        !value && setSuggestions([]);

        if (reason === 'input-change') {
          setSearchKey(value);
        } else {
          setSearchKey(null);
        }
      }}

      onValueChange={(value: locationItem | null, { reason }) => {
        console.log({ 'onValueChange reason': reason });
        handleItemSelect(value)
      }}
    >
      <ComboboxInput
        className={cn(className && className)}
        placeholder="Nhập địa chỉ"
        onChange={(e) => {
          setAddressString(e.currentTarget.value)
        }}
      />
      <ComboboxContent>
        <ComboboxEmpty className="text-xs">{getStatus()}</ComboboxEmpty>
        <ComboboxList>
          {(item: locationItem) => (
            <ComboboxItem
              key={item.value}
              value={item}
            >
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
