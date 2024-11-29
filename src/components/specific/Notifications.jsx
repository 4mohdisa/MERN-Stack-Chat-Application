// Importing necessary Material-UI components for the Notifications dialog
import {
  Avatar, // Avatar component for user images
  Button, // Button component for actions
  Dialog, // Dialog component for modal
  DialogTitle, // DialogTitle for modal title
  ListItem, // ListItem for each notification
  Skeleton, // Skeleton for loading state
  Stack, // Stack for layout
  Typography, // Typography for text
  Divider, // Divider for separating list items
} from "@mui/material";

// Importing React and necessary hooks
import React, { memo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Importing custom hooks and Redux actions
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation, // API mutation for accepting friend requests
  useGetNotificationsQuery, // API query for fetching notifications
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";
import { NotificationAddSharp } from "@mui/icons-material";

// Notifications component definition
const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc); // Selecting notification state
  const dispatch = useDispatch(); // Hook for dispatching Redux actions

  // Fetch notifications data
  const { isLoading, data, error, isError } = useGetNotificationsQuery();

  // Local state to manage requests
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (data?.allRequests) {
      setRequests(data.allRequests);
    }
  }, [data]);

  // Mutation for accepting friend requests
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  // Handler for accepting or rejecting friend requests
  const friendRequestHandler = async ({ _id, accept }) => {
    await acceptRequest("Accepting...", { requestId: _id, accept }); // Execute mutation
    if (accept) {
      setRequests((prevRequests) => prevRequests.filter((req) => req._id !== _id));
      if (requests.length === 1) { // Check if it was the last request
        dispatch(setIsNotification(false)); // Close notifications dialog
      }
    }
  };

  // Handler for closing the notifications dialog
  const closeHandler = () => dispatch(setIsNotification(false));

  // Custom hook for handling errors
  useErrors([{ error, isError }]);

  return (
    <Dialog open={isNotification} onClose={closeHandler} fullWidth PaperProps={{
      sx: {
      minHeight: '400px',
      maxHeight: '400px',
      overflow: 'hidden',
      }
    }}> {/* Full width dialog */}
      <Stack p={2} spacing={2}> {/* Consistent and moderate padding and spacing */}
        <DialogTitle textAlign="center">Notifications</DialogTitle>

        {/* Display loading state or notifications */}
        {isLoading ? (
          <Skeleton variant="rectangular" height={100} />
        ) : (
          <>
            {requests.length > 0 ? (
              requests.map(({ sender, _id }, index) => (
                <React.Fragment key={_id}>
                  <NotificationItem
                    sender={sender}
                    _id={_id}
                    handler={friendRequestHandler}
                  />
                  {index < requests.length - 1 && <Divider />} {/* Add Divider except after last item */}
                </React.Fragment>
              ))
            ) : (
              <Stack direction="column" alignItems="center" justifyContent="center" spacing={1} sx={{ height: '100%', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <NotificationAddSharp fontSize="large" sx={{ margin: 'auto' }} />
                <Typography textAlign="center" variant="body1" color="gray" sx={{ margin: 'auto' }}>
                  No notifications
                </Typography>
              </Stack>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
};

// NotificationItem component for individual notifications
const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender; // Destructuring sender details
  return (
    <ListItem>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2} // Consistent spacing
        width="100%"
      >
        <Avatar src={avatar} alt={name} /> {/* Display sender's avatar */}

        <Stack direction="column" flexGrow={1}> {/* Column layout for name and description */}
          <Typography variant="body1">{name}</Typography> {/* Display sender's name */}
          <Typography
            variant="body2"
            sx={{ color: "text.secondary" }} // Lighter color for description
          >
            sent you a friend request.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1}> {/* Action buttons with spacing */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => handler({ _id, accept: true })} // Accept request
            sx={{ textTransform: 'none', padding: '4px 8px' }} // Override to prevent text capitalization
          >
            Accept
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={() => handler({ _id, accept: false })} // Decline request
            sx={{ textTransform: 'none', padding: '2px 10px' }}
          >
            Decline
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications; // Exporting Notifications component