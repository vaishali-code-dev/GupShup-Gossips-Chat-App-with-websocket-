import React, { useContext, useEffect, useState } from "react";
import Messages from "components/Messages";
import ConversationList from "components/ConversationList";
import { AuthContext } from "../context/authContext";

const Dashboard = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="w-full h-screen grid grid-cols-4">
      <ConversationList
        customClassName="col-span-1"
        setSelectedConversation={setSelectedConversation}
        selectedConversation={selectedConversation}
      />
      <Messages customClassName="col-span-3" selectedConversation={selectedConversation} />
    </div>
  );
};

export default Dashboard;
