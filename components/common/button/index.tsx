import React from "react";
import { Spinner } from "@nextui-org/react";

import { ButtonProps } from "@/interfaces";

const Button = ({ styles, onClick, loading, btnText,disable }: ButtonProps) => {
  return (
    <button
      className={`${styles}`}
      onClick={onClick}
      disabled={loading ? true : false || disable}
    >
      {loading ? <Spinner color="default" size="sm" /> : btnText}
    </button>
  );
};

export default Button;
