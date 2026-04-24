// src/sanity/schemaTypes/index.ts

import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { gearCategoryType } from './gearCategoryType'
import { raceCategoryType } from './raceCategoryType'
import { productCategoryType } from './productCategoryType'
import { postType } from './postType'
import { gearPostType } from './gearPostType'
import { productPostType } from './productPostType'
import { raceGuideType } from './raceGuideType'
import { authorType } from './authorType'
import { tableType } from './tableType'
import { customCodeBlockType } from './customCodeBlockType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    gearCategoryType,
    raceCategoryType,
    productCategoryType,
    postType,
    gearPostType,
    productPostType,
    raceGuideType,
    authorType,
    tableType,
    customCodeBlockType,
  ],
}