import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Tooltip,
  Badge,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../constants/config";
import AvatarCard from "../shared/AvatarCard";
import { resetNotificationCount } from "../../redux/reducers/chat";
import { setIsNewGroup, setIsNotification, setIsSearch } from "../../redux/reducers/misc";
import { userNotExists } from "../../redux/reducers/auth";
import { useChatDetailsQuery } from "../../redux/api/api";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { chatId } = useParams();
  const { user } = useSelector((state) => state.auth);

  // Get notification count from Redux store
  const { notificationCount } = useSelector((state) => state.chat);
  const { isSearch, isNotification, isNewGroup } = useSelector((state) => state.misc);

  // Fetch current chat details if chatId exists
  const { data: chatData } = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  // Get the other user's information in case of individual chat
  const otherUser = chatData?.chat?.members?.find(
    (member) => member._id !== user?._id
  );

  // Set current chat information based on chat type
  const currentChat = chatData?.chat
    ? {
        avatar: chatData.chat.groupChat
          ? Array.isArray(chatData.chat.avatar) 
            ? chatData.chat.avatar 
            : [chatData.chat.avatar].filter(Boolean)
          : Array.isArray(otherUser?.avatar)
            ? otherUser.avatar
            : [otherUser?.avatar].filter(Boolean),
        name: chatData.chat.groupChat
          ? chatData.chat.name
          : otherUser?.name || "",
        username: !chatData.chat.groupChat ? otherUser?.username || "" : "",
        groupChat: chatData.chat.groupChat
      }
    : null;

  const handleSearch = () => dispatch(setIsSearch(true));
  const handleNewGroup = () => dispatch(setIsNewGroup(true));
  const handleNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, { withCredentials: true });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          bgcolor: "black",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid lightgray",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Left Section: Application Logo */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Box
              component="img"
              src="/vibes.png"
              alt="Logo"
              sx={{ height: 40 }}
            />
          </Box>

          <Divider orientation="vertical" flexItem sx={{ bgcolor: "lightgray", mx: 2 }} />

          {/* Center Section: Profile Information */}
          {currentChat && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={0}
              sx={{
                flex: 2,
                justifyContent: "flex-start", // Align items to the left
                paddingLeft: 0
              }}
            >
              <AvatarCard avatar={currentChat.avatar} />
              <Stack>
                <Typography variant="h6" fontWeight={600}>{currentChat.name}</Typography>
                {!currentChat.groupChat && currentChat.username && (
                  <Typography variant="subtitle2" color="text.secondary">
                    @{currentChat.username}
                  </Typography>
                )}
              </Stack>
            </Stack>
          )}

          <Divider orientation="vertical" flexItem sx={{ bgcolor: "lightgray", mx: 2 }} />

          {/* Right Section: Action Buttons */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Tooltip title="Search">
              <IconButton onClick={handleSearch} sx={{ color: "white" }}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="New Group">
              <IconButton onClick={handleNewGroup} sx={{ color: "white" }}>
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Manage Groups">
              <IconButton onClick={() => navigate("/groups")} sx={{ color: "white" }}>
                <GroupIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton onClick={handleNotification} sx={{ color: "white" }}>
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton onClick={logoutHandler} sx={{ color: "white" }}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
