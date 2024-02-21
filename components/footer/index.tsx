import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="flex justify-center w-full gap-10 mt-5">
      <Image
        width={40}
        height={40}
        src="/assets/svgs/github-icon.svg"
        alt="github"
      />
      <Image
        width={40}
        height={40}
        src="/assets/svgs/discord-icon.svg"
        alt="discord"
      />
      <Image
        width={40}
        height={40}
        src="/assets/svgs/twitter-icon.svg"
        alt="twitter"
      />
    </footer>
  );
};

export default Footer;
