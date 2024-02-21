import React from "react";

import { CustomInputProps } from "@/interfaces";

const CustomInput: React.FC<CustomInputProps> = ({
  styles,
  value,
  placeholder,
  type,
  name,
  onChange,
}) => {
  return (
    <input
      name={name}
      className={styles}
      value={value}
      placeholder={placeholder}
      type={type}
      onChange={onChange}
    />
  );
};

export default CustomInput;
