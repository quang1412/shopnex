'use client'
import React, { useEffect, useRef } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'

const ClearAttributeValueField: React.FC<{ path: string }> = ({ path }) => {
  // Lấy hàm setValue trực tiếp từ trường hiện tại (allowedValues) qua hook useField
  const { setValue } = useField({ path })

  // Định nghĩa đường dẫn tới trường 'attribute' ở cùng cấp (sibling)
  const attributePath = path.includes('.')
    ? `${path.split('.').slice(0, -1).join('.')}.attribute`
    : 'attribute'

  // Theo dõi giá trị thực tế của trường 'attribute'
  const attributeValue = useFormFields(([fields]) => fields[attributePath]?.value)

  // Sử dụng ref để lưu trữ giá trị trước đó nhằm tránh việc trigger xóa ở lần render đầu tiên (Initial Load)
  const previousAttributeRef = useRef(attributeValue)

  useEffect(() => {
    // Chỉ thực hiện xóa giá trị khi attribute thực sự bị người dùng thay đổi trên UI
    if (previousAttributeRef.current !== attributeValue) {
      setValue(null) // Hoặc truyền [] nếu trường allowedValues có hasMany: true
    }
    // Cập nhật lại ref sau mỗi lần thay đổi
    previousAttributeRef.current = attributeValue
  }, [attributeValue, setValue])

  return null
}


export default ClearAttributeValueField