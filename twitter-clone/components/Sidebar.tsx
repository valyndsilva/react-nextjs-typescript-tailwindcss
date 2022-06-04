import React from "react";
import {
  BellIcon,
  HashtagIcon,
  BookmarkIcon,
  CollectionIcon,
  DotsCircleHorizontalIcon,
  MailIcon,
  UserIcon,
  HomeIcon,
} from "@heroicons/react/outline";
import SidebarRow from "./SidebarRow";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col col-span-2 items-center px-4 md:items-start hover:cursor-pointer">
      <img className="m-3 h-10 w-10" src="/logo-twitter-icon.png" alt="" />
      {/* <Image src="/logo-twitter-icon.png" alt="" width={40} height={40} /> */}
      <SidebarRow Icon={HomeIcon} title="Home" />
      <SidebarRow Icon={HashtagIcon} title="Explore" />
      <SidebarRow Icon={BellIcon} title="Notifications" />
      <SidebarRow Icon={MailIcon} title="Messages" />
      <SidebarRow Icon={BookmarkIcon} title="Bookmarks" />
      <SidebarRow Icon={CollectionIcon} title="Lists" />
      {/* <SidebarRow Icon={UserIcon} title="SignIn" /> */}
      <SidebarRow
        onClick={session ? signOut : signIn}
        Icon={UserIcon}
        title={session ? "Sign Out" : "Sign In"}
      />

      <SidebarRow Icon={DotsCircleHorizontalIcon} title="More" />
      <button className="bg-twitter rounded-full px-5 py-2 font-bold text-white ">
        Tweet
      </button>
    </div>
  );
}

export default Sidebar;
