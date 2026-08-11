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
        { name: 'stock', type: 'number', required: true, defaultValue: 0, label: 'Tồn kho', admin: { width: '33.3%' } },
      ]
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Sản phẩm chính',

      defaultValue: ({ req }) => {
        // // Lấy query parameters từ đối tượng request của Express / Payload
        // const url = new URL(req.href, 'http://localhost'); // Node environment cần base URL để parse

        // let prodId = url.href.split('/').pop() || '';
        // if (url.searchParams.get('product_id')) {
        //   prodId = url.searchParams.get('product_id') || ''
        // }
        // // const productIdFromUrl = url.searchParams.get('product_id');

        // // Nếu có product_id trên URL, trả về làm giá trị mặc định cho field
        // return prodId || undefined;
      },
      admin: {
        position: 'sidebar',
      }
    },
    { name: 'sku', type: 'text', required: true, unique: true, label: 'Mã SKU', admin: { position: 'sidebar', } },
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
  ],
};
