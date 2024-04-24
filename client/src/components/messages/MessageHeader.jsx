import React, { useContext, useState } from "react";
import { AddIcCall, ArrowBack, Send } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import classNames from "classnames";
import useToaster from "hooks/useToaster";
import { AuthContext } from "context/authContext";
import { SocketContext } from "context/socketContext";
import { checkOnlineusers } from "helpers";
import { CustomTypography, ProfileAvatar } from "components";

const MessageHeader = ({ selectedConversation, setIsShowMessageUI }) => {
  const { showToast } = useToaster();
  const { currentUser } = useContext(AuthContext);
  const { onlineUsers } = useContext(SocketContext);

  const handleCallClick = () => {
    showToast("This fearure is not developed yet. Will be added in future, Stay tuned.");
  };

  return (
    <div
      className={classNames(
        "flex gap-1 lg:gap-4 items-center mb-4 bg-primaryLightBg p-1.5 lg:p-2 pl-2 lg:pl-4 pr-4 lg:pr-8 rounded-full",
        {
          "justify-center": !selectedConversation,
          "justify-between": selectedConversation,
        }
      )}
    >
      <div
        className={classNames("flex gap-2 lg:gap-4 items-center", {
          "justify-center": !selectedConversation,
          "justify-start": selectedConversation,
        })}
      >
        <IconButton
          onClick={() => setIsShowMessageUI(false)}
          color="primary"
          className="!text-primaryDarkBg h-full lg:!hidden"
          aria-label="back"
        >
          <ArrowBack />
        </IconButton>
        {selectedConversation && (
          <ProfileAvatar
            name={selectedConversation?.user?.name}
            w={40}
            h={40}
            isOnline={!!checkOnlineusers(currentUser?._id, onlineUsers, selectedConversation)}
          />
        )}
        <div className="flex items-baseline gap-2">
          <CustomTypography
            label={selectedConversation?.user?.name ?? "Select a conversation to start chat"}
            variant="h6"
            className="ubuntu-medium"
          />
          {!!checkOnlineusers(currentUser?._id, onlineUsers, selectedConversation) && (
            <CustomTypography label="(Online)" variant="caption" wrapperClassName="h-full "></CustomTypography>
          )}
        </div>
      </div>
      <IconButton onClick={handleCallClick} color="prinary" aria-label="call">
        <AddIcCall
          className={classNames("text-textBlack cursor-pointer hover:!text-hoverTextBg hover:transition-transform", {
            "!hidden": !selectedConversation,
          })}
        />
      </IconButton>
    </div>
  );
};

export default MessageHeader;
