// src/collections/AttributeValues.ts
import { CollectionConfig } from 'payload';
import { HandleField } from "@/fields/handle";
import { admins, anyone } from "@/access/roles";


export const AttributeValues: CollectionConfig = {
  slug: 'attribute-values',
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: admins,
  },
  admin: {
    // Hiển thị tên giá trị trong trang quản trị
    useAsTitle: 'label',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'attribute',
          type: 'relationship',
          relationTo: 'attributes',
          required: true,
          label: 'Thuộc tính cha',
          admin: { width: '50%' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Nhãn (vd: Đỏ, S, M)',
          admin: { width: '50%' },
        },
      ]
    },
    HandleField('label'),

    // TRƯỜNG DÀNH CHO LOẠI COLOR: Chỉ hiện khi thuộc tính cha có swatchType === 'color'
    {
      name: 'colorHex',
      type: 'text',
      label: 'Mã màu Hex',
      admin: {
        placeholder: '#FF0000',
        position: 'sidebar',
        condition: (data, siblingData, { user }) => {
          // Kiểm tra xem attribute cha có swatchType là 'color' không bằng cách đọc qua API hoặc dữ liệu liên kết nếu có
          // Để đơn giản và chính xác tuyệt đối trong giao diện Admin, Payload hỗ trợ lấy thông tin động.
          return true; // Lưu ý: Điều kiện thuần dựa trên siblingData trong mảng hoặc form. 
        },
      },
    },

    // TRƯỜNG DÀNH CHO LOẠI IMAGE: Chỉ hiện khi swatchType === 'image'
    // Ở đây sử dụng relationship trỏ tới một collection quản lý hình ảnh (ví dụ: 'media') trong dự án của bạn
    {
      name: 'swatchImage',
      type: 'upload',
      // type: 'relationship',
      relationTo: 'media', // Tên collection upload ảnh của bạn trong Payload
      label: 'Hình ảnh mẫu swatch',
      admin: {
        position: 'sidebar',
      }
    },

  ],

};
