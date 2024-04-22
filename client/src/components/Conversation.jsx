import React, { useContext } from "react";
import ProfileAvatar from "./ProfileAvatar";
import { AuthContext } from "context/authContext";
import CustomTypography from "./CustomTypography";
import classNames from "classnames";
import ButtonUsage from "./ButtonUsage";
import { useNavigate } from "react-router-dom";
import useToaster from "hooks/useToaster";
import { logoutUser } from "apis/login";

const Conversation = ({ convData, isAdmin = false, setSelectedConversation, className, selectedConversation }) => {
  const { currentUser } = useContext(AuthContext);
  const Navigate = useNavigate();
  const { showToast } = useToaster();

  const getConditionalAvatar = () => {
    if (isAdmin && !currentUser) {
      return null;
    }
    if (!isAdmin && !convData) {
      return null;
    }
    return <ProfileAvatar name={isAdmin ? currentUser?.fullName : convData?.user?.name} />;
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
      {...(!isAdmin && {
        onClick: () => {
          setSelectedConversation(convData);
        },
      })}
    >
      <div className="flex gap-2 items-center">
        {getConditionalAvatar()}
        <div>
          <CustomTypography
            label={isAdmin ? "Admin" : convData?.user?.name}
            variant="body1"
            className="text-start ubuntu-medium"
          />
          <CustomTypography label={isAdmin ? currentUser?.email : convData?.user?.email} variant="body2" />
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
