import React from "react";
import { Typography } from "@mui/material";
import classNames from "classnames";

const CustomTypography = ({ label = "Gupshup & Gossips", variant = "h5", className, wrapperClassName, ...rest }) => {
  return (
    <div className={wrapperClassName}>
      <Typography
        variant={variant}
        component="h2"
        className={classNames("text-primaryDarkBg text-center !font-bold ubuntu-regular break-words", className)}
        {...rest}
      >
        {label}
      </Typography>
    </div>
  );
};

export default CustomTypography;
