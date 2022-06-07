import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Feed from "../components/Feed";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import { Tweet } from "../typings";
import { fetchTweets } from "../utils/fetchTweets";
import { Toaster } from "react-hot-toast";
// import { GetStaticProps } from "next";
interface Props {
  tweets: Tweet[];
}
const Home = ({ tweets }: Props) => {
  // console.log(tweets);
  return (
    <div className="mx-auto max-h-screen overflow-hidden lg:max-w-6xl">
      <Head>
        <title>Twitter Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster />
      <main className="grid grid-cols-9">
        <Sidebar />
        <Feed tweets={tweets} />
        <Widgets />
      </main>
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
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //This is where the server pre-builds/pre-fetches the pages
  // Here all the information that is needed to pre-fetch is passed as the props to the component
  // It changes the homepage route to SSR route
  const tweets = await fetchTweets();
  return {
    props: {
      tweets,
    },
  };
};

// // (Static Site Generation):When NextJS tries to pre-build/ pre-fetch the page we need to tell how to use the post slug or id to fetch the info.
// // Go to each page and getStaticProps:
// export const getStaticProps: GetStaticProps = async () => {
//   const tweets = await fetchTweets();
//   if (!tweets) {
//     return {
//       notFound: true,
//     };
//   }
//   return {
//     props: {
//       tweets,
//     },
//     revalidate: 60, // this enables ISR and updates the old cache version after 60 seconds
//     // It basically server side renders the page after 60 seconds and caches it and that one gets served for the next 60 secs in a static way
//   };
// };
