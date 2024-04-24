import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Send } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import classNames from "classnames";
import useToaster from "hooks/useToaster";
import { AuthContext } from "context/authContext";
import { SocketContext } from "context/socketContext";
import { getMessages, sendMessageApi } from "apis/messages";
import { CustomTypography, Message, Input, MessageHeader } from "components";

const Messages = ({ customClassName, selectedConversation, setIsShowMessageUI }) => {
  const [userInput, setuserInput] = useState("");
  const [messagesList, setMessagesList] = useState("");
  const { showToast } = useToaster();
  const { currentUser } = useContext(AuthContext);
  const { socket, onlineUsers } = useContext(SocketContext);
  const bottomScrollViewRef = useRef();
  useEffect(() => {
    if (bottomScrollViewRef.current) {
      bottomScrollViewRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [selectedConversation, messagesList]);

  useEffect(() => {
    if (socket && currentUser) {
      socket.on("getNewMessages", (newMsg) => {
        setMessagesList((prevMssg) => [...prevMssg, newMsg]);
      });
    }
  }, [socket, currentUser]);

  const fetchMessages = useCallback(
    async (selectedConversation) => {
      try {
        let { data } = await getMessages({ convId: selectedConversation?.conversationId });
        setMessagesList(data);
      } catch (error) {
        showToast(error);
      }
    },
    [selectedConversation]
  );

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const sendMessage = useCallback(async () => {
    try {
      let payload = {
        conversationId: selectedConversation?.conversationId,
        senderId: currentUser?._id,
        receiverId: selectedConversation?.user?.id,
        message: userInput,
      };
      socket.emit("sendMsg", payload);
      let { data } = await sendMessageApi(payload);
      setuserInput("");
      fetchMessages(selectedConversation);
    } catch (error) {
      showToast(error);
    }
  }, [selectedConversation, userInput]);

  const handleMessageChange = ({ target: { value } }) => {
    setuserInput(value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (userInput) {
      sendMessage();
    }
  };

  return (
    <div className={classNames("p-2 pt-2.5 lg:p-6", customClassName)}>
      <MessageHeader selectedConversation={selectedConversation} setIsShowMessageUI={setIsShowMessageUI} />
      {selectedConversation && (
        <>
          <div className="shadow-sm h-[calc(100vh-10rem)] lg:h-[calc(100vh-12rem)] flex flex-col gap-2 overflow-y-auto useScrollbar mb-6">
            {!!messagesList.length ? (
              messagesList?.map((message, index) => (
                <Message key={index} message={message} isAdmin={message.senderId === currentUser._id} />
              ))
            ) : (
              <CustomTypography
                wrapperClassName="h-full flex items-center justify-center"
                label="Be the first to send the message"
                variant="h6"
              />
            )}
            <label ref={bottomScrollViewRef} />
          </div>

          <form className="flex gap-2 lg:gap-6" onSubmit={handleSendMessage}>
            <Input
              hiddenLabel
              label=""
              value={userInput}
              onChange={handleMessageChange}
              placeholder="Type a message"
              size="small"
              autoFocus
            />
            <IconButton type="submit" color="primary" className="!text-primaryDarkBg" aria-label="send message">
              <Send className="!text-3xl" />
            </IconButton>
          </form>
        </>
      )}
    </div>
  );
};

export default Messages;
