import type { Block, CollectionConfig, NumberFieldSingleValidation } from "payload";

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
    {
      name: 'discount',
      label: 'Giảm giá ()',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'Không giảm giá', value: 'none' },
                { label: 'Phần trăm', value: 'percent' },
                { label: 'Giá trị', value: 'amount' },
              ],
              defaultValue: 'none',
            },
            {
              name: 'value',
              type: 'number',
              hasMany: false,
              validate: (value, { siblingData }) => {
                const numValue = Number(value || '0')
                // Cast siblingData to a custom shape
                const data = siblingData as { type?: string }

                const type = data.type;

                if (type === 'percent') {
                  if (numValue < 0 || numValue > 100) {
                    return 'Percentage must be between 0 and 100'
                  }
                }

                if (type === 'amount') {
                  if (numValue < 1 || numValue > 10000) {
                    return 'Amount must be between 1 and 10,000'
                  }
                }

                return true
              },
              admin: {
                width: '50%',
                condition: (data, siblingData) => {
                  // Return true to SHOW, false to HIDE
                  return siblingData.type !== 'none'
                },
              },
            },
          ]
        },
      ]
    },
  ],
};
