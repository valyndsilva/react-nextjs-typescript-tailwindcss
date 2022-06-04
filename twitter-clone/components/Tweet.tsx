import React, { useEffect, useState } from "react";
import { Comment, CommentBody, Tweet } from "../typings";
import TimeAgo from "react-timeago";
import {
  ChatAlt2Icon,
  SwitchHorizontalIcon,
  HeartIcon,
  UploadIcon,
} from "@heroicons/react/outline";
import { fetchComments } from "../utils/fetchComments";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Image from "next/image";
interface Props {
  tweet: Tweet;
}
function Tweet({ tweet }: Props) {
  const { data: session } = useSession();

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweet._id);
    setComments(comments);
  };

  useEffect(() => {
    refreshComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const commentToast = toast.loading("Posting Comment...");

    // Make a REST API call to backend - Comment Logic
    const commentInfo: CommentBody = {
      comment: input,
      tweetId: tweet._id,
      username: session?.user?.name || "Unknown User",
      profileImage: session?.user?.image || "/avatar-icon.jpeg",
    };
    const result = await fetch("/api/addComment", {
      body: JSON.stringify(commentInfo), // strigify the JS object to be sent
      method: "POST",
    });
    const data = await result.json();
    console.log(result);
    toast.success("Comment Posted!", {
      id: commentToast,
    });

    setInput("");
    setCommentBoxVisible(false);
    refreshComments();
  };

  // console.log(comments);
  return (
    <div
      key={tweet._id}
      className="flex flex-col space-x-3 border-y p-5 border-gray-100"
    >
      <div className="flex space-x-3">
        {/* <img
          className="w-10 h-10 rounded-full object-cover"
          src={tweet.profileImage || "/avatar-icon.jpeg"}
          alt="profile"
        /> */}
        <div className="w-10 h-10 relative">
          <Image
            className=" rounded-full object-cover"
            src={tweet.profileImage || "/avatar-icon.jpeg"}
            alt=""
            layout="fill" // required
            objectFit="cover" // change to suit your needs
          />
        </div>
        <div>
          <div className="flex items-center space-x-1">
            <p className="mr-1 font-bold">{tweet.username}</p>
            <p className="hidden text-sm text-gray-500 sm:inline">
              @{tweet.username.replace(/\s+/g, "").toLowerCase()} ·
            </p>
            <TimeAgo
              className="text-sm text-gray-500"
              date={tweet._createdAt}
            />
          </div>
          <p className="pt-1">{tweet.text}</p>
          {tweet.image && (
            // <img
            //   src={tweet.image}
            //   alt="image"
            //   className="m-5 ml-0 mb-1 max-h-60 rounded-lg object-cover shadow-sm"
            // />
            <div className="m-5 ml-0 mb-1 max-h-60 h-64 w-96 relative">
              <Image
                className=" rounded-lg object-cover shadow-sm"
                src={tweet.image}
                alt=""
                layout="fill" // required
                objectFit="cover" // change to suit your needs
              />
            </div>
          )}
        </div>
      </div>
      <div className="mt-5 flex justify-between">
        <div
          onClick={() => session && setCommentBoxVisible(!commentBoxVisible)}
          className="flex cursor-pointer items-center space-x-3 text-gray-400"
        >
          <ChatAlt2Icon className="h-5 w-5" />
          <p>{comments.length}</p>
        </div>
        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <SwitchHorizontalIcon className="h-5 w-5" />
        </div>
        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <HeartIcon className="h-5 w-5" />
        </div>
        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <UploadIcon className="h-5 w-5" />
        </div>
      </div>

      {/* Comment Box Logic */}
      {commentBoxVisible && (
        <form onSubmit={handleSubmit} className="mt-3 flex space-x-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="flex-1 rounded-lg bg-gray-100 p-2 outline-none"
            placeholder="Write a comment..."
          />
          <button
            type="submit"
            className="text-twitter disabled:text-gray-200"
            disabled={!input}
            // onClick={handleSubmit}
          >
            Post
          </button>
        </form>
      )}
      {comments?.length > 0 && (
        <div className="my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t border-gray-100 p-5">
          {comments.map((comment) => (
            <div key={comment._id} className="relative flex space-x-2">
              <hr className="absolute left-5 top-10 h-8 border-x border-twitter/30" />

              {/* <img
                src={comment.profileImage}
                alt=""
                className="h-7 w-7 rounded-full object-cover"
              /> */}
              <div className="h-7 w-7 relative rounded-full object-cover">
                <Image
                  className="rounded-full object-cover"
                  src={comment.profileImage}
                  alt=""
                  layout="fill" // required
                  objectFit="cover" // change to suit your needs
                />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <p className="mr-1 font-bold">{comment.username}</p>
                  <p className="hidden text-sm text-gray-500 lg:inline">
                    @{comment.username.replace(/\s+/g, "").toLowerCase()} ·
                  </p>
                </div>
                <TimeAgo
                  className="text-sm text-gray-500"
                  date={comment._createdAt}
                />
              </div>
              <p>{comment.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tweet;
