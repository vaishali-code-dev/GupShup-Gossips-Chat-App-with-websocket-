import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { AuthContext } from "context/authContext";
import { SocketContext } from "context/socketContext";
import useToaster from "hooks/useToaster";
import { checkOnlineusers } from "helpers";
import { ProfileAvatar, CustomTypography, ButtonUsage, Skeleton } from "components";

const Conversation = ({
  convData,
  isAdmin = false,
  setSelectedConversation,
  className,
  selectedConversation,
  isConversationListLoading,
}) => {
  const { currentUser, logOutUser } = useContext(AuthContext);
  const { onlineUsers } = useContext(SocketContext);
  const Navigate = useNavigate();
  const { showToast } = useToaster();

  const getConditionalAvatar = () => {
    if (isConversationListLoading) {
      return <Skeleton variant="avatar" wrapperClassName={classNames({ hidden: isAdmin })} />;
    }
    if (isAdmin && !currentUser) {
      return null;
    }
    if (!isAdmin && !convData) {
      return null;
    }
    return (
      <ProfileAvatar
        name={isAdmin ? currentUser?.fullName : convData?.user?.name}
        isOnline={!!checkOnlineusers(currentUser?._id, onlineUsers, convData)}
        profilePhoto={isAdmin ? currentUser?.profilePhoto : convData?.user?.profilePhoto}
      />
    );
  };

  const getLastMessageUI = () => {
    if (isAdmin) {
      return currentUser?.email;
    } else if (!convData?.lastMessage) {
      return "";
    } else if (convData?.lastMessage?.senderId === currentUser._id)
      return `You: ${(convData?.lastMessage?.message || "").slice(0, 15)}${
        convData?.lastMessage?.message?.length > 15 ? "..." : ""
      }`;
    else {
      return `${convData?.user?.name}: ${(convData?.lastMessage?.message || "").slice(0, 15)}${
        convData?.lastMessage?.message?.length > 15 ? "..." : ""
      }`;
    }
  };

  return (
    <div
      className={classNames(
        "h-24 w-ful p-3 flex items-center justify-between gap-2 overflow-x-auto overflow-y-hidden useScrollbar border-b border-primaryLightBg",
        {
          "cursor-pointer hover:bg-secondaryLightBg": !isAdmin && !isConversationListLoading,
          "!bg-secondaryLightBg": selectedConversation && selectedConversation?.conversationId === convData?.conversationId,
        },
        className
      )}
      {...(!isAdmin &&
        !isConversationListLoading && {
          onClick: () => {
            setSelectedConversation(convData);
          },
        })}
    >
      <div className="flex gap-2 lg:gap-4 items-center w-full">
        {getConditionalAvatar()}
        <div className="flex-1">
          <div className="flex gap-2 items-center">
            {!isConversationListLoading ? (
              <div className="flex gap-1 lg:gap-4 items-center justify-between w-full">
                <CustomTypography
                  label={isAdmin ? "Admin" : convData?.user?.name}
                  variant="body1"
                  className="text-start ubuntu-medium"
                />

                {!isAdmin && (
                  <CustomTypography
                    label={convData?.lastMessage?.dateTime ?? ""}
                    className={classNames("text-end break-words", {
                      "!text-primaryDarkBg": !isAdmin,
                    })}
                    variant="caption"
                  />
                )}
              </div>
            ) : (
              <Skeleton
                wrapperClassName={classNames({
                  hidden: isAdmin,
                })}
              />
            )}
          </div>
          {/* {!isConversationListLoading ? (
            <CustomTypography label={isAdmin ? currentUser?.email : convData?.user?.email} variant="body2" />
          ) : (
            <Skeleton
              variant="text"
              wrapperClassName={classNames({
                hidden: isAdmin,
              })}
            />
          )} */}
          {!isConversationListLoading ? (
            <CustomTypography
              label={getLastMessageUI()}
              variant="body2"
              className={classNames("text-start break-words", {
                "!text-primaryDarkBg": !isAdmin,
              })}
            />
          ) : (
            <Skeleton
              variant="text"
              wrapperClassName={classNames({
                hidden: isAdmin,
              })}
            />
          )}
        </div>
      </div>
      {isAdmin && (
        <div className="m-3 flex justify-center">
          <ButtonUsage label="Logout" variant="contained" size="small" onClick={logOutUser} />
        </div>
      )}
    </div>
  );
};

export default Conversation;
