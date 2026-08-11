'use client'
import React, { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export const GenerateVariantsButton = () => {
  const { id: productId } = useDocumentInfo()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', isError: false })

  const handleGenerate = async () => {
    if (!productId) {
      setMessage({ text: 'Vui lòng bấm nút Lưu sản phẩm (Save) trước khi thực hiện chức năng tạo biến thể.', isError: true })
      return
    }

    setLoading(true)
    setMessage({ text: '', isError: false })

    try {
      const response = await fetch(`/api/products/${productId}/generate-variants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Yêu cầu xử lý thất bại.')
      }

      setMessage({ text: result.message, isError: false })
      // Tải lại trang sau khi tạo thành công để cập nhật bảng danh sách hiển thị
      setTimeout(() => {
        window.location.reload()
      }, 1500)

    } catch (err: any) {
      setMessage({ text: err.message, isError: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ margin: '1.5rem 0', padding: '1rem', border: '1px dashed var(--theme-elevation-200)', borderRadius: '4px' }}>
      <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--theme-elevation-600)' }}>
        Hệ thống tự động phân tích ma trận tổ hợp dựa trên các đặc tính có đánh dấu <strong>Variation</strong> để tạo nhanh các biến thể tương ứng chưa có trong danh sách.
      </p>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? 'var(--theme-elevation-300)' : 'var(--theme-success-500)',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
        }}
      >
        {loading ? 'Đang tạo tổ hợp dữ liệu...' : '⚡ Tạo Nhanh Biến Thể Sản Phẩm'}
      </button>

      {message.text && (
        <div style={{
          marginTop: '1rem',
          padding: '10px',
          borderRadius: '4px',
          backgroundColor: message.isError ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)',
          color: message.isError ? 'var(--theme-error-500)' : 'var(--theme-success-500)',
          fontSize: '0.9rem'
        }}>
          {message.text}
        </div>
      )}
    </div>
  )
}
export default React.memo(GenerateVariantsButton)
