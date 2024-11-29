import { useInputValidation } from "6pp";
import {
  Button, // Button component for actions
  Dialog, // Dialog component for modal
  DialogTitle, // DialogTitle for modal title
  Skeleton, // Skeleton for loading state
  Stack, // Stack for layout
  TextField, // TextField for input
  Typography, // Typography for text
  Divider, // Divider for separating list items
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";
import {
  useAvailableFriendsQuery, // API query for fetching available friends
  useNewGroupMutation, // API mutation for creating a new group
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

// NewGroup component definition
const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc); // Selecting new group state
  const dispatch = useDispatch(); // Hook for dispatching Redux actions

  // Fetch available friends data
  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation(""); // Custom hook for input validation

  const [selectedMembers, setSelectedMembers] = useState([]); // State for selected members

  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors); // Custom hook for handling errors

  // Handler for selecting members
  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  // Handler for submitting the new group
  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please Select Atleast 3 Members");

    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  // Handler for closing the new group dialog
  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  return (
    <Dialog onClose={closeHandler} open={isNewGroup} fullWidth> {/* Full width dialog for modern look */}
      <Stack p={2} spacing={2}> {/* Consistent and moderate padding and spacing */}
        <DialogTitle textAlign="center">
          New Group
        </DialogTitle>

        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
          fullWidth
          size="small"
        />

        <Typography variant="body1" color={"gray"}>Members</Typography> {/* Section title for members */}

        <Stack spacing={1}> {/* List of available friends */}
          {isLoading ? (
            <Skeleton variant="rectangular" height={100} />
          ) : (
            data?.friends?.map((user, index) => (
              <React.Fragment key={user._id}>
                <UserItem
                  user={user}
                  handler={() => selectMemberHandler(user._id)}
                  isAdded={selectedMembers.includes(user._id)}
                />
                {index < data.friends.length - 1 && <Divider />} {/* Add Divider except after last item */}
              </React.Fragment>
            ))
          )}
        </Stack>

        <Stack direction="row" spacing={1} justifyContent="center"> {/* Action buttons with spacing */}
          <Button
            variant="contained"
            color="primary"
            onClick={submitHandler}
            sx={{ textTransform: 'none', padding: '4px 8px' }}
            disabled={isLoadingNewGroup}
          >
            Create
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={closeHandler}
            sx={{ textTransform: 'none', padding: '4px 8px' }}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup; // Exporting NewGroup component
