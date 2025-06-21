// src/sanity/schemaTypes/index.ts

import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { gearCategoryType } from './gearCategoryType'
import { raceCategoryType } from './raceCategoryType'
import { postType } from './postType'
import { gearPostType } from './gearPostType'
import { raceGuideType } from './raceGuideType'
import { authorType } from './authorType'
import { tableType } from './tableType'
import { customCodeBlockType } from './customCodeBlockType' // Add this import

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    gearCategoryType,
    raceCategoryType,
    postType,
    gearPostType,
    raceGuideType,
    authorType,
    tableType,
    customCodeBlockType, // Add this to the array
  ],
}