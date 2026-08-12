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
        { name: 'price', type: 'number', required: true, label: 'Giá tiền', admin: { width: '50%' } },
        { name: 'originalPrice', type: 'number', label: 'Giá tham khảo', admin: { width: '50%' } },
      ]
    },
    {
      type: 'group',
      fields: [
        {
          name: 'stockManage',
          type: 'checkbox',
        },
        {
          name: 'stockCount',
          type: 'number',
          required: true,
          defaultValue: 0,
          label: 'Tồn kho',
          admin: { width: '33.3%' }
        },
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
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      label: 'Mã SKU',
      defaultValue: () => {
        return `VA-${crypto.randomUUID().slice(0, 8)}`
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
              label: 'Thuộc tính',
              admin: {
                width: '50%'
              },
            },
            {
              name: 'value',
              type: 'relationship',
              relationTo: 'attribute-values',
              required: true,
              label: 'Giá trị',
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
