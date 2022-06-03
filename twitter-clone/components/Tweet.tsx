import React from 'react';
import { Tweet } from '../typings';

interface Props {
  tweet: Tweet;
}
function Tweet({ tweet }: Props) {
  return (
    <div>
      <img src={tweet.profileImage} alt="profile" />
      <div>
        <div>
          <p>{tweet.username}</p>
          <p>@{tweet.username.replace(/\s+/g, '').toLowerCase()}</p>
        </div>
      </div>
    </div>
  );
}

export default Tweet;
