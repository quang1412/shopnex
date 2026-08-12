import { type Endpoint } from "payload"
import { type Product } from "@/payload-types"

export const generateVariantsEndPoint: Endpoint = {
  path: '/:id/generate-variants',
  method: 'post',
  handler: async (req) => {
    try {

      const productId = req.routeParams?.id as number
      if (!productId) {
        return Response.json({ error: 'Không tìm thấy ID sản phẩm' }, { status: 400 })
      }

      // 1. Lấy thông tin sản phẩm cùng các đặc tính chi tiết
      const product: Product = await req.payload.findByID({
        collection: 'products',
        id: productId,
        depth: 2, // Lấy chi tiết thông tin object bên trong array
      })

      if (!product) {
        return Response.json({ error: 'Sản phẩm không tồn tại' }, { status: 404 })
      }

      if (product.type != 'variable') {
        return Response.json({ error: 'Sản phẩm phải có type \"Nhiều biến thể\"' }, { status: 400 })
      }

      // 2. Lọc ra các nhóm thuộc tính có chọn trường variation === true
      const variationAttrs = product.attributes?.filter((attr: any) => attr.variation === true) || []

      if (variationAttrs.length === 0) {
        return Response.json({ error: 'Vui lòng tích chọn ít nhất một đặc tính có tính năng "Variation" trước khi tạo nhanh.' }, { status: 400 })
      }

      // 3. Chuẩn bị mảng các danh sách giá trị để chạy thuật toán tổ hợp tích Descartes
      // Mỗi phần tử là mảng chứa các giá trị cụ thể, ví dụ: [ [Đỏ, Đen], [S, M, L] ]
      const attributeGroups = variationAttrs.map((attrConfig: any) => {
        return attrConfig.allowedValues.map((val: any) => ({
          attributeId: typeof attrConfig.attribute === 'object' ? attrConfig.attribute.id : attrConfig.attribute,
          valueId: val.id,
          valueCode: val.handle, // Dùng tạo mã SKU, ví dụ: 'red'
        }))
      })

      // Thuật toán đệ quy tích toán học Descartes để tìm tất cả các cặp tổ hợp biến thể
      const cartesianProduct = (arrays: any[][]): any[][] => {
        return arrays.reduce((acc, curr) => {
          return acc.flatMap((d) => curr.map((e) => [...d, e]))
        }, [[]])
      }

      const allCombinations = cartesianProduct(attributeGroups)
      const createdVariantIds: number[] = [...(product['variants-test']?.map((v: any) => typeof v === 'object' ? v.id : v) || [])]

      // 4. Duyệt qua từng tổ hợp để tiến hành tạo bản ghi Variant mới
      for (const combination of allCombinations) {
        // Định dạng trường attributeOptions cho Variant
        const attributeOptions = combination.map((item) => ({
          attribute: item.attributeId,
          value: item.valueId,
        }))

        // Kiểm tra xem tổ hợp biến thể này đã tồn tại trong database chưa nhằm tránh trùng lặp trùng lặp dữ liệu
        const checkQuery: any = {
          and: [
            { product: { equals: product.id } },
            ...attributeOptions.map((opt) => ({
              and: [
                { 'attributeOptions.attribute': { equals: opt.attribute } },
                { 'attributeOptions.value': { equals: opt.value } }
              ]
            }))
          ]
        }

        const existingVariants = await req.payload.find({
          collection: 'variants',
          where: checkQuery,
          limit: 1,
        })

        // Nếu biến thể của tổ hợp này chưa có thì tiến hành tạo mới
        if (existingVariants.totalDocs === 0) {
          console.log({ combination });

          const skuSuffix = combination.map((c) => c.valueCode.toUpperCase()).join('-')
          const generatedSku = `SKU-${product.handle}-${skuSuffix}`

          const newVariant = await req.payload.create({
            collection: 'variants',
            data: {
              sku: generatedSku,
              price: 0, // Giá mặc định bằng 0, Admin chỉnh sửa sau trên bảng
              stockCount: 0,
              product: product,
              attributeOptions: attributeOptions,
            },
          })

          createdVariantIds.push(newVariant.id)
        }
      }

      // 5. Cập nhật ngược lại danh sách liên kết quan hệ trong Products Collection
      // await req.payload.update({
      //   collection: 'products',
      //   id: product.id,
      //   data: {
      //     "variants-test": createdVariantIds
      //     // variants: createdVariantIds,
      //   },
      // })

      return Response.json({ success: true, message: `Đã xử lý xong. Đang đồng bộ hóa biến thể sản phẩm.` })
    } catch (error: any) {
      return Response.json({ error: error?.message || 'Có lỗi hệ thống xảy ra.' }, { status: 500 })
    }
  },
}