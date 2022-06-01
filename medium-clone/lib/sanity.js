import { createCurrentUserHook, createClient } from 'next-sanity'
import createImageUrlBuilder from '@sanity/image-url'
import { config } from './config'

if (!config.projectId) {
  throw Error('The Project ID is not set. Check your environment variables.')
}

// Set up client for fetching data in the getProps page functions
export const sanityClient = createClient(config)

// Set up a helper function for generating Image URLs (extracting URL from the image)  with only the asset reference data in your documents. Read more: https://www.sanity.io/docs/image-url
export const urlFor = (source) => createImageUrlBuilder(config).image(source)

// Helper function for using the current logged in user account
export const useCurrentUser = createCurrentUserHook(config)
