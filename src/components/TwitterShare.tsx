import React from "react";
import {
  TwitterIcon,
  TwitterShareButton
} from "react-share";

const textInTweet = "Check out this NFT Gallery!";

const TwitterShare = (props: any) => {
  if (typeof window === "undefined") return null;

  const currentURL = window.location.href;
  return (
    <div {...props}>
      <TwitterShareButton
        url={currentURL}
        title={textInTweet}
        className={"tweetbutton"}
      >
        <span className={"tweetbutton-text"}>Share</span>
        <TwitterIcon
          size={32}
          round />
      </TwitterShareButton>
    </div>
  );
};

export default TwitterShare;
