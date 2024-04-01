import React, { useState } from "react";
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
}) => {
  const [timeLeft, setTimeLeft] = useState(
    expIn > Date.now() ? expIn - Date.now() : 0
  );

  const cardStyle = {
    width: imageWidth ? `${imageWidth}px` : "165px",
    height: imageHeight ? `${imageHeight}px` : "176px",
  };

  const materialsList = materials?.map((material, index) => (
    <div key={index} className="flex items-center justify-center mr-2">
      <Image src={material?.uri} alt={material?.name} width={20} height={20} />
      <p className="text-xs text-gray-300 ml-1">x{material?.amount}</p>
    </div>
  ));

  return (
    <div
      className={`flex flex-col justify-center items-center cursor-pointer ${divStyle}`}
      style={{ width: width ? width : "max-content" }}
    >
      {expIn && timeLeft > 0 && btnDisabled && (
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
        </div>
      )}
      <div className={`relative`} style={cardStyle}>
        <Image src={picture} alt={name} fill />
        {amount && (
          <div className="absolute top-0 right-0 bg-red-700 rounded-full text-xs p-1">
            {amount}
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
