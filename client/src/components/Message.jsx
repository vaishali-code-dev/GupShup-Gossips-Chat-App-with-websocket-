import classNames from "classnames";
import React from "react";
import CustomTypography from "./CustomTypography";

const Message = ({ isAdmin, message }) => {
  return (
    <div
      className={classNames("p-2 flex justify-start", {
        "justify-end": isAdmin,
      })}
    >
      <div
        className={classNames("p-4 min-w-[20rem] max-w-[30rem]  rounded-xl ubuntu-light", {
          "bg-primaryLightBg rounded-tl-none": !isAdmin,
          "bg-primaryDarkBg text-primaryWhite rounded-tr-none": isAdmin,
        })}
      >
        <CustomTypography
          label={message?.message}
          variant="body1"
          className={classNames("text-start", {
            "!text-textBlack": !isAdmin,
            "!text-primaryWhite": isAdmin,
          })}
        />
      </div>
    </div>
  );
};

export default Message;
