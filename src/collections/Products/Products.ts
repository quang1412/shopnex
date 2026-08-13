import type { CollectionConfig, Validate } from 'payload'

import { RichTextEditor } from '@/fields/RichTextEditor/RichTextEditor'
import { HandleField } from '@/fields/handle'

import { groups } from '../groups'
import { deleteMedia } from './hooks/delete-media'
import { deleteVariants } from './hooks/delete-variants'
import { SeoField } from '@/fields/seo'
import { admins, anyone } from '@/access/roles'
import { generateVariantsEndPoint } from './endpoints/generateVariants'

const nonValidate: Validate = () => true

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: admins,
  },
  admin: {
    defaultColumns: ['title', 'image', 'variants', 'collections'],
    group: groups.products.name,
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'image',
      type: 'ui',
      admin: {
        components: {
          Cell: '@/collections/Products/fields/ImageCell',
        },
      },
    },
    {
      name: 'pid',
      type: 'text',
      admin: {
        disabled: true,
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'currency',
      type: 'text',
      admin: {
        disabled: true,
      },
    },
    {
      name: 'visible',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
      },
      defaultValue: true,
      label: 'Visibility',
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
      },
      defaultValue: false,
      label: 'Featured Product',
    },
    {
      name: 'inStock',
      type: 'checkbox',
      admin: { position: 'sidebar', },
      defaultValue: true,
      label: 'In Stock',
    },
    {
      name: 'salesChannels',
      type: 'select',
      admin: {
        description: 'Choose where this product should be available to customers.',
        disabled: true,
        position: 'sidebar',
      },
      defaultValue: 'all',
      hasMany: true,
      label: 'Sales Channels',
      options: [
        {
          label: 'All Channels',
          value: 'all',
        },
        {
          label: 'Online Store',
          value: 'onlineStore',
        },
        { label: 'POS', value: 'pos' },
        { label: 'Mobile App', value: 'mobileApp' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      defaultValue: 'manual',
      options: [{ label: 'Manual', value: 'manual' }],
    },
    {
      name: 'collections',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      label: 'Tags',
      relationTo: 'collections',
    },
    // {
    //   name: 'sizeGuide',
    //   type: 'relationship',
    //   admin:{
    //     position:'sidebar',
    //   },
    //   label: 'Size guide',
    //   relationTo:'',
    // },
    HandleField(),
    RichTextEditor({
      name: 'description',
      label: 'Mô tả',
    }),
    // TEST

    {
      name: 'type',
      label: 'Loại sản phẩm',
      type: 'select',
      options: [
        { label: 'Đơn giản', value: 'simple' },
        { label: 'Nhiều biến thể', value: 'variable' }
      ],
      defaultValue: 'simple',
      required: true,
      admin: {
        isClearable: false,
      }
    },

    {
      type: 'tabs',
      admin: {
      },
      tabs: [
        {
          label: 'Chung',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'regualarPrice',
                  label: 'Giá thông thường',
                  type: 'number',
                  defaultValue: 0,
                  min: 0,
                  admin: { width: '50%' }
                },
                {
                  name: 'salePrice',
                  label: 'Giá sale',
                  type: 'number',
                  defaultValue: 0,
                  min: 0,
                  admin: { width: '50%' }
                },
              ]
            },
            {
              type: 'collapsible',
              label: 'Đặt lịch',
              fields: [
                {
                  name: 'dateOnSaleFrom',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'dayAndTime'
                    }
                  },
                },
                {
                  name: 'dateOnSaleTo',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'dayAndTime'
                    }
                  },
                }
              ]
            },
          ]
        },
        {
          label: 'Thuộc tính',
          fields: [
            // Khai báo cấu hình các đặc tính riêng cho sản phẩm này
            {
              name: 'attributes',
              type: 'array',
              label: 'Thuộc tính sản phẩm',
              fields: [
                {
                  name: 'attribute',
                  type: 'relationship',
                  relationTo: 'attributes',
                  required: true,
                  label: 'Thuộc tính',
                  filterOptions: ({ data, req }) => {

                    // Lấy danh sách các ID đã được chọn trong array 'items' hiện tại của document
                    const selectedIds = data?.attributes
                      ?.map((item: any) => item.attribute)
                      .filter(Boolean) || [];

                    // Trả về điều kiện loại bỏ các ID đã chọn
                    return {
                      id: {
                        not_in: selectedIds,
                      },
                    };
                  },
                  // Bỏ qua validate phía server cho filterOptions
                  validate: nonValidate,
                },
                {
                  name: 'allowedValues',
                  type: 'relationship',
                  relationTo: 'attribute-values',
                  hasMany: true,
                  required: true,
                  label: 'Các giá trị',
                  // Tính năng thông minh: Chỉ cho chọn các giá trị thuộc về Loại thuộc tính đã chọn ở ô bên cạnh
                  filterOptions: ({ siblingData }) => {
                    const { attribute } = (siblingData as { attribute: any })
                    if (siblingData && attribute) {
                      return {
                        attribute: { equals: attribute },
                      };
                    }
                    return false;
                  },
                  admin: {
                    components: {
                      // Đưa component bổ trợ vào sau ô nhập liệu để bắt sự kiện thay đổi giá trị
                      afterInput: [
                        {
                          path: '@/collections/Products/fields/ClearAttributeValueField', // Đường dẫn vật lý đến file component của bạn
                        }
                      ]
                    }
                  }
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'variation',
                      label: 'Dùng cho biến thể',
                      type: 'checkbox',
                    },
                    {
                      name: 'visible',
                      label: 'Hiển thị',
                      type: 'checkbox',
                    },
                  ]
                },
              ],
            },
          ]
        },
        {
          label: 'Biến thể',
          fields: [
            {
              name: 'generateVariantsAction',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/collections/Products/fields/GenerateVariantsButton'
                },
              },
            },
            {
              name: 'variantsList',
              type: 'join',
              collection: 'variants',
              on: 'product',
              maxDepth: 1,
              admin: {
                disableListFilter: true,
                disableListColumn: true,
              }
            },
            {
              name: 'variants-test',
              type: 'relationship',
              relationTo: 'variants',
              hasMany: true,
              // required: true,
              label: 'Danh sách biến thể (test)',
              filterOptions: (data) => {
                return {
                  product: {
                    equals: data.id
                  }
                }
              }
            },
          ],
          admin: {
            condition: (data) => Boolean(data.type === 'variable')
          }
        },
        {
          label: 'Tồn kho',
          fields: [
            {
              name: 'sku',
              label: 'SKU',
              type: 'text',
            },
            {
              name: 'stockManage',
              label: 'Quản lý tồn kho',
              type: 'checkbox',
            },
            {
              name: 'stockStatus',
              type: 'select',
              options: [
                { label: 'Còn hàng', value: 'instock' },
                { label: 'Hết hàng', value: 'outofstock' },
                { label: 'Đặt trước', value: 'onbackorder' },
              ],
              defaultValue: 'instock',
              admin: {
                condition: (data) => (!Boolean(data.stockManage))
              }
            },
            {
              type: 'group',
              admin: {
                condition: (data) => (Boolean(data.stockManage))
              },
              fields: [
                {
                  name: 'stockCount',
                  label: 'Tồn kho',
                  type: 'number',
                  min: 0,
                },
                {
                  name: 'lowStockThreshold',
                  label: 'Giới hạn tồn kho',
                  type: 'number',
                  min: 0,
                },
                {
                  name: 'allowBackOrders',
                  label: 'Đặt trước',
                  type: 'checkbox',
                  admin: {
                    description: 'Cho phép đặt trước khi hết hàng',
                    condition: (data) => (Boolean(data.stockManage))
                  }
                },
              ]
            },
            {
              name: 'soldIndividually',
              label: 'Bán riêng lẻ',
              type: 'checkbox',
              admin: {
                description: 'Giới hạn sản phẩm chỉ bán 1 đơn vị mỗi đơn'
              }
            },
          ]
        },
        {
          label: 'SEO',
          fields: [
            SeoField(false),
          ]
        }
      ]
    },

    // TEST

    {
      type: 'collapsible',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'variantOptions',
          type: 'array',
          admin: {
            description: 'Choose the options for this product.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'option',
                  type: 'text',
                  admin: {
                    placeholder: 'Enter an option',
                  },
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  admin: {
                    description: '(press enter to add multiple values)',
                    placeholder: 'Enter a value',
                  },
                  hasMany: true,
                  required: true,
                },
              ],
            },
          ],
          maxRows: 5,
        },
        {
          name: 'buildVariantsButton',
          type: 'ui',
          admin: {
            components: {
              Field: '@/collections/Products/fields/BuildVariantsButton',
            },
          },
        },
      ],
      label: 'Build Variants',
    },

    {
      name: 'variants',
      label: 'Biến thể',
      type: 'array',
      admin: {
        components: {
          RowLabel: '@/collections/Products/fields/VariantRowLabel',
        },
        initCollapsed: true,
      },
      fields: [
        {
          name: 'vid',
          type: 'text',
          admin: {
            disabled: true,
          },
          label: 'Variant ID',
        },
        {
          name: 'sku',
          type: 'text',
          defaultValue: () => {
            return `SN-${crypto.randomUUID().slice(0, 8)}`
          },
          label: 'SKU',
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

        {
          type: 'row',
          fields: [
            {
              name: 'price',
              type: 'number',
              required: true,
              label: 'Giá bán'
            },
            {
              name: 'originalPrice',
              type: 'number',
              label: 'Giá thông thường'
            },
            {
              label: 'Tồn kho',
              name: 'stockCount',
              type: 'number',
              defaultValue: 0,
              min: 0,
            },
          ],
        },

        {
          name: 'options',
          type: 'array',
          admin: {
            initCollapsed: true,
            components: {
              RowLabel: '@/collections/Products/fields/OptionRowLabel',
            },
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'option',
                  type: 'text',
                  label: 'Name',
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
          label: 'Options',
        },
      ],
      maxRows: 100,
      minRows: 1,
      required: true,
    },
    {
      name: 'customFields',
      type: 'array',
      admin: {
        description:
          'Add additional product info such as care instructions, materials, or sizing notes.',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
        },
      ],
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        position: 'sidebar',
      }
    },

  ],
  hooks: {
    afterDelete: [deleteMedia, deleteVariants],
    // beforeChange: [
    //   ({ originalDoc }) => {
    //     const price = originalDoc.price ?? 0
    //     const originalPrice = originalDoc.doc.originalPrice ?? 0
    //     return { ...originalDoc, price, originalPrice }
    //   }
    // ]
  },
  endpoints: [generateVariantsEndPoint]
}
