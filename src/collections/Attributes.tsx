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
      name: 'swatch',
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
          label: 'Nhãn giá trị (Ví dụ: Đỏ, XL)',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          unique: true,
          type: 'text',
          required: true,
        },
        {
          name: 'meta',
          type: 'group',
          fields: [
            {
              name: 'colorHex',
              type: 'text',
            }
          ]
        }
      ],
    },
  ],
};
