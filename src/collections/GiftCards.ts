import type { CollectionConfig, Validate } from "payload";

import { admins } from "@/access/roles";
import { generateGiftCardCode } from "@/utils/generate-gift-card-code";
import { getClientIp } from "@/utils/get-client-ip";
import { RateLimiterMemory } from "rate-limiter-flexible";


import { groups } from "./groups";

const rateLimiter = new RateLimiterMemory({
  duration: 60,
  points: 5,
});

const valueValidation: Validate = (value, { siblingData }) => {
  const type = siblingData.type;
  if (type == 'percent' && value > 100) {
    return ' Giá trị phần trăm không hợp lệ';
  }
  return true;
}

export const GiftCards: CollectionConfig = {
  slug: "gift-cards",
  access: {
    create: admins,
    delete: admins,
    read: admins,
    update: admins,
  },
  admin: {
    defaultColumns: ["code", "value", "expiryDate"],
    group: groups.products.name,
    useAsTitle: "code",
  },
  endpoints: [
    {
      method: "get",
      path: "/verify",
      handler: async (req) => {
        try {
          const ip = getClientIp(req);

          if (!ip) {
            return Response.json({
              message: "Missing IP address.",
              statusCode: 400,
            });
          }

          await rateLimiter.consume(ip, 1);

          const userId = req.user?.id || -1;
          const today = new Date().toISOString();

          const giftCards = await req.payload.find({
            collection: "gift-cards",
            limit: 1,
            where: {
              code: {
                equals: req.query.code,
              },
              or: [
                { customers: { exists: false } },
                { customers: { equals: userId } }
              ],
              expiryDate: {
                greater_than: today
              }
            },
          });

          const doc = giftCards.docs?.[0];

          // const validUsers = (doc?.customers || []).map(c => (typeof c == 'object' ? c.id : c));

          if (!doc?.code) {
            return Response.json({
              message: "Mã giảm giá không hợp lệ", statusCode: 400,
            })
          };

          return Response.json(doc);
        } catch (reject) {
          return Response.json({
            message: "Too many requests. Please try again later.", statusCode: 429,
          });
        }
      },
    },
  ],
  fields: [
    {
      name: "code",
      type: "text",
      defaultValue: () => {
        return generateGiftCardCode();
      },
      label: "Mã giảm giá",
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          label: 'Loại mã giảm giá',
          type: 'select',
          required: true,
          options: [
            { label: 'Phần trăm', value: 'percent', },
            { label: 'Số tiền', value: 'amount', }
          ],
          defaultValue: 'amount',
          admin: {
            width: '50%',
          }
        },
        {
          name: "value",
          label: "Giá trị",
          type: "number",
          required: true,
          min: 0,
          admin: {
            width: '50%',
          },
          validate: valueValidation,
        },
      ]
    },
    {
      name: "expiryDate",
      label: "Ngày hết hạn",
      type: "date",
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          // Formats how the selected date/time renders in the input box
          // Uses date-fns formatting tokens
          displayFormat: 'dd/MM/yyyy HH:mm',
          // Optional: Forces the time selection intervals (e.g., every 15 minutes)
          timeIntervals: 15,
        },
      },
    },
    {
      name: "customers",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
      admin: {
        position: "sidebar",
        placeholder: 'Tất cả khách hàng',
      },
      label: {
        singular: 'Khách hàng',
        plural: 'Danh sách khách hàng',
      },
    },
  ],
};
