import React, { useContext, useEffect, useRef, useState } from "react";
import { PersonAdd } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import classNames from "classnames";
import { createConversation, getConversation } from "apis/conversation";
import { AuthContext } from "context/authContext";
import { SocketContext } from "context/socketContext";
import useToaster from "hooks/useToaster";
import { getUsers } from "apis/login";
import { ButtonUsage, UserAutoComplete, Conversation, CustomTypography } from "components";

const ConversationList = ({ customClassName, setSelectedConversation, selectedConversation }) => {
  const [conversationList, setConversationList] = useState([]);
  const conversationListRef = useRef([]);
  const [isConversationListLoading, setIsConversationListLoading] = useState(true);
  const [isShowAddUserAutoComplete, setIsShowAddUserAutoComplete] = useState(false);
  const [selectedUserValue, setSelectedUserValue] = useState(null);
  const [users, setUsers] = useState([]);
  const formattedUsersList = useRef([]);
  const { showToast } = useToaster();
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (socket && currentUser) {
      socket.on("getNewConversation", (newMsg) => {
        setConversationList((prevMssg) => [...prevMssg, newMsg]);
      });
      socket.on("getNewMessageInConversation", (conversation) => {
        console.log({ conversationListRef });
        let localConversationList = [...conversationListRef.current];
        let newConvIdx = localConversationList.findIndex((conv) => conv.conversationId === conversation.conversationId);
        localConversationList[newConvIdx] = {
          ...localConversationList[newConvIdx],
          lastMessage: {
            message: conversation.lastMessage.message,
            senderId: conversation.lastMessage.senderId,
          },
        };
        setConversationList(localConversationList);
        conversationListRef.current = localConversationList;
      });
    }
  }, [socket, currentUser]);

  const fetchConversation = async () => {
    try {
      let { data } = await getConversation(currentUser?._id);
      setConversationList(data);
      conversationListRef.current = data;
    } catch (error) {
      showToast(error);
    } finally {
      setIsConversationListLoading(false);
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
      socket.emit("sendConversation", { ...data, userId: currentUser?._id });
      setSelectedConversation(data);
      fetchConversation();
    } catch (error) {
      showToast(error);
    }
  };

  const getConversationListUI = () => {
    if (isConversationListLoading) {
      return Array(5)
        .fill("")
        .map((item, index) => (
          <Conversation
            key={index}
            className="bg-primaryWhite first:rounded-t-2xl"
            isConversationListLoading={isConversationListLoading}
          />
        ));
    } else if (conversationList.length) {
      return conversationList?.map((item) => (
        <Conversation
          convData={item}
          key={item?.conversationId}
          className={classNames("bg-primaryWhite first:rounded-t-2xl", {
            "!bg-secondaryLightBg": selectedConversation?.conversationId === item?.conversationId,
          })}
          setSelectedConversation={setSelectedConversation}
          selectedConversation={selectedConversation}
          isConversationListLoading={isConversationListLoading}
        />
      ));
    } else {
      return (
        <CustomTypography
          variant="body1"
          label="No conversations? You can start one by clicking above icon."
          wrapperClassName="p-4"
        />
      );
    }
  };

  return (
    <div className={classNames(customClassName, "bg-primaryLightBg flex flex-col py-4")}>
      <Conversation isAdmin />
      <div className="p-4 lg:p-8 pb-0">
        <div
          className={classNames("flex justify-between items-center", {
            "mb-4": isShowAddUserAutoComplete,
          })}
        >
          <CustomTypography label="Conversations" variant="h6" className="!text-left !mb-2 text-primaryDarkBg ubuntu-medium" />
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
          className={classNames("rounded-2xl mt-4 max-h-[calc(100vh-14rem)] overflow-y-auto noScrollbar", {
            "max-h-[calc(100vh-18rem)]": isShowAddUserAutoComplete,
            "shadow-xl": conversationList.length,
          })}
        >
          {getConversationListUI()}
        </div>
      </div>
    </div>
  );
};

export default ConversationList;
