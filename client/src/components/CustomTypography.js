import { Typography } from "@mui/material";
import classNames from "classnames";
import React from "react";

const CustomTypography = ({ label = "Ghupshup & Gossips", variant = "h5", className, wrapperClassName, ...rest }) => {
  return (
    <div className={wrapperClassName}>
      <Typography
        variant={variant}
        component="h2"
        className={classNames("text-primaryDarkBg text-center !font-bold ubuntu-regular", className)}
        {...rest}
      >
        {label}
      </Typography>
    </div>
  );
};

export default CustomTypography;
