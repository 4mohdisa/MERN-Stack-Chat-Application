import React, { memo } from "react";
import { Link } from "../styles/StyledComponents";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  latestMessage = "",
  index = 0,
  handleDeleteChat,
}) => {
  return groupChat ? (
    <GroupChatItem
      avatar={avatar}
      name={name}
      _id={_id}
      sameSender={sameSender}
      newMessageAlert={newMessageAlert}
      latestMessage={latestMessage}
      index={index}
      handleDeleteChat={handleDeleteChat}
    />
  ) : (
    <IndividualChatItem
      avatar={avatar}
      name={name}
      _id={_id}
      sameSender={sameSender}
      isOnline={isOnline}
      newMessageAlert={newMessageAlert}
      latestMessage={latestMessage}
      index={index}
      handleDeleteChat={handleDeleteChat}
    />
  );
};

// Component for Individual Chats
const IndividualChatItem = memo(
  ({ avatar, name, _id, sameSender, isOnline, newMessageAlert, latestMessage, index, handleDeleteChat }) => {
    return (
      <Link
        sx={{ padding: "0", textDecoration: "none" }}
        to={`/chat/${_id}`}
        onContextMenu={(e) => handleDeleteChat(e, _id, false)}
      >
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: sameSender ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.80)",
            color: sameSender ? "white" : "rgba(255,255,255,0.7)",
            padding: "1rem",
            borderTop: index === 0 ? "none" : "1px solid lightgray",
            borderBottom: index === latestMessage.length - 1 ? "none" : "1px solid lightgray",
          }}
        >
          {/* Avatar with online indicator */}
          <Box sx={{ position: "relative" }}>
            <AvatarCard avatar={avatar} />
            {isOnline && (
              <Box
                sx={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "lightgreen",
                  position: "absolute",
                  bottom: "2px",
                  right: "2px",
                }}
              />
            )}
          </Box>

          {/* Chat Information */}
          <Stack flex={1}>
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: "bold" }}>
              {name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "gray",
                fontSize: "0.9rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {latestMessage}
            </Typography>
          </Stack>

          {/* New Message Alert */}
          {newMessageAlert?.count > 0 && (
            <Box
              sx={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "green",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
              }}
            >
              {newMessageAlert.count}
            </Box>
          )}
        </motion.div>
      </Link>
    );
  }
);

// Component for Group Chats
const GroupChatItem = memo(
  ({ avatar, name, _id, sameSender, newMessageAlert, latestMessage, index, handleDeleteChat }) => {
    return (
      <Link
        sx={{ padding: "0", textDecoration: "none" }}
        to={`/chat/${_id}`}
        onContextMenu={(e) => handleDeleteChat(e, _id, true)}
      >
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: sameSender ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.80)",
            color: sameSender ? "white" : "rgba(255,255,255,0.7)",
            padding: "1rem",
            borderTop: index === 0 ? "none" : "1px solid lightgray",
            borderBottom: index === latestMessage.length - 1 ? "none" : "1px solid lightgray",
          }}
        >
          {/* Group Avatar */}
          <AvatarCard avatar={avatar} isGroup />

          {/* Chat Information */}
          <Stack flex={1}>
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: "bold" }}>
              {name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "gray",
                fontSize: "0.9rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {latestMessage}
            </Typography>
          </Stack>

          {/* New Message Alert */}
          {newMessageAlert?.count > 0 && (
            <Box
              sx={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "green",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
              }}
            >
              {newMessageAlert.count}
            </Box>
          )}
        </motion.div>
      </Link>
    );
  }
);

export default memo(ChatItem);
