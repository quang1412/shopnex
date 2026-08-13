import { sdk } from './payload'
import { CACHE_TIMES } from './cache-config'
import type {
  Product as PayloadProduct,
  Collection as PayloadCollection,
  Variant as PayloadVariant,
  VariantsSelect
} from '@/payload-types'
import { type Media } from '@/payload-types'

interface VariantOption {
  option: string
  value: string
}

interface Variant {
  id: string
  sku: string
  gallery: string[]
  price: number
  originalPrice: number
  stockCount: number
  stockManage: boolean
  options?: VariantOption[]
}

export interface Product {
  id: string
  slug: string
  type: PayloadProduct['type'],
  name: string
  description: string
  price: number
  originalPrice: number
  image: string
  images: string[]
  category: string
  inStock: boolean
  stockCount: number
  stockManage: boolean
  featured?: boolean
  variants: Variant[]
  options?: PayloadProduct['variantOptions']
  customFields: { name: string, value: string }[]
  // variant?: string
}

// Transform Payload product to shop product format
function transformProduct(payloadProduct: PayloadProduct): Product {
  const firstVariant = payloadProduct.variants[0]
  const images =
    firstVariant?.gallery
      ?.map((media) => {
        if (typeof media === 'object' && media.url) {
          return media.url
        }
        return ''
      })
      .filter(Boolean) || []

  return {
    id: payloadProduct.id.toString(),
    slug: payloadProduct.handle || payloadProduct.id.toString(),
    name: payloadProduct.title,
    type: payloadProduct.type,
    description: payloadProduct.description || '',
    price: firstVariant?.price || 0,
    originalPrice: firstVariant?.originalPrice || 0,
    image: images[0] || '',
    images: images,
    category: payloadProduct.collections?.[0]
      ? typeof payloadProduct.collections[0] === 'object'
        ? payloadProduct.collections[0].title
        : 'Uncategorized'
      : 'Uncategorized',
    inStock: (firstVariant?.stockCount || 0) > 0,
    stockCount: 1,
    stockManage: Boolean(payloadProduct.stockManage),
    featured: payloadProduct.featured || false,
    variants: payloadProduct.variants.map(v => ({
      id: v.id!,
      sku: v.sku || '',
      gallery: v.gallery?.map((g) => (typeof g === 'object' ? (g.url || "") : "")) || [],
      price: v.price || 0,
      originalPrice: v.originalPrice || 0,
      options: v.options || [],
      stockCount: v.stockCount || 0,
      stockManage: false,
    })),
    options: payloadProduct.variantOptions,
    customFields: payloadProduct.customFields?.map(({ name, value }) => ({ name, value: (value || '') })) || [],
  }
}

const transformVariant = (v: PayloadVariant): Variant => {
  return ({
    id: v.id.toString(),
    sku: v.sku || '',
    gallery: v.gallery?.map((g) => (typeof g === 'object' ? (g.url || "") : "")) || [],
    price: v.price || 0,
    originalPrice: v.originalPrice || 0,
    options: v.attributeOptions?.map(op => ({
      option: typeof op.attribute == 'object' ? op.attribute.name : "",
      value: typeof op.value == 'object' ? op.value.label : "",
    })) || [],
    stockCount: v.stockCount || 0,
    stockManage: Boolean(v.stockManage),
  })
}

// Transform Payload product to shop product format
// transformProduct_v2
async function transformProduct_v2(payloadProduct: PayloadProduct): Promise<Product> {

  console.log({ payloadProduct });

  const isVariable = payloadProduct.type == 'variable'
  const variantDocs = payloadProduct['variants-test'];

  let gallery: string[] = payloadProduct.gallery?.map(media => {
    if (typeof media == 'object' && media.url) return media.url;
    return false;
  }).filter(m => (typeof m == 'string')) || ['/images/placeholder.svg'];

  let options: any[] = []
  let variants: Variant[] = [];

  if (isVariable) {

    variants = variantDocs?.map(v => {
      if (typeof v == 'object') return transformVariant(v);
      return false;
    }).filter(v => !!v) || [];

    options = payloadProduct.attributes?.map(op => ({
      option: (typeof op.attribute == 'object' ? op.attribute.name : ""),
      value: op.allowedValues.map(val => (typeof val == 'object' ? val.label : "")),
    })) || [];

    // const cheapestVariant = variants.filter(v => v.price > 0).sort((a, b) => a.price - b.price)[0]

    // mainPrice = cheapestVariant.price
    // mainOriginalPrice = cheapestVariant.originalPrice
    // mainStockCount = variants.reduce((total, v) => {
    //   return (total + v.stockCount)
    // }, 0);

  };

  return {
    id: payloadProduct.id.toString(),
    slug: payloadProduct.handle || payloadProduct.id.toString(),
    name: payloadProduct.title,
    type: payloadProduct.type,
    description: payloadProduct.description || '',
    price: payloadProduct.price || 0,
    originalPrice: payloadProduct.originalPrice || 0,
    image: gallery[0] || '/images/placeholder.svg',
    images: gallery.length > 0 ? gallery : ['/images/placeholder.svg'],
    category: payloadProduct.collections?.[0]
      ? typeof payloadProduct.collections[0] === 'object'
        ? payloadProduct.collections[0].title
        : 'Uncategorized'
      : 'Uncategorized',
    inStock: payloadProduct.inStock || false,
    stockCount: payloadProduct.stockCount || 0,
    stockManage: payloadProduct.stockManage || false,
    featured: payloadProduct.featured || false,

    variants,
    options,
    // options: payloadProduct.variantOptions,
    customFields: payloadProduct.customFields?.map(({ name, value }) => ({ name, value: (value || '') })) || [],
  }
}


