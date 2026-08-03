import type { CollectionConfig } from "payload";

import { admins } from "@/access/roles";
import { generateGiftCardCode } from "@/utils/generate-gift-card-code";
import { getClientIp } from "@/utils/get-client-ip";
import { RateLimiterMemory } from "rate-limiter-flexible";


import { groups } from "./groups";

const rateLimiter = new RateLimiterMemory({
  duration: 60,
  points: 5,
});

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

          const giftCards = await req.payload.find({
            collection: "gift-cards",
            limit: 1,
            where: {
              code: {
                equals: req.query.code,
              },
            },
          });

          const doc = giftCards.docs?.[0];

          // if (!doc?.code) {
          //   return Response.json({
          //     message: "Mã giảm giá không hợp lệ", statusCode: 400,
          //   })
          // };

          const validUsers = (doc?.customers || []).map(c => (typeof c == 'object' ? c.id : c));

          if (
            !doc?.code
            || (validUsers.length > 0 && !validUsers.includes(req.user?.id || -1))
            || (doc.startDate && new Date(doc.startDate) > new Date())
            || (doc.expiryDate && new Date(doc.expiryDate) < new Date())
          ) {
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
          name: "value",
          type: "number",
          label: "Giá trị (đ)",
          required: true,
          min: 0,
          admin: {
            width: '50%',
          },
        },
        {
          name: "minOrderTotal",
          type: "number",
          label: "Đơn hàng tối thiểu (đ)",
          required: true,
          min: 0,
          admin: {
            width: '50%',
          },
        },
      ]
    },
    {
      type: 'row',
      fields: [
        {
          name: "startDate",
          type: "date",
          admin: {
            width: '50%',
            description: "Thời gian mã giảm giá băt đầu có hiệu lực",
            date: {
              pickerAppearance: 'dayAndTime',
              // Formats how the selected date/time renders in the input box
              // Uses date-fns formatting tokens
              displayFormat: 'dd/MM/yyyy HH:mm',
              // Optional: Forces the time selection intervals (e.g., every 15 minutes)
              timeIntervals: 15,
            },
          },
          label: "Thời gian bắt đầu",
          validate: (value, { siblingData }) => {
            const { expiryDate } = siblingData as { expiryDate: string };
            if (value && expiryDate && new Date(value) > new Date(expiryDate)) {
              return 'Thời gian bắt đầu không được lớn hơn thời gian kết thúc';
            }
            return true;
          },
        },
        {
          name: "expiryDate",
          type: "date",
          admin: {
            width: '50%',
            description: "Thời gian mã giảm giá hết hạn",
            date: {
              pickerAppearance: 'dayAndTime',
              // Formats how the selected date/time renders in the input box
              // Uses date-fns formatting tokens
              displayFormat: 'dd/MM/yyyy HH:mm',
              // Optional: Forces the time selection intervals (e.g., every 15 minutes)
              timeIntervals: 15,
            },
          },
          label: "Thời gian kết thúc",
          validate: (value, { siblingData }) => {
            const { startDate } = siblingData as { startDate: string };

            if (value && startDate && new Date(value) < new Date(startDate)) {
              return 'Thời gian kết thúc không được nhỏ hơn thời gian bắt đầu';
            }

            return true;
          },
        },
      ]
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
      label: "Khách hàng",
    },
    {
      name: 'paymentMethods',
      type: 'relationship',
      relationTo: 'payments',
      hasMany: true,
      admin: {
        position: "sidebar",
        placeholder: 'Tất cả phương thức',
      },
      label: "Phương thức thanh toán",
    },
    {
      name: 'shippingMethods',
      type: 'relationship',
      relationTo: 'shipping',
      hasMany: true,
      admin: {
        position: "sidebar",
        placeholder: 'Tất cả phương thức',
      },
      label: "Phương thức vận chuyển",
    },
  ],
};
