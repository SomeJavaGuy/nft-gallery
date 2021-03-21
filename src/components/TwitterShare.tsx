import React from "react";
import { TwitterShareButton } from "react-twitter-embed";

const textInTweet = "Check out this NFT Gallery";

const TwitterShare = (props: any) => {
  if (typeof window === "undefined") return null;

  const currentURL = window.location.href;
  return (
    <div {...props}>
      <TwitterShareButton
        url={currentURL}
        options={{ text: textInTweet, size: "large" }}
      />
    </div>
  );
};

export default TwitterShare;
