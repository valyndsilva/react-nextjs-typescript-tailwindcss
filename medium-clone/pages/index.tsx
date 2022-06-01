import Head from 'next/head'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../lib/sanity'
import { Post } from '../typings'

interface Props {
  posts: [Post] // array of type Post: Post[] or [Post]
}

export default function Home({ posts }: Props) {
  console.log(posts)
  return (
    // <div className="flex min-h-screen flex-col items-center justify-center py-2">
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0 ">
        <div className="px-10 space-y-5">
          <h1 className="text-6xl max-w-xl font-serif">
            <span className="underline decoration-black decoration-4 ">
              Medium
            </span>{' '}
            is a place to write, read and connect.
          </h1>
          <h2>
            Discover stories, thinking, and expertise from writers on any topic.
          </h2>
        </div>

        <img
          className="hidden md:inline-flex h-32 lg:h-full"
          src="/medium-article-thumbnail.png"
        />
      </div>
      {/* Posts */}
    </div>
  )
}

// Implementing SSR
export const getServerSideProps = async () => {
  //This is where the server pre-builds the pages
  // It changes the homepage route to SSR route
  const query = `*[_type == "post"]{
    _id,
   title,
  slug,
  author -> {
  name,
  image
  },
  description,
  mainImage
  }`

  const posts = await sanityClient.fetch(query)
  return {
    props: {
      posts,
    },
  }
}
