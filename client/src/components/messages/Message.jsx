import classNames from "classnames";
import React from "react";
import { CustomTypography, Skeleton } from "components";

const Message = ({ isAdmin, message, isMessagesListLoading }) => {
  return (
    <div
      className={classNames("p-1 lg:p-2 flex justify-start", {
        "justify-end": isAdmin,
      })}
    >
      <div
        className={classNames(
          " min-w-[10rem] lg:min-w-[20rem] max-w-[20rem] lg:max-w-[30rem]  rounded-xl ubuntu-light shadow-md",
          {
            "bg-primaryLightBg rounded-tl-none": !isAdmin,
            "bg-primaryDarkBg text-primaryWhite rounded-tr-none": isAdmin && !isMessagesListLoading,
            "p-1 lg:p-2": !isMessagesListLoading,
          }
        )}
      >
        {!isMessagesListLoading && message ? (
          <>
            <CustomTypography
              label={message?.message}
              variant="body1"
              className={classNames("text-start", {
                "!text-textBlack": !isAdmin,
                "!text-primaryWhite": isAdmin,
              })}
            />
            <CustomTypography
              label={message?.dateTime}
              variant="caption"
              className={classNames("text-end !text-[0.6rem] lg:!text-xs", {
                "!text-textBlack": !isAdmin,
                "!text-primaryWhite": isAdmin,
              })}
            />
          </>
        ) : (
          <Skeleton wrapperClassName="!p-0" />
        )}
      </div>
    </div>
  );
};

export default Message;
