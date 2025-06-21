// src/lib/image.ts

import imageUrlBuilder from '@sanity/image-url';
import { sanity } from './sanity';

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanity);

// Then we like to make a simple function like this that gives the
// builder an image and returns the builder for you to specify additional
// parameters:
export function urlFor(source: any) {
  return builder.image(source);
}