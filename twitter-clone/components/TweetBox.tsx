import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import {
  CalendarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchCircleIcon,
  ChartBarIcon,
} from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import { Tweet, TweetBody } from '../typings';
import toast from 'react-hot-toast';
import { fetchTweets } from '../utils/fetchTweets';

interface Props {
  setTweets: Dispatch<SetStateAction<Tweet[]>>;
}
function TweetBox({ setTweets }: Props) {
  const { data: session } = useSession();
  // console.log(session);
  // console.log(session?.user?.image);

  // Keep track if  the user entered something in the tweetbox:
  const [input, setInput] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const addImageToTweet = (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    // if no image assigned  don't attach an image
    if (!imageInputRef.current?.value) return;
    if (imageInputRef.current) {
      setImage(imageInputRef.current.value);
      imageInputRef.current.value = ''; //clear the input
      setImageUrlBoxIsOpen(false);
    }
  };

  const postTweet = async () => {
    const tweetInfo: TweetBody = {
      text: input,
      username: session?.user?.name || 'Unkown user',
      profileImage: session?.user?.image || '/avatar-icon.jpeg',
      image: image,
    };
    const result = await fetch('/api/addTweet', {
      body: JSON.stringify(tweetInfo), // strigify the JS object to be sent
      method: 'POST',
    });
    const data = await result.json();
    const newTweets = await fetchTweets();
    setTweets(newTweets);

    toast('Tweet Posted!', {
      icon: '🚀',
    });
    return data;
  };
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    postTweet();
    setInput('');
    setImage('');
    setImageUrlBoxIsOpen(false);
  };

  return (
    <div className="flex space-x-2 p-5">
      <img
        className="mt-4 h-14 w-14 rounded-full object-cover"
        src={session?.user?.image || '/avatar-icon.jpeg'}
        alt=""
      />
      <div className="flex flex-1 items-center pl-2">
        <form className="flex flex-1 flex-col">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="What's Happening?"
            className="h-24 w-full text-xl outline-none placeholder:text-xl"
          />
          <div className="flex items-center">
            <div className="flex flex-1 space-x-2 text-twitter">
              <PhotographIcon
                onClick={() => setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)}
                className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150"
              />
              <SearchCircleIcon className="h-5 w-5" />
              <ChartBarIcon className="h-5 w-5 rotate-90" />
              <EmojiHappyIcon className="h-5 w-5" />
              <CalendarIcon className="h-5 w-5" />
              <LocationMarkerIcon className="h-5 w-5" />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!input || !session}
              className="bg-twitter rounded-full px-5 py-2 font-bold text-white disabled:opacity-40"
            >
              Tweet
            </button>
          </div>
          {imageUrlBoxIsOpen && (
            <form className="mt-5 flex rounded-lg bg-twitter/80 py-2 px-4">
              <input
                ref={imageInputRef}
                className="flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white"
                type="text"
                placeholder="Enter Image URL..."
              />
              <button
                type="submit"
                onClick={addImageToTweet}
                className="font-bold text-white"
              >
                Add Image
              </button>
            </form>
          )}
          {image && (
            <img
              src={image}
              className="mt-10 h-40 w-full rounded-xl object-contain shadow-lg"
              alt=""
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default TweetBox;
