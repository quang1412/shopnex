import { admins, anyone } from '@/access/roles'
import { CollectionConfig } from 'payload'
import { groups } from '../groups'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: groups.design.name,
    useAsTitle: 'title',
    defaultColumns: ['title', 'handle', 'createdAt', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'New Page',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'handle',
          type: 'text',
          required: true,
          defaultValue: 'new-page',
        },
      ],
    },

    {
      name: 'page',
      type: 'json',
      required: true,
      admin: {
        components: {
          Field: '@/collections/Pages/components/PuckEditor',
        },
      },
    },
  ],
}
