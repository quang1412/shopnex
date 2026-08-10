'use client'

import React, { useEffect, useState } from 'react'
import { SelectInput, useFormFields, useField } from '@payloadcms/ui'

export const SelectedValuesField: React.FC<{ path: string }> = ({ path }) => {
  // 1. Xác định đường dẫn chính xác của dòng hiện tại trong Array Field
  // path sẽ có dạng: "productAttributes.0.selectedValues"
  const baseFieldPath = path.substring(0, path.lastIndexOf('.')) // "productAttributes.0"
  const attributeDocPath = `${baseFieldPath}.name`

  // 2. Lấy dữ liệu và trạng thái của trường selectedValues hiện tại
  const { value, setValue } = useField<string[]>({ path })

  // 3. Lắng nghe giá trị của trường attributeDoc trong cùng một hàng
  const attributeDocField = useFormFields(([fields]) => fields[attributeDocPath])
  const selectedAttributeId = attributeDocField?.value as string

  // State để lưu danh sách options động
  const [options, setOptions] = useState<{ label: string; value: string }[]>([])

  useEffect(() => {
    // Nếu chưa chọn thuộc tính cha, xóa sạch options và xóa giá trị đang chọn
    if (!selectedAttributeId) {
      setOptions([])
      setValue([])
      return
    }

    // 4. Fetch dữ liệu của Attribute được chọn từ Payload API
    const fetchAttributeValues = async () => {
      try {
        const res = await fetch(`/api/attributes/${selectedAttributeId}`)
        if (!res.ok) return

        const data = await res.json()

        // Chuyển đổi mảng values từ collection thành định dạng [{ label, value }] cho ô Select
        if (data?.values && Array.isArray(data.values)) {
          const dynamicOptions = data.values.map((item: any) => ({
            label: item.label,
            value: item.value, // Lưu trực tiếp text value vào DB sản phẩm
          }))
          setOptions(dynamicOptions)
        }
      } catch (error) {
        console.error('Lỗi khi fetch attribute values:', error)
      }
    }

    fetchAttributeValues()
  }, [selectedAttributeId, setValue])

  return (
    <div style={{ marginBottom: '20px' }}>
      <label className="field-label" style={{ marginBottom: '5px', display: 'block' }}>
        Chọn giá trị thuộc tính
      </label>
      <SelectInput
        path={path}
        name={path}
        options={options}
        value={value}
        onChange={(selectedOption) => {
          // Xử lý cập nhật giá trị khi người dùng chọn (hỗ trợ hasMany)
          if (Array.isArray(selectedOption)) {
            setValue(selectedOption.map((o) => o.value))
          } else if (selectedOption) {
            setValue([(selectedOption as any).value])
          } else {
            setValue([])
          }
        }}
        hasMany={true}
      // isMulti={true} // Bật tính năng chọn nhiều giá trị
      />
    </div>
  )
}
