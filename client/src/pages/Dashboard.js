import React, { useContext, useState } from "react";
import Messages from "components/messages/Messages";
import ConversationList from "components/conversations/ConversationList";
import { AuthContext } from "../context/authContext";
import classNames from "classnames";

const Dashboard = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isShowMessageUI, setIsShowMessageUI] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setIsShowMessageUI(true);
  };

  return (
    <div className="w-full h-screen grid grid-cols-4">
      <ConversationList
        setSelectedConversation={handleSelectConversation}
        selectedConversation={selectedConversation}
        customClassName={classNames("col-span-4 lg:col-span-1", {
          "hidden lg:block": isShowMessageUI,
        })}
      />
      <Messages
        selectedConversation={selectedConversation}
        setIsShowMessageUI={setIsShowMessageUI}
        customClassName={classNames("col-span-4 lg:col-span-3", {
          "hidden lg:block": !isShowMessageUI,
        })}
      />
    </div>
  );
};

export default Dashboard;
