import classNames from "classnames";
import React, { useContext, useEffect, useRef, useState } from "react";
import { getConversation } from "apis/conversation";
import { AuthContext } from "context/authContext";
import CustomTypography from "./CustomTypography";
import useToaster from "hooks/useToaster";
import Conversation from "./Conversation";
import UserAutoComplete from "./UserAutoComplete";
import { getUsers } from "apis/login";
import { PersonAdd } from "@mui/icons-material";
import ButtonUsage from "./ButtonUsage";
import { createConversation } from "../apis/conversation";
import { IconButton } from "@mui/material";

const ConversationList = ({ customClassName, setSelectedConversation, selectedConversation }) => {
  const [conversationList, setConversationList] = useState([]);
  const [isShowAddUserAutoComplete, setIsShowAddUserAutoComplete] = useState(false);
  const [selectedUserValue, setSelectedUserValue] = useState(null);
  const [users, setUsers] = useState([]);
  const formattedUsersList = useRef([]);
  const { showToast } = useToaster();
  const { currentUser } = useContext(AuthContext);

  const fetchConversation = async () => {
    try {
      let { data } = await getConversation(currentUser?._id);
      setConversationList(data);
    } catch (error) {
      showToast(error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let { data } = await getUsers();
        let usersData = data
          .filter((el) => el._id !== currentUser._id)
          .map((item) => ({
            ...item,
            label: `${item.fullName} (${item.email})`,
            id: item._id,
            key: item._id,
          }));
        formattedUsersList.current = usersData;
        setUsers(usersData);
      } catch (error) {
        showToast(error);
      }
    };
    if (currentUser) {
      fetchConversation();
      fetchUsers();
    }
  }, [currentUser]);

  const handleClickAddUser = () => {
    setIsShowAddUserAutoComplete(!isShowAddUserAutoComplete);
  };

  const handleCreateConversation = async () => {
    try {
      let senderId = currentUser._id;
      let receiverId = formattedUsersList.current.find((item) => item.label === selectedUserValue.label).id;
      let { data } = await createConversation({ senderId, receiverId });
      setSelectedConversation(data);
      fetchConversation();
    } catch (error) {
      showToast(error);
    }
  };

  return (
    <div className={classNames(customClassName, "bg-primaryLightBg flex flex-col py-4")}>
      <Conversation isAdmin />
      <div className="p-8 pb-0">
        <div
          className={classNames("flex justify-between items-center", {
            "mb-4": isShowAddUserAutoComplete,
          })}
        >
          <CustomTypography label="Conversations" variant="h6" className="!text-left" />
          <IconButton
            type="submit"
            color="primary"
            className="!h-full !text-primaryDarkBg"
            aria-label="Create new chat"
            onClick={handleClickAddUser}
          >
            <PersonAdd className="!text-3xl !text-textBlack cursor-pointer items-center hover:!text-hoverBg" />
          </IconButton>
        </div>
        {isShowAddUserAutoComplete && (
          <div className="flex w-full gap-4">
            <div className="flex-1">
              <UserAutoComplete usersList={users} value={selectedUserValue} setValue={setSelectedUserValue} />
            </div>
            <ButtonUsage disabled={!selectedUserValue} label="CHAT" onClick={handleCreateConversation} size="small" />
          </div>
        )}

        <div
          className={classNames("rounded-2xl mt-4 max-h-[calc(100vh-14rem)] overflow-y-auto noScrollbar shadow-xl", {
            "max-h-[calc(100vh-18rem)]": isShowAddUserAutoComplete,
          })}
        >
          {conversationList?.map((item) => {
            return (
              <Conversation
                convData={item}
                key={item?.conversationId}
                className="bg-primaryWhite first:rounded-t-2xl"
                setSelectedConversation={setSelectedConversation}
                selectedConversation={selectedConversation}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConversationList;
