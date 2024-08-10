import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import moment from 'moment';


const groupMessagesByDate = (messages) => {
  const groupedMessages = [];
  let currentDate = null;

  messages.forEach((message) => {
    const messageDate = moment(message.createdAt).format('YYYY-MM-DD');

    if (messageDate !== currentDate) {
      groupedMessages.push({ date: messageDate, messages: [message] });
      currentDate = messageDate;
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(message);
    }
  });

  return groupedMessages;
};


const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  
  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <ScrollableFeed>
      {groupedMessages.map((group, index) => (
        <div key={index}>
          {/* Display the date header */}
          <div
            style={{
              textAlign: "center",
              margin: "20px 0",
              color: "#fff",
            }}
          >
            <span
              style={{
                backgroundColor: "#2D3748", // Dark background color
                borderRadius: "10px",
                padding: "5px 15px",
                display: "inline-block",
                color: "#fff", // Ensure text color contrasts with background
                fontSize: "0.875rem" // Optional: adjust font size if needed
              }}
            >
              {moment(group.date).format('MMMM D, YYYY')}
            </span>
          </div>
          {group.messages.map((m, i) => (
            <div style={{ display: "flex" }} key={m._id}>
              {(isSameSender(group.messages, m, i, user._id) ||
                isLastMessage(group.messages, i, user._id)) && (
                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: isSameSenderMargin(group.messages, m, i, user._id),
                  marginTop: isSameUser(group.messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                {m.content}
                <br />
                <small>{moment(m.createdAt).format('hh:mm A')}</small>
              </span>
            </div>
          ))}
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
