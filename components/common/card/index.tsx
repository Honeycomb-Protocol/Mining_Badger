import { Button } from "@nextui-org/react";
import React from "react";

type CardProps = {
  hasButton: boolean;
  hasLevels: boolean;
  buttonText: string;
  level: string;
  picture: string;
  name: string; // Added name property
};

const Card: React.FC<CardProps> = ({
  hasButton,
  hasLevels,
  buttonText,
  level,
  picture,
  name, // Added name property
}) => {
  return (
    <div className="card flex-col justify-center items-center w-20">
      <img style={{}} src={picture} alt="Card Image" />

      <div className="flex justify-between items-center">
        <p>{name}</p>
        {hasLevels && (
          <p
            style={{
              fontWeight: 100,
            }}
          >
            {" "}
            Level {level}
          </p>
        )}
      </div>

      <div className="flex justify-center items-center">
        {hasButton && (
          <Button className="center w-[80%] bg-gradient-to-b from-[#81FD9C] to-[#30302E] drop-shadow-sm font-bold text-white">
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Card;
