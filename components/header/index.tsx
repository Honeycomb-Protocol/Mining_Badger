import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <Image
        src="/assets/images/logo.png"
        alt="logo"
        width={350}
        height={0}
      />
    </div>
  );
};

export default Header;
