import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import {
  AudioFile as AudioFileIcon,
  Image as ImageIcon,
  UploadFile as UploadFileIcon,
  VideoFile as VideoFileIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/api/api";

const FileMenu = ({ anchorE1, chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);

    if (files.length <= 0) return;

    if (files.length > 5)
      return toast.error(`You can only send 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));

    const toastId = toast.loading(`Sending ${key}...`);
    closeFileMenu();

    try {
      const myForm = new FormData();

      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments(myForm);

      if (res.data) toast.success(`${key} sent successfully`, { id: toastId });
      else toast.error(`Failed to send ${key}`, { id: toastId });

      // Fetching Here
    } catch (error) {
      toast.error(error, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  return (
    <Menu
  anchorEl={anchorE1}
  open={isFileMenu}
  onClose={closeFileMenu}
  sx={{
    "& .MuiPaper-root": {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    },
  }}
>
  <div
    style={{
      width: "12rem",
      padding: "0.5rem",
    }}
  >
    <MenuList>
      <MenuItem
        onClick={selectImage}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "0.8rem",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.05)",
          },
        }}
      >
        <Tooltip title="Image">
          <ImageIcon sx={{ color: "rgba(0, 0, 0, 0.7)" }} />
        </Tooltip>
        <ListItemText sx={{ color: "rgba(0, 0, 0, 0.9)" }}>Image</ListItemText>
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg, image/gif"
          style={{ display: "none" }}
          onChange={(e) => fileChangeHandler(e, "Images")}
          ref={imageRef}
        />
      </MenuItem>

      <MenuItem
        onClick={selectAudio}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "0.8rem",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.05)",
          },
        }}
      >
        <Tooltip title="Audio">
          <AudioFileIcon sx={{ color: "rgba(0, 0, 0, 0.7)" }} />
        </Tooltip>
        <ListItemText sx={{ color: "rgba(0, 0, 0, 0.9)" }}>Audio</ListItemText>
        <input
          type="file"
          multiple
          accept="audio/mpeg, audio/wav"
          style={{ display: "none" }}
          onChange={(e) => fileChangeHandler(e, "Audios")}
          ref={audioRef}
        />
      </MenuItem>

      <MenuItem
        onClick={selectVideo}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "0.8rem",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.05)",
          },
        }}
      >
        <Tooltip title="Video">
          <VideoFileIcon sx={{ color: "rgba(0, 0, 0, 0.7)" }} />
        </Tooltip>
        <ListItemText sx={{ color: "rgba(0, 0, 0, 0.9)" }}>Video</ListItemText>
        <input
          type="file"
          multiple
          accept="video/mp4, video/webm, video/ogg"
          style={{ display: "none" }}
          onChange={(e) => fileChangeHandler(e, "Videos")}
          ref={videoRef}
        />
      </MenuItem>

      <MenuItem
        onClick={selectFile}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "0.8rem",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.05)",
          },
        }}
      >
        <Tooltip title="File">
          <UploadFileIcon sx={{ color: "rgba(0, 0, 0, 0.7)" }} />
        </Tooltip>
        <ListItemText sx={{ color: "rgba(0, 0, 0, 0.9)" }}>File</ListItemText>
        <input
          type="file"
          multiple
          accept="*"
          style={{ display: "none" }}
          onChange={(e) => fileChangeHandler(e, "Files")}
          ref={fileRef}
        />
      </MenuItem>
    </MenuList>
  </div>
</Menu>
  );
};

export default FileMenu;
