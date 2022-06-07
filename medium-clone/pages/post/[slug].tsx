import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../lib/sanity';
import { Post } from '../../typings';
import PortableText from 'react-portable-text';
import { useForm, SubmitHandler } from 'react-hook-form';
import TimeAgo from 'react-timeago';
import { useReadingTime } from 'react-reading-time-estimator';
import {
  Twitter,
  FacebookRounded,
  LinkedIn,
  BookmarkAddOutlined,
  ModeCommentOutlined,
} from '@mui/icons-material';
import Link from 'next/link';
interface Props {
  post: Post;
}

// Define form fields in TS:
interface FormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

function Post({ post }: Props) {
  const {
    text, // 1 min read
    minutes, // 1
  } = useReadingTime(post.description);

  const [submitted, setSubmitted] = useState(false);
  console.log(post);
  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    // console.log(data);
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };

  // console.log(post);
  return (
    <main>
      <Header />
      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />
      <article className="max-w-3xl mx-auto p-5">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-5">
            <img
              className="h-14 w-14 rounded-full"
              src={urlFor(post.author.image).url()!}
              alt="author avatar image"
            />
            <div>
              <span className="font-light text-md">{post.author.name}</span>
              <p className="font-extralight text-sm">
                <TimeAgo
                  className="text-sm text-gray-500"
                  date={post._createdAt}
                />
                &nbsp; · &nbsp;{Math.ceil(minutes)} min read
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center pt-10 pb-5 space-x-8">
            <div className="flex items-center space-x-2">
              <div className="cursor-pointer text-gray-400 hover:text-gray-800">
                <Twitter sx={{ fontSize: 24 }} />
              </div>
              <div className="cursor-pointer text-gray-400 hover:text-gray-800">
                <FacebookRounded sx={{ fontSize: 24 }} />
              </div>
              <div className="cursor-pointer text-gray-400 hover:text-gray-800">
                <LinkedIn sx={{ fontSize: 24 }} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="cursor-pointer text-gray-400 hover:text-gray-800">
                <BookmarkAddOutlined sx={{ fontSize: 24 }} />
              </div>
              <div className="-rotate-90 text-gray-400 cursor-pointer">
                <ModeCommentOutlined sx={{ fontSize: 24 }} />
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>

        <div>
          {/* <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
          /> */}
          <PortableText
            className="mt-10"
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="text-xl font-bold my-5" {...props} />
              ),
              li: (children: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>

        <div className="flex justify-between items-center pt-10 pb-5 space-x-8">
          <div className="flex items-center space-x-2">
            <div className="cursor-pointer text-gray-400 hover:text-gray-800">
              <Twitter sx={{ fontSize: 24 }} />
            </div>
            <div className="cursor-pointer text-gray-400 hover:text-gray-800">
              <FacebookRounded sx={{ fontSize: 24 }} />
            </div>
            <div className="cursor-pointer text-gray-400 hover:text-gray-800">
              <LinkedIn sx={{ fontSize: 24 }} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="cursor-pointer text-gray-400 hover:text-gray-800">
              <BookmarkAddOutlined sx={{ fontSize: 24 }} />
            </div>
            <div className="-rotate-90 text-gray-400 cursor-pointer hover:text-gray-800">
              <Link href="#comment">
                <ModeCommentOutlined sx={{ fontSize: 24 }} />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center pb-10 pt-10 border-t border-gray-300">
          <img
            className="w-28 h-28 rounded-full"
            src={urlFor(post.author.image).url()}
            alt="author avatar"
          />
          <div className="pl-5">
            <h4 className="text-3xl font-bold">{post.author.name}</h4>

            <p className="font-extralight text-md">
              Published&nbsp;
              <TimeAgo
                className="text-sm text-gray-500"
                date={post._createdAt}
              />
            </p>
          </div>
        </div>
      </article>
      <hr className="max-w-3xl my-5 mx-auto border border-yellow-500" />
      {submitted ? (
        <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold">
            Thank you for submitting your comment!
          </h3>
          <p>Once it has been approved, it will apear below.</p>
        </div>
      ) : (
        <form
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="py-3 mt-2" />
          {/* Connects to react-hook-form by adding {...register('',{required:true})}*/}
          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />
          <label className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input
              {...register('name', { required: true })}
              className=" shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              placeholder="Enter name"
              type="text"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              className=" shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              placeholder="Enter email address"
              type="email"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className=" shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              placeholder="Please leave a comment..."
              rows={8}
            />
          </label>
          {/* errors will return when field validation fails. */}
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">-The Name Field is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">-The Email Field is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                -The Comment Field is required
              </span>
            )}
          </div>
          <input
            type="submit"
            className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold px-4 py-2 rounded cursor-pointer"
          />
        </form>
      )}
      {/* Comments */}
      <div className="flex flex-col p-10 my-10 max-w-3xl mx-auto shadow shadow-yellow-500 ">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment) => (
          <div key={comment._id} className="">
            <p>
              <span className="text-yellow-500">{comment.name}:</span>&nbsp;
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Post;

export const getStaticPaths = async () => {
  // Lets nextJS know which routes it should pre-build /pre-fetch in advance
  const query = `*[_type == "post"]{
    _id,
  slug{
      current
  }
  }`;
  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: Post) => ({
    params: { slug: post.slug.current },
  }));
  return {
    paths,
    fallback: 'blocking', //blocks page from showing or shows 404 if page doesn't exist. fallback returns true, false or blocking.
  };
};

// When NextJS tries to pre-build/ pre-fetch the page we need to tell how to use the post slug or id to fetch the info.
// Go to each page and getStaticProps:
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author -> {
        name,
        image
      },
      'comments': *[
        _type=="comment" &&
        post._ref == ^._id &&
        approved == true
      ],
      description,
      mainImage,
      slug,
      body
      }`;

  // In the Params:
  //   {
  //    "slug": "test-post-1"
  //   }

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });
  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post,
    },
    revalidate: 60, // this enables ISR and updates the old cache version after 60 seconds
    // It basically server side renders the page after 60 seconds and caches it and that one gets served for the next 60 secs in a static way
  };
};
