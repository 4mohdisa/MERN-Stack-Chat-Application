import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { bgGradient } from "../constants/color";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...");

    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    // Append avatar only if it exists
    if (avatar.file) {
      formData.append("avatar", avatar.file);
    }

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/Abstract-Background-min.jpg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <img src="/logo-black.svg" alt="Logo" style={{ width: '100px', marginBottom: '1rem' }} />
              <Typography variant="h5" style={{ color: 'black' }}>Login</Typography>
              <form
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="dense"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                  InputProps={{
                    style: { height: '40px', borderColor: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: 'rgba(0,0,0,0.7)', fontSize: '1rem' },
                  }}
                />

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="dense"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                  InputProps={{
                    style: { height: '40px', borderColor: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: 'rgba(0,0,0,0.7)', fontSize: '1rem' },
                  }}
                />

                <Button
                  sx={{
                    marginTop: '0.5rem',
                    bgcolor: 'black',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'grey',
                    },
                  }}
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  Login
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>

                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="text"
                  onClick={toggleLogin}
                  style={{ color: 'black' }}
                >
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <img src="/logo-black.svg" alt="Logo" style={{ width: '100px', marginBottom: '1rem' }} />
              <Typography variant="h5" style={{ color: 'black' }}>Sign Up</Typography>
              <form
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                }}
                onSubmit={handleSignUp}
              >
                <Stack position={"relative"} width={"8rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: '8rem',
                      height: '8rem',
                      objectFit: 'contain',
                    }}
                    src={avatar.preview}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>

                {avatar.error && (
                  <Typography
                    m={"1rem auto"}
                    width={"fit-content"}
                    display={"block"}
                    color="error"
                    variant="caption"
                  >
                    {avatar.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="Name"
                  margin="dense"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                  InputProps={{
                    style: { height: '40px', borderColor: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: 'rgba(0,0,0,0.7)', fontSize: '1rem' },
                  }}
                />

                <TextField
                  required
                  fullWidth
                  label="Bio"
                  margin="dense"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                  InputProps={{
                    style: { height: '40px', borderColor: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: 'rgba(0,0,0,0.7)', fontSize: '1rem' },
                  }}
                />
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="dense"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                  InputProps={{
                    style: { height: '40px', borderColor: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: 'rgba(0,0,0,0.7)', fontSize: '1rem' },
                  }}
                />

                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="dense"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                  InputProps={{
                    style: { height: '40px', borderColor: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: 'rgba(0,0,0,0.7)', fontSize: '1rem' },
                  }}
                />

                <Button
                  sx={{
                    marginTop: '0.5rem',
                    bgcolor: 'black',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'grey',
                    },
                  }}
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  Sign Up
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>

                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="text"
                  onClick={toggleLogin}
                  style={{ color: 'black' }}
                >
                  Login Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;