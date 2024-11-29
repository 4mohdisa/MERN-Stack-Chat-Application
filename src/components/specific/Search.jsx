import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Dialog, // Dialog component for modal
  DialogTitle, // DialogTitle for modal title
  InputAdornment, // InputAdornment for icons inside input fields
  List, // List component for displaying search results
  Stack, // Stack for layout
  TextField, // TextField for input
  Divider, // Divider for separating list items
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useLazySearchUserQuery, // API query for searching users
  useSendFriendRequestMutation, // API mutation for sending friend requests
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

// Search component definition
const Search = () => {
  const { isSearch } = useSelector((state) => state.misc); // Selecting search state

  const [searchUser] = useLazySearchUserQuery(); // Lazy query for searching users

  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const dispatch = useDispatch(); // Hook for dispatching Redux actions

  const search = useInputValidation(""); // Custom hook for input validation

  const [users, setUsers] = useState([]); // State for storing search results

  // Handler for sending friend requests
  const addFriendHandler = async (id) => {
    try {
      const response = await sendFriendRequest("Sending friend request...", { userId: id });
      if (response && response.data) { // Ensure response and response.data are not undefined
        const { status } = response.data;
        if (status === 'sent' || status === 'Send') {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === id ? { ...user, requestStatus: status } : user
            )
          );
        } else {
          console.error("Unknown request status:", status);
        }
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  // Handler for closing the search dialog
  const searchCloseHandler = () => dispatch(setIsSearch(false));

  // Effect for searching users with a debounce
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler} fullWidth> {/* Full width dialog for modern look */}
      <Stack p={2} spacing={2}> {/* Consistent and moderate padding and spacing */}
        <DialogTitle textAlign="center">Find People</DialogTitle>
        <TextField
          label="Search"
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List> {/* List of search results */}
          {users.map((user, index) => (
            <React.Fragment key={user._id}>
              <UserItem
                user={user}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
                requestStatus={user.requestStatus} // Pass the request status to UserItem
              />
              {index < users.length - 1 && <Divider />} {/* Add Divider except after last item */}
            </React.Fragment>
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search; // Exporting Search component
