import React from "react";

import { CustomTextAreaProps } from "@/interfaces";

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  styles,
  value,
  placeholder,
  name,
  onChange,
}) => {
  return (
    <textarea
      name={name}
      className={styles}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default CustomTextArea;
