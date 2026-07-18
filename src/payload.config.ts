// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { buildConfig } from 'payload'

import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users/Users'
import { Media } from './collections/Media'
import { plugins } from './plugins'
import { Orders } from './collections/Orders/Orders'
import { Collections } from './collections/Collections'
import { Products } from './collections/Products/Products'
import { Policies } from './collections/Policies'
import { GiftCards } from './collections/GiftCards'
import { Payments } from './collections/Payments'
import { Locations } from './collections/Locations'
import { Shipping } from './collections/Shipping'
import { Pages } from './collections/Pages/Pages'
import { Carts } from './collections/Carts/Carts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  routes: {
    admin: '/admin',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Orders,
    Carts,
    Collections,
    Products,
    Users,
    Media,
    Policies,
    GiftCards,
    Pages,
    Payments,
    Locations,
    Shipping,
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
})
