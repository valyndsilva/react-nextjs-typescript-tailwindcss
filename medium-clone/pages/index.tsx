import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import { sanityClient, urlFor } from '../lib/sanity';
import { Post } from '../typings';

interface Props {
  posts: [Post]; // array of type Post: Post[] or [Post]
}

export default function Home({ posts }: Props) {
  console.log(posts);
  return (
    // <div className="flex min-h-screen flex-col items-center justify-center py-2">
    <div className="">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header color="bg-medium" />
      <div className="flex justify-between items-center bg-medium border-y border-black px-20 py-10 lg:py-0 ">
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
          <div className="w-44  cursor pointer items-center text-center  bg-black text-white border-black-600 px-4 py-2 rounded-full ">
            <Link href="/">Start reading</Link>
          </div>
        </div>

        <img
          className="hidden md:inline-flex h-32 lg:h-full"
          src="/medium-article-thumbnail.png"
        />
      </div>
      {/* Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 max-w-7xl mt-10 mx-auto lg:p-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="group cursor-pointer border rounded-lg overflow-hidden">
              {post.mainImage && (
                <img
                  className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                  src={urlFor(post.mainImage).url()!}
                  alt=""
                />
              )}
              <div className="flex justify-between p-5 bg-white">
                <div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-xs">
                    {post.description} by {post.author.name}
                  </p>
                </div>
                <img
                  className="h-12 w-12 rounded-full"
                  src={urlFor(post.author.image).url()!}
                  alt=""
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href=""
          target="_blank"
        >
          Powered by
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer>
    </div>
  );
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
  }`;

  const posts = await sanityClient.fetch(query);
  return {
    props: {
      posts,
    },
  };
};
