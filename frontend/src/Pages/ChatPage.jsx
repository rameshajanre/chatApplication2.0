import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { useChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import { useLocation } from "react-router";

const ChatPage = () => {
  const  location  = useLocation();
  const { userData } = location.state??{};
  const { user } = useChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
