import type { Block, CollectionConfig } from "payload";

import { admins, anyone } from "@/access/roles";

import { groups } from "./groups";

export const ManualProvider: Block = {
  slug: "manual",
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      name: "methodType",
      type: "select",
      label: "Manual Payment Type",
      options: [
        { label: "Cash on Delivery", value: "cod" },
        { label: "Bank Transfer", value: "bankTransfer" },
        { label: "In-Store Payment", value: "inStore" },
        { label: "Other", value: "other" },
      ],
      required: true,
    },
    {
      name: "instructions",
      type: "textarea",
      admin: {
        description: "Shown to customers at checkout.",
      },
      label: "Payment Instructions",
      required: true,
    },
    {
      name: "details",
      type: "array",
      admin: {
        condition: (data) => {
          const manualProvider = data?.providers.find(
            (provider: any) =>
              provider.blockType === "manual"
          );
          return manualProvider?.methodType === "bankTransfer";
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
            {
              name: "value",
              type: "text",
              required: true,
            },
          ],
        },
      ],
      label: "Details",
    },
  ],
  imageURL: "/placeholder.svg",
  labels: {
    plural: "Manual Providers",
    singular: "Manual Provider",
  },
};

export const Payments: CollectionConfig = {
  slug: "payments",
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: admins,
  },
  admin: {
    group: groups.settings.name,
    useAsTitle: "name",
  },
  orderable: true, // Enables drag-and-drop reordering
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "enabled",
      type: "checkbox",
      admin: {
        position: "sidebar",
      },
      defaultValue: true,
    },
    {
      name: "providers",
      label: "Provider",
      type: "blocks",
      blocks: [ManualProvider],
      maxRows: 1,
    },
    // {
    //   name: 'discount',
    //   label: 'Giảm giá',
    //   type: 'group',
    //   fields: [{
    //     name: 'type',
    //     label: 'Loại giảm giá',
    //     type: 'select',
    //     options: [
    //       { label: 'Không giảm giá', value: 'none' },
    //       { label: 'Theo phần trăm', value: 'percent' },
    //       { label: 'Theo số tiền', value: 'amount' },
    //     ],
    //     required: true,
    //     defaultValue: 'none',
    //     admin: {
    //       isClearable: false,
    //     },
    //   },
    //   {
    //     type: 'row',
    //     fields: [
    //       {
    //         name: 'value',
    //         label: 'Giá trị',
    //         type: 'number',
    //         min: 0,
    //         hasMany: false,
    //         validate: (value, { siblingData }) => {
    //           const numValue = Number(value || '0')

    //           const data = siblingData as { type?: string }

    //           const type = data.type;

    //           if (type === 'percent') {
    //             if (numValue < 0 || numValue > 100) {
    //               return 'Phần trăm phải từ 0 đến 100';
    //             }
    //           }

    //           if (type === 'amount') {
    //             if (numValue < 1000 || numValue > 1000000) {
    //               return 'Số tiền phải từ 1.000 đến 1.000.000'
    //             }
    //           }

    //           return true
    //         },
    //         admin: {
    //           width: '50%',
    //           placeholder: '0',
    //           description: 'Giá trị giảm giá theo % hoặc số tiền cố định',
    //         },
    //       },
    //       {
    //         name: 'minOrder',
    //         label: 'Giá trị đơn hàng',
    //         type: 'number',
    //         min: 1000,
    //         admin: {
    //           width: '50%',
    //           placeholder: '1000000',
    //           description: 'Giá trị tối thiểu của đơn hàng để được áp dụng giảm giá.'
    //         }
    //       },
    //     ],
    //     admin: {
    //       condition: (_, siblingData) => {
    //         return siblingData.type !== 'none'
    //       },
    //     },
    //   },
    //   ]
    // },
  ],
};