export async function getProducts(): Promise<Product[]> {
  try {
    const response = await sdk.find(
      {
        collection: 'products',
        where: {
          visible: { equals: true },
        },
        populate: {
          collections: {
            title: true,
          },
        },
        limit: 100,
      },
      {
        next: {
          revalidate: CACHE_TIMES.products,
        },
      },
    )

    return response.docs.map(transformProduct)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

export async function getProduct(id: string): Promise<Product | undefined> {
  try {
    const product = await sdk.findByID(
      {
        collection: 'products',
        id: parseInt(id),
        populate: {
          collections: {
            title: true,
          },
        },
      },
      {
        next: {
          revalidate: CACHE_TIMES.products,
        },
      },
    )

    return transformProduct(product)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return undefined
  }
}

const getProductVariants = async (productId: string | number): Promise<Variant[] | undefined> => {
  try {
    const { docs: variants } = await sdk.find(
      {
        collection: 'variants',
        where: {
          product: {
            equals: productId
          }
        },
        populate: {
          collections: {
            title: true,
          },
        },
      },
      {
        next: {
          revalidate: CACHE_TIMES.products,
        },
      },
    )

    return variants?.map(transformVariant) || []
  } catch (error) {
    console.error('Failed to fetch variants:', error)
    return undefined
  }
}

export async function getProducts_v2(): Promise<Product[]> {
  try {
    const response = await sdk.find(
      {
        collection: 'products',
        where: {
          visible: { equals: true },
        },
        populate: {
          collections: {
            title: true,
          },
        },
        limit: 100,
      },
      {
        next: {
          revalidate: CACHE_TIMES.products,
        },
      },
    )

    const products = await Promise.all(response.docs.map(transformProduct_v2))

    return products
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

export async function getProduct_v2(id: string): Promise<Product | undefined> {
  try {
    const product = await sdk.findByID(
      {
        collection: 'products',
        id: parseInt(id),
        populate: {
          collections: {
            title: true,
          },
        },
      },
      {
        next: {
          revalidate: CACHE_TIMES.products,
        },
      },
    );

    return await transformProduct_v2(product);
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return undefined
  }
}


const getVariant = async (id: string): Promise<PayloadVariant | undefined> => {
  try {
    const variant = await sdk.findByID(
      {
        collection: 'variants',
        id: id,
      },
      {
        next: {
          revalidate: CACHE_TIMES.variants,
        },
      },
    )

    return variant
  } catch (error) {
    console.error('Failed to fetch variants:', error)
    return undefined
  }
}


export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const product = await sdk.find(
      {
        collection: 'products',
        where: {
          handle: {
            equals: slug
          }
        },
        populate: {
          collections: {
            title: true,
          },
        },
        // depth: 3,
        limit: 1,
      },
      {
        next: {
          revalidate: CACHE_TIMES.products,
        },
      },
    )

    return transformProduct(product.docs[0])
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return undefined
  }
}


export async function getProductBySlug_v2(slug: string): Promise<Product | undefined> {
  try {
    const { docs: [product] } = await sdk.find(
      {
        collection: 'products',
        where: {
          handle: {
            equals: slug
          }
        },
        populate: {
          collections: {
            title: true,
          },
        },
        limit: 1,
      },
      {
        next: {
          revalidate: CACHE_TIMES.products,
        },
      },
    )

    return await transformProduct_v2(product)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return undefined
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await sdk.find(
      {
        collection: 'products',
        where: {
          visible: { equals: true },
          featured: { equals: true },
        },
        populate: {
          collections: {
            title: true,
          },
        },
        limit: 8,
      },
      {
        next: {
          revalidate: CACHE_TIMES.products,
        },
      },
    )

    return response.docs.map(transformProduct)
  } catch (error) {
    console.error('Failed to fetch featured products:', error)
    return []
  }
}

export async function getMappedCategories(): Promise<{ title: string; productCount: number }[]> {
  try {
    const response = await sdk.find(
      {
        collection: 'collections',
        limit: 100,
        depth: 5,
      },
      {
        next: {
          revalidate: CACHE_TIMES.collections,
        },
      },
    )

    return response.docs.map((collection) => ({
      title: collection.title,
      productCount: collection.products?.docs?.length || 0,
    }))
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}
export async function getCategories(): Promise<string[]> {
  try {
    const response = await sdk.find(
      {
        collection: 'collections',
        limit: 100,
        depth: 5,
      },
      {
        next: {
          revalidate: CACHE_TIMES.collections,
        },
      },
    )

    return response.docs.map((collection) => collection.title)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export async function getCollections(): Promise<PayloadCollection[]> {
  try {
    const response = await sdk.find(
      {
        collection: 'collections',
        limit: 100,
      },
      {
        next: {
          revalidate: CACHE_TIMES.collections,
        },
      },
    )

    return response.docs
  } catch (error) {
    console.error('Failed to fetch collections:', error)
    return []
  }
}
