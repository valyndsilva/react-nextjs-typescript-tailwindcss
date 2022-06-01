export interface Post {
  // Refer to sanity query result to get the properties of the post
  _id: string
  _createdAt: string
  title: string
  author: {
    name: string
    image: string
  }
  description: string
  mainImage: { asset: { url: string } }
  slug: {
    current: string
  }
  body: [object]
}
