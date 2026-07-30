"use client"

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
import { Button } from "../ui/button";
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
  components: {
    type: string,
    name: string,
    id: string,
    typeName: string,
    level: number
  }[]
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
  value?: string | null
  onInputValueChange: (value: string) => void
  onAddressSelect?: (data: locationData) => void
}

export function AddressAutoComplete({
  className,
  onAddressSelect,
  onInputValueChange,
  value,
}: AddressAutoCompleteProps) {
  // const [addressString, setAddressString] = useState<string | undefined>(defaultValue);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<locationItem[]>([]);
  const debouncedSearchKey = useDebounce(searchKey);
  const searcKeyMinLength = 5;

  useEffect(() => {
    if (!debouncedSearchKey || debouncedSearchKey.length < searcKeyMinLength) return;
    const fetch = async () => {
      // setSuggestions([]);
      setIsSearching(true);
      const result = await fetchSuggestions(debouncedSearchKey).catch(() => ([]));
      setSuggestions(result);
      setIsSearching(false);
      console.log({ suggestionsResult: result });
    };
    fetch();
  }, [debouncedSearchKey]);

  const handleItemSelect = async (item: locationItem | null) => {
    if (!item) { return; }

    console.log({ sellectedItem: item });

    // onInputValueChange(item.label);
    const locationData = await fetchLocationData(item.value).catch(() => null);

    if (locationData) {
      onAddressSelect?.(locationData);
      const address = locationData.components.filter(i => i.level > 3).map(i => i.name).join(', ');
      onInputValueChange(address);
    }

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
    console.log({ value });
  }, [value]);

  return (
    <Combobox
      filteredItems={suggestions}
      inputValue={searchKey || value || ''}
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
          onInputValueChange(e.currentTarget.value)
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

type locationType = 'ward' | 'province'

const getLocationsAfterMerge = async (type: locationType) => {
  const urls = {
    ward: 'https://api.viettelpost.vn/api/setting/listAllWardAfterMerge',
    province: 'https://api.viettelpost.vn/api/setting/listAllProvinceAfterMerge',
  }
  const res = await fetch(urls[type], {
    cache: 'force-cache',
  });
  if (!res.ok) throw new Error('fetch failed');
  return await res.json();
}

type locationItemType = {
  label: string, value: string
}

interface locationSelectorProps {
  type: locationType
  parentCode?: string
  value?: string
  onChange?: (data: locationItemType) => void
  className?: string
}

export function locationSelector({
  type,
  parentCode,
  value = '',
  onChange,
  className,
}: locationSelectorProps) {
  const [allLocations, setAllLocations] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getLocationsAfterMerge(type).catch(() => []);
      setAllLocations(data)
    };
    fetch();
  }, []);

  const itemList = useMemo<locationItemType[]>(() => {
    if (type == 'province') {
      return allLocations.map(item => ({
        label: item.WARDS_NAME, value: item.WARDS_ID
      }))
    } else if (parentCode) {
      return allLocations.filter(item => (item.PROVINCE_ID == parentCode)).map(item => ({
        label: item.WARDS_NAME, value: item.WARDS_ID
      }))
    } else {
      return []
    };
  }, [type, allLocations, parentCode]);

  return (
    <>
      <Combobox
        items={itemList}
        defaultValue={value}
        onValueChange={(value) => {
          // onChange?.(value)
        }}
      >
        <ComboboxTrigger
          render={<Button variant="outline" className="w-full justify-between font-normal"><ComboboxValue /></Button>} />
        <ComboboxContent>
          <ComboboxInput showTrigger={false} placeholder="Search" />
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox></>
  )
}