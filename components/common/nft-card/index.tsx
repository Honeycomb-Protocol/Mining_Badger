import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { Button, Spinner, Tooltip } from "@nextui-org/react";

import { CardProps } from "@/interfaces";
import MineExpiry from "./mine-expiry";

const NftCard: React.FC<CardProps> = ({
  buttonText,
  level,
  picture,
  name,
  amount,
  imageHeight,
  width,
  imageWidth,
  nftNameStyle,
  btnStyle,
  btnDisabled,
  lock,
  lockStyle,
  materials,
  experience,
  divStyle,
  expIn,
  btnClick,
  loading,
  miningTimeReduction,
  resourceInfo,
  isCompressed,
  canUnwrapped,
  unWrappingItemFunc,
  addStyles,
}) => {
  const [timeLeft, setTimeLeft] = useState(
    new Date(expIn).getTime() > Date.now() ? expIn - Date.now() : 0
  );

  useEffect(() => {
    console.log(btnDisabled, "btnDisabled");
  }, [btnDisabled]);

  const cardStyle = {
    width: imageWidth ? `${imageWidth}px` : "165px",
    height: imageHeight ? `${imageHeight}px` : "176px",
  };

  const materialsList = materials?.map((material, index) => {
    const uri = material?.uri.replace("htthttps://", "https://");
    return (
      <div key={index} className="flex items-center justify-center mr-2">
        <Image src={uri} alt={material?.name} width={20} height={20} />
        <p className="text-xs text-gray-300 ml-1">x{material?.amount}</p>
      </div>
    );
  });

  const imagePic = picture.replace("htthttps://", "https://");
  return (
    <div
      onClick={() => {
        if (isCompressed && canUnwrapped) {
          console.log("Compressed canUnwrapped Item Clicked");
          unWrappingItemFunc();
        }
      }}
      className={`flex flex-col justify-center items-center cursor-pointer ${divStyle}`}
      style={{ width: width ? width : "max-content" }}
    >
      {expIn && timeLeft > 0 && (
        <MineExpiry exp={expIn} setTimeLeft={setTimeLeft} timeLeft={timeLeft} />
      )}
      {experience && (
        <div className="flex justify-end text-xs text-white w-full pr-2 pt-2 items-start bg-black">
          <Image
            src="/assets/svgs/lightning.svg"
            alt="lightning"
            width={18}
            height={18}
          />
          {experience}
          <Tooltip content={resourceInfo} className="bg-[#1D1D1D]">
            <Image
              src="/assets/svgs/info-icon.svg"
              alt="info"
              className="ml-2"
              width={16}
              height={16}
            />
          </Tooltip>
        </div>
      )}
      <div className={`relative`} style={cardStyle}>
        {addStyles ? (
          <img
            src={imagePic}
            alt={name}
            className={addStyles ? addStyles : ""}
            width={imageWidth + 70}
            height={imageHeight + 70}
            style={{
              maxWidth: "200%",
              pointerEvents: "none",
            }}
          />
        ) : (
          <Image
            src={imagePic}
            alt={name}
            fill
            className={addStyles ? addStyles : ""}
          />
        )}
        {miningTimeReduction && (
          <div className="absolute top-2 -right-8 z-50 bg-gradient-to-r from-[#2d2f31,#747474] to-[#2d2f31] text-sm px-2 rounded">
            {miningTimeReduction}
          </div>
        )}
        {amount && (
          <div className="absolute -top-2 left-0 bg-red-700 rounded-full text-xs w-6 h-6 flex justify-center items-center">
            {amount}
          </div>
        )}
        {isCompressed && canUnwrapped ? (
          <div className="absolute -top-2 right-0 bg-blue-700 rounded-full text-xs w-6 h-6 flex justify-center items-center">
            <Tooltip
              content="This resource is compressed and can be wrapped to be used for refining. Click on it to unwrap."
              className="bg-[#1D1D1D]"
            >
              <span>C</span>
            </Tooltip>
          </div>
        ) : (
          !isCompressed &&
          !canUnwrapped && (
            <div className="absolute -top-2 right-0 bg-green-700 rounded-full text-xs w-6 h-6 flex justify-center items-center">
              <Tooltip
                content="This resource is unrwapped and ready to be used."
                className="bg-[#1D1D1D]"
              >
                <span>U</span>
              </Tooltip>
            </div>
          )
        )}
        {lock && (
          <div
            className={`absolute flex justify-center items-center backdrop-blur-sm w-full h-full ${lockStyle}`}
          >
            <div className="bg-[#464646] text-[#6e6e6e] font-bold px-4 py-1 rounded-md">
              Locked
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
            <Tooltip
              content={
                resourceInfo
                  ? resourceInfo
                  : "Your level is sufficient for this resource"
              }
              className="bg-[#1D1D1D]"
            >
              <Image
                src="/assets/svgs/info-icon.svg"
                alt="info"
                className="ml-2"
                width={16}
                height={16}
              />
            </Tooltip>
          </p>
        )}
      </div>

      {materials && materials.length > 0 && (
        <div
          className={`flex flex-wrap justify-center max-w-${width} items-center w-full my-1`}
        >
          {materialsList}
        </div>
      )}

      {buttonText && !lock && (
        <Tooltip
          content={expIn && timeLeft > 0 && "Freezing time is not over yet!"}
          className={`bg-black`}
        >
          <Button
            disabled={timeLeft > 0 || btnDisabled}
            className={`h-7 w-[70%] bg-[#5CA16B] rounded-md text-sm tracking-wider text-white mt-2 ${btnStyle}`}
            onClick={btnClick}
          >
            {loading?.status && loading?.name === name ? (
              <Spinner size="sm" color="white" />
            ) : (
              buttonText
            )}
          </Button>
        </Tooltip>
      )}
    </div>
  );
};

export default NftCard;
