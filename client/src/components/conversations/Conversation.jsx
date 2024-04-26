import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { AuthContext } from "context/authContext";
import { SocketContext } from "context/socketContext";
import useToaster from "hooks/useToaster";
import { checkOnlineusers } from "helpers";
import { logoutUser } from "apis/login";
import { ProfileAvatar, CustomTypography, ButtonUsage, Skeleton } from "components";

const Conversation = ({
  convData,
  isAdmin = false,
  setSelectedConversation,
  className,
  selectedConversation,
  isConversationListLoading,
}) => {
  const { currentUser } = useContext(AuthContext);
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
      />
    );
  };

  const logOutUser = () => {
    logoutUser(currentUser._id);
    sessionStorage.removeItem("token");
    Navigate("/");
    showToast("Logout successfully, Hope to see you soon.");
  };
  return (
    <div
      className={classNames(
        "h-24 w-ful p-3 flex items-center justify-between gap-2 overflow-x-auto overflow-y-hidden useScrollbar border-b border-primaryLightBg",
        {
          "cursor-pointer hover:bg-secondaryLightBg": !isAdmin,
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
      <div className="flex gap-2 lg:gap-4 items-center">
        {getConditionalAvatar()}
        <div>
          <div className="flex gap-2 items-center">
            {!isConversationListLoading ? (
              <CustomTypography
                label={isAdmin ? "Admin" : convData?.user?.name}
                variant="body1"
                className="text-start ubuntu-medium"
              />
            ) : (
              <Skeleton
                wrapperClassName={classNames({
                  hidden: isAdmin,
                })}
              />
            )}
          </div>
          {!isConversationListLoading ? (
            <CustomTypography label={isAdmin ? currentUser?.email : convData?.user?.email} variant="body2" />
          ) : (
            <Skeleton
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
