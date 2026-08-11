// src/collections/Attributes.ts
import type { CollectionConfig } from "payload";

import { admins, anyone } from "@/access/roles";

import { HandleField } from "@/fields/handle";

export const Attributes: CollectionConfig = {
  slug: "attributes",
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: admins,
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "handle", "swatchType"],
  },
  fields: [
    HandleField('name'),

    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tên thuộc tính (Ví dụ: Màu sắc, Kích thước)',
    }, {
      name: 'swatchType',
      type: 'select',
      required: true,
      defaultValue: 'label',
      label: 'Loại hiển thị mẫu thử (Swatch Type)',
      admin: {
        isClearable: !1,
      },
      options: [
        { label: 'Chữ / Nhãn thô (Text Label)', value: 'label' },
        { label: 'Mã màu Hex (Color Box)', value: 'color' },
        { label: 'Hình ảnh nhỏ (Image Thumbnail)', value: 'image' },
      ],
    },
  ],
};


