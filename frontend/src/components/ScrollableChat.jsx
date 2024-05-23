import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { Box, Text } from "@chakra-ui/layout";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./config/ChatLogic";
import { useChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages = [] }) => {
  const { user } = useChatState();

  return (
    <ScrollableFeed>
      {messages.map((m, i) => (
        <Box key={m._id} display="flex" alignItems="center" mt={isSameUser(messages, m, i, user?._id) ? 3 : 10}>
          {(isSameSender(messages, m, i, user?._id) || isLastMessage(messages, i, user?._id)) && (
            <Tooltip label={m.sender?.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender?.name}
                src={m.sender?.pic}
              />
            </Tooltip>
          )}
          {(isSameSender(messages, m, i, user?._id) || isLastMessage(messages, i, user?._id)) && (
            <Text fontWeight="bold" mr={2}>
              {m.sender?.name}
            </Text>
          )}
          <Box
            bg={m.sender?._id === user?._id ? "#BEE3F8" : "#B9F5D0"}
            ml={isSameSenderMargin(messages, m, i, user?._id)}
            borderRadius="20px"
            p="5px 15px"
            maxWidth="75%"
          >
            {m.content}
          </Box>
        </Box>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
