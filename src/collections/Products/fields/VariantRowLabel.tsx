import type { RowLabelProps } from '@payloadcms/ui'
import type { ArrayFieldServerProps } from 'payload'

import Image from 'next/image'

// const VariantRowLabel = (props: { rowLabel: string } & ArrayFieldServerProps & RowLabelProps) => {
//   if (!props.data.variants) {
//     return <p>{props.rowLabel}</p>
//   }
//   const currentRow = props.data.variants.find(
//     (_: any, index: number) => index === (props.rowNumber as number) - 1,
//   )
//   if (!currentRow.options?.length) {
//     return <p>{props.rowLabel}</p>
//   }

//   const variantValues = currentRow.options.map((option: any) => option.value)
//   const imageUrl = currentRow.gallery?.[0]?.url || currentRow.imageUrl
//   return (
//     <div style={{ display: 'flex', gap: '1rem' }}>
//       <Image
//         alt={currentRow.name || 'variant image'}
//         height={0}
//         sizes="100vw" // Optional hint for responsive images
//         src={imageUrl}
//         style={{ height: '25px', width: 'auto' }}
//         width={0} // Required for layout="intrinsic"
//       />
//       <p>{variantValues.join(' / ') + ` - $${currentRow.price} - ${currentRow.id}`}</p>
//     </div>
//   )
// }

const VariantRowLabel = (props: { rowLabel: string } & ArrayFieldServerProps & RowLabelProps) => {
  if (!props.data.variants) {
    return <p>{props.rowLabel}</p>
  }
  const currentRow = props.data.variants.find(
    (_: any, index: number) => index === (props.rowNumber as number) - 1,
  )
  if (!currentRow.options?.length) {
    return <p>{props.rowLabel}</p>
  }

  // console.log('currentRow?.gallery', currentRow?.gallery);
  // console.log('props', props);


  const variantValues = currentRow.options.map((option: any) => option.value)
  const imageUrl = currentRow.gallery?.[0]?.url || currentRow.imageUrl || '/images/placeholder.svg'
  return (
    <div style={{ width: '100%', display: 'flex', gap: '1rem', justifyContent: 'space-between', justifyItems: 'center' }}>
      <div className='flex gap-2'>
        <Image
          alt={currentRow.name || 'variant image'}
          height={0}
          sizes="100vw" // Optional hint for responsive images
          src={(imageUrl)}
          style={{ height: '25px', width: 'auto' }}
          width={0} // Required for layout="intrinsic"
          className='rounded'
        />
        <p>{props.rowLabel}: {variantValues.join(' / ')}</p>
      </div>

      <p>${currentRow.price}</p>
    </div>
  )
}

export default VariantRowLabel
