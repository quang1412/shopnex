import type { CollectionConfig, Block, Validate } from "payload";

import { admins, anyone } from "@/access/roles";

import { HandleField } from "@/fields/handle";
import { groups } from "./groups";

export const Attributes: CollectionConfig = {
  slug: "attributes",
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: admins,
  },
  admin: {
    defaultColumns: ["name", "type"],
    group: groups.products.name,
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Tên thuộc tính",
      required: true,
    },

    HandleField('name'),
    {
      name: 'swatchType',
      type: 'select',
      admin: {
        description: "Kiểu hiển thị Swatch",
        isClearable: false,
      },
      options: [
        { label: 'Chữ (Label)', value: 'label' },
        { label: 'Màu sắc (Color)', value: 'color' },
        { label: 'Hình ảnh (Image)', value: 'image' },
      ],
      required: true,
      defaultValue: 'label',
    },
    {
      name: 'values',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'label',
          label: 'Tên giá trị (Ví dụ: Đỏ, XL)',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          label: 'Mã định danh (Value)',
          unique: true,
          type: 'text',
          // required: true,
        },
        {
          name: 'colorCode',
          label: 'Mã màu (Hex)',
          type: 'text',
          admin: {
            condition: (data, siblingData) => {
              return data?.swatchType === 'color'
            },
          },
        },
        {
          name: 'image',
          label: 'Hình ảnh Swatch',
          type: 'upload',
          relationTo: 'media', // Giả sử bạn có collection media để upload ảnh
          admin: {
            condition: (data, siblingData) => {
              return data?.swatchType === 'image'
            },
          },

        }
      ],
    },
  ],
};
