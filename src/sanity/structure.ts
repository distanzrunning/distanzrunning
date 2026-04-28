// src/sanity/structure.ts

import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // --- Site Settings (singletons) ---
      S.listItem()
        .title('Homepage')
        .id('homepageSettings')
        .child(
          S.editor()
            .id('homepageSettings')
            .schemaType('homepageSettings')
            .documentId('homepageSettings'),
        ),

      S.divider(),

      // --- Articles Section ---
      S.listItem()
        .title('Articles')
        .child(
          S.documentTypeList('post')
            .title('Articles')
        ),
      
      // --- Gear Section ---
      S.listItem()
        .title('Gear Posts')
        .child(
          S.documentTypeList('gearPost')
            .title('Gear Posts')
        ),

      // --- Race Guides Section ---
      S.listItem()
        .title('Race Guides')
        .child(
          S.documentTypeList('raceGuide')
            .title('Race Guides')
        ),

      // Divider
      S.divider(),

      // --- Taxonomies / Supporting Documents ---
      S.listItem()
        .title('Blog Categories')
        .child(S.documentTypeList('category').title('Blog Categories')),
      S.listItem()
        .title('Gear Categories')
        .child(S.documentTypeList('gearCategory').title('Gear Categories')),
      S.listItem()
        .title('Race Categories')
        .child(S.documentTypeList('raceCategory').title('Race Categories')),

      // Divider
      S.divider(),

      // --- Authors ---
      S.listItem()
        .title('Authors')
        .child(S.documentTypeList('author').title('Authors')),

      // Catch all fallback for anything you forget
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          ![
            'post',
            'gearPost',
            'raceGuide',
            'category',
            'gearCategory',
            'raceCategory',
            'author',
            // Singleton — surfaced explicitly above, hide from the
            // catch-all so it doesn't appear twice.
            'homepageSettings',
          ].includes(item.getId() || '')
      ),
    ])