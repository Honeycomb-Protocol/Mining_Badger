import React from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";

import { CardProps } from "@/interfaces";
import { getCubeImage, getStoneImage } from "@/lib/utils";

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
  creationFrom,
  materials,
  experience,
  divStyle,
}) => {
  const cardStyle = {
    width: imageWidth ? `${imageWidth}px` : "165px",
    height: imageHeight ? `${imageHeight}px` : "176px",
  };

  const materialsList = materials?.map((material, index) => (
    <div
      key={index}
      className="flex items-center justify-center mr-2 

  
    

    "
    >
      <Image
        src={
          creationFrom === "stone"
            ? getStoneImage(material.name.split(" ")[0].toLocaleLowerCase()) ||
              ""
            : getCubeImage(material.name.split(" ")[0].toLocaleLowerCase()) ||
              ""
        }
        alt={material.name}
        width={20}
        height={20}
      />
      <p className="text-xs text-gray-300 ml-1">x{material.quantity}</p>
    </div>
  ));

  return (
    <div
      onClick={() => console.log("clicked")}
      className={`flex flex-col justify-center items-center cursor-pointer  ${divStyle}`}
      style={{ width: width ? width : "max-content" }}
    >
      {experience && (
        <div className="flex justify-end text-xs text-white w-full pr-2 pt-2 items-start bg-black">
          <Image
            src="/assets/svgs/lightning.svg"
            alt="lightning"
            width={18}
            height={18}
          />
          {experience}
        </div>
      )}
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
        className={`flex flex-wrap-reverse justify-center max-w-${width} items-center w-full my-2`}
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

      {materials && (
        <div
          className={`flex flex-wrap justify-center max-w-${width} items-center w-full my-1`}
        >
          {materialsList}
        </div>
      )}

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
