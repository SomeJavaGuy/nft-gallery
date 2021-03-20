import React from "react";
import { TwitterShareButton } from "react-twitter-embed";

const textInTweet = "Check out this NFT Gallery";

const TwitterShare = () => {
  if (typeof window === "undefined") return null;

  const currentURL = window.location.href;
  return (
    <TwitterShareButton url={currentURL} options={{ text: textInTweet }} />
  );
};

export default TwitterShare;
