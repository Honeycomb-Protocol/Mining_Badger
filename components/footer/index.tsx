import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="flex justify-center w-full gap-5 mt-5">
      {/* <Image
        width={30}
        height={30}
        src="/assets/svgs/github-icon.svg"
        alt="github"
      /> */}

      <Image
        width={30}
        height={30}
        src="/assets/svgs/twitter-x-icon.svg"
        alt="twitter"
      />
      <Image
        width={30}
        height={30}
        src="/assets/svgs/discord-icon.svg"
        alt="discord"
      />
    </footer>
  );
};

export default Footer;
