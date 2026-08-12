import type { Variant, Product } from '@/payload-types'
import type { CollectionAfterDeleteHook } from 'payload'

// import { isExpandedDoc } from '@/utils/is-expanded-doc'

export const deleteVariants: CollectionAfterDeleteHook<Product> = async ({ doc, req }) => {
  const { payload } = req
  req.payload.logger.debug(`Starting to delete variant for product: ${doc.id}`)

  // const variantMap = new Map<string, Variant>();

  const variantMap = doc.variantsList?.docs || []

  // req.payload.logger.debug(`Deleting ${uniqueImages.length} unique media files`)

  const deletionResults = await Promise.allSettled(
    variantMap.map((variant) =>
      payload
        .delete({
          id: (typeof variant == 'number' ? variant : variant.id),
          collection: 'variants',
          req,
        })
        .then(() => {

          payload.logger.debug(`Successfully deleted: variant`)
        })
        .catch((error) => {
          payload.logger.error(`Failed to delete variant:`, error)
        }),
    ),
  )

  req.payload.logger.debug(`Deletion results: ${JSON.stringify(deletionResults)}`)
}
