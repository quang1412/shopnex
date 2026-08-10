import { ExportListMenuItem as ExportListMenuItem_2cddc2e1d3f965d7263141af56b26a90 } from '@shopnex/import-export-plugin/rsc'
import { ImportListMenuItem as ImportListMenuItem_2cddc2e1d3f965d7263141af56b26a90 } from '@shopnex/import-export-plugin/rsc'
import { default as default_e6d90b7e8a2b1ec7d65484e86c9a3409 } from '@/fields/RichTextEditor/components/Tiptap'
import { MetaTitleComponent as MetaTitleComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { MetaDescriptionComponent as MetaDescriptionComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { OverviewComponent as OverviewComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { PreviewComponent as PreviewComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { default as default_e49979b57f52dbb3fe02cec65aa4998b } from '@/collections/Products/fields/ImageCell'
import { default as default_f0f7b12584c89e13c6a87d8efa94a229 } from '@/collections/Products/fields/BuildVariantsButton'
import { default as default_3c59176b2ff1d26ac22ac2944241cb35 } from '@/collections/Products/fields/OptionRowLabel'
import { default as default_f22cadbcf95d70613e3cffb6affc278d } from '@/collections/Products/fields/VariantRowLabel'
import { default as default_ee89d726e1ed225dc9764f1161abe0f7 } from '@/collections/Users/fields/GenApiTokenBtn'
import { default as default_587fb76ccf6cf2ca212b3fee0a3e420b } from '@/collections/Pages/components/PuckEditor'
import { SortBy as SortBy_2cddc2e1d3f965d7263141af56b26a90 } from '@shopnex/import-export-plugin/rsc'
import { FieldsToExport as FieldsToExport_2cddc2e1d3f965d7263141af56b26a90 } from '@shopnex/import-export-plugin/rsc'
import { CollectionField as CollectionField_2cddc2e1d3f965d7263141af56b26a90 } from '@shopnex/import-export-plugin/rsc'
import { WhereField as WhereField_2cddc2e1d3f965d7263141af56b26a90 } from '@shopnex/import-export-plugin/rsc'
import { Preview as Preview_2cddc2e1d3f965d7263141af56b26a90 } from '@shopnex/import-export-plugin/rsc'
import { Nav as Nav_843028945cda50810eba35c5314c6296 } from '@shopnex/sidebar-plugin/rsc'
import { QuickActions as QuickActions_c473cfc8237cb5375a757ad784076201 } from '@shopnex/quick-actions-plugin/client'
import { ImportExportProvider as ImportExportProvider_2cddc2e1d3f965d7263141af56b26a90 } from '@shopnex/import-export-plugin/rsc'
import { CommandBar as CommandBar_c473cfc8237cb5375a757ad784076201 } from '@shopnex/quick-actions-plugin/client'
import { S3ClientUploadHandler as S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24 } from '@payloadcms/storage-s3/client'
import { Dashboard as Dashboard_22568d3ea793f8bcf927349509acce35 } from '@shopnex/analytics-plugin/rsc'
import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'

/** @type import('payload').ImportMap */
export const importMap = {
  "@shopnex/import-export-plugin/rsc#ExportListMenuItem": ExportListMenuItem_2cddc2e1d3f965d7263141af56b26a90,
  "@shopnex/import-export-plugin/rsc#ImportListMenuItem": ImportListMenuItem_2cddc2e1d3f965d7263141af56b26a90,
  "@/fields/RichTextEditor/components/Tiptap#default": default_e6d90b7e8a2b1ec7d65484e86c9a3409,
  "@payloadcms/plugin-seo/client#MetaTitleComponent": MetaTitleComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#MetaDescriptionComponent": MetaDescriptionComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#OverviewComponent": OverviewComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#PreviewComponent": PreviewComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@/collections/Products/fields/ImageCell#default": default_e49979b57f52dbb3fe02cec65aa4998b,
  "@/collections/Products/fields/BuildVariantsButton#default": default_f0f7b12584c89e13c6a87d8efa94a229,
  "@/collections/Products/fields/OptionRowLabel#default": default_3c59176b2ff1d26ac22ac2944241cb35,
  "@/collections/Products/fields/VariantRowLabel#default": default_f22cadbcf95d70613e3cffb6affc278d,
  "@/collections/Users/fields/GenApiTokenBtn#default": default_ee89d726e1ed225dc9764f1161abe0f7,
  "@/collections/Pages/components/PuckEditor#default": default_587fb76ccf6cf2ca212b3fee0a3e420b,
  "@shopnex/import-export-plugin/rsc#SortBy": SortBy_2cddc2e1d3f965d7263141af56b26a90,
  "@shopnex/import-export-plugin/rsc#FieldsToExport": FieldsToExport_2cddc2e1d3f965d7263141af56b26a90,
  "@shopnex/import-export-plugin/rsc#CollectionField": CollectionField_2cddc2e1d3f965d7263141af56b26a90,
  "@shopnex/import-export-plugin/rsc#WhereField": WhereField_2cddc2e1d3f965d7263141af56b26a90,
  "@shopnex/import-export-plugin/rsc#Preview": Preview_2cddc2e1d3f965d7263141af56b26a90,
  "@shopnex/sidebar-plugin/rsc#Nav": Nav_843028945cda50810eba35c5314c6296,
  "@shopnex/quick-actions-plugin/client#QuickActions": QuickActions_c473cfc8237cb5375a757ad784076201,
  "@shopnex/import-export-plugin/rsc#ImportExportProvider": ImportExportProvider_2cddc2e1d3f965d7263141af56b26a90,
  "@shopnex/quick-actions-plugin/client#CommandBar": CommandBar_c473cfc8237cb5375a757ad784076201,
  "@payloadcms/storage-s3/client#S3ClientUploadHandler": S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24,
  "@shopnex/analytics-plugin/rsc#Dashboard": Dashboard_22568d3ea793f8bcf927349509acce35,
  "@payloadcms/next/rsc#CollectionCards": CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1
}
