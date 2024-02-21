import React from "react";
import Image from "next/image";

import github_icon from "../../public/assets/svgs/github-logo.svg";
import discord_icon from "../../public/assets/svgs/image-3.svg";
import twitter_icon from "../../public/assets/svgs/image-4.svg";

const Footer = () => {
  return (
    <footer className="flex justify-center  w-full gap-10  mt-5">
      <Image width={40} height={40} src={github_icon} alt="github" />
      <Image width={40} height={40} src={discord_icon} alt="discord" />
      <Image width={40} height={40} src={twitter_icon} alt="twitter" />
    </footer>
  );
};

export default Footer;
