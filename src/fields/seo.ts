import {
  MetaTitleField,
  MetaDescriptionField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
import { Field } from "payload";

const seoFields: Field = {
  type: "group",
  name: "meta",
  label: "",
  fields: [
    MetaTitleField({
      hasGenerateFn: false,
    }),
    MetaDescriptionField({
      hasGenerateFn: false,
    }),
    OverviewField({}),
    PreviewField({}),
  ],
};

export const SeoField = (isCollapsible = true): Field => {

  return isCollapsible ? ({
    label: "Search Engine Optimization",
    type: "collapsible",
    admin: {
      initCollapsed: true,
    },
    fields: [
      seoFields,
    ],
  }) : seoFields
};
