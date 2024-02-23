import React from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";

import { CardProps } from "@/interfaces";

const NftCard: React.FC<CardProps> = ({
  buttonText,
  level,
  picture,
  name,
  notification,
  imageHeight,
  width,
  imageWidth,
  nftNameStyle,
  btnStyle,
  btnDisabled,
  lock,
  lockStyle,
}) => {
  const cardStyle = {
    width: imageWidth ? `${imageWidth}px` : "165px",
    height: imageHeight ? `${imageHeight}px` : "176px",
  };

  return (
    <div
      className={`flex flex-col justify-center items-center`}
      style={{ width: width ? width : "max-content" }}
    >
      <div className={`relative`} style={cardStyle}>
        <Image src={picture} alt={name} fill />
        {notification && (
          <div className="absolute top-0 right-0 bg-red-700 rounded-full text-xs p-1">
            {notification}
          </div>
        )}
        {lock && (
          <div
            className={`absolute flex justify-center items-center backdrop-blur-sm w-full h-full ${lockStyle}`}
          >
            <div className="bg-[#464646] text-[#6e6e6e] font-bold px-4 py-1 rounded-md">
              Lock
            </div>
          </div>
        )}
      </div>
      <div
        className={`flex flex-wrap-reverse justify-center max-w-${width} items-center w-full`}
      >
        <p className={`whitespace-nowrap ${nftNameStyle}`}>{name}</p>
        {level && (
          <p className="flex items-center justify-center text-sm text-gray-300 ml-2 whitespace-nowrap">
            Lvl {level}
            <Image
              src="/assets/svgs/info-icon.svg"
              alt="info"
              className="ml-2"
              width={16}
              height={16}
            />
          </p>
        )}
      </div>

      {buttonText && !lock && (
        <Button
          disabled={btnDisabled}
          className={`h-7 w-[70%] bg-[#5CA16B] rounded-md text-sm tracking-wider text-white mt-2 ${btnStyle}`}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default NftCard;
