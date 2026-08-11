// src/collections/Variants.ts
import { CollectionConfig } from 'payload';

export const Variants: CollectionConfig = {
  slug: 'variants',
  admin: {
    useAsTitle: 'sku',
  },
  lockDocuments: {
    duration: 60
  },
  fields: [
    {
      type: 'row', fields: [
        { name: 'price', type: 'number', required: true, label: 'Giá tiền', admin: { width: '33.3%' } },
        { name: 'priceOriginal', type: 'number', label: 'Giá tiền tham khảo', admin: { width: '33.3%' } },
        { name: 'stockCount', type: 'number', required: true, defaultValue: 0, label: 'Tồn kho', admin: { width: '33.3%' } },
      ]
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Sản phẩm chính',
      admin: {
        position: 'sidebar',
        // Sort options by newest first
        sortOptions: '-createdAt',
        allowEdit: false,
      },
      defaultValue: async ({ user, req }) => {
        try {
          // Fetch the single newest document from the target collection
          const result = await req.payload.find({
            collection: 'products',
            sort: '-createdAt', // Sort by newest first
            limit: 1, // Only grab the top item
            depth: 0, // Performance optimization: only fetch IDs
          })

          // If a document exists, return its ID to set as the default
          if (result.docs && result.docs.length > 0) {
            return result.docs[0].id
          }
        } catch (error) {
          console.error("Failed to fetch default relationship:", error)
        }

        return undefined
      },

    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      label: 'Mã SKU',
      defaultValue: () => {
        return `SN-${crypto.randomUUID().slice(0, 8)}`
      },
      admin: { position: 'sidebar', },
    },
    {
      name: 'attributeOptions',
      type: 'array',
      label: 'Thuộc tính của biến thể',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'attribute',
              type: 'relationship',
              relationTo: 'attributes',
              required: true,
              label: 'Chọn loại thuộc tính',
              admin: {
                width: '50%'
              },
            },
            {
              name: 'value',
              type: 'relationship',
              relationTo: 'attribute-values',
              required: true,
              label: 'Chọn giá trị',
              // Lọc danh sách: Chỉ lấy các AttributeValues có trường 'attribute' trùng với ID của ô 'attribute' cùng dòng
              filterOptions: ({ siblingData }) => {
                const { attribute } = (siblingData as { attribute: any })
                if (siblingData && attribute) {
                  return {
                    attribute: {
                      equals: attribute,
                    },
                  };
                }
                return false; // Nếu chưa chọn thuộc tính cha thì ẩn/vô hiệu hóa ô chọn giá trị
              },
              admin: {
                width: '50%'
              },
            },
          ]
        },
      ],
    },
    {
      name: 'gallery',
      label: 'Ảnh',
      type: 'upload',
      admin: {
        components: {
          // Field: "@/custom/custom-image-field#UploadField",
        },
        isSortable: false,
      },
      hasMany: true,
      relationTo: 'media',
    },
  ],
};
