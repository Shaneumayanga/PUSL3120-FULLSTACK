import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { getData, postData } from "../api/auth";
import swal from "sweetalert";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const loginResult = await postData("api/user/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("access_token", loginResult.data.access_token);

      swal("Success!", `Login success`, "success");
      
      navigate("/")

    } catch (error) {
      swal("Oops!", `${error.response.data.data}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        maxWidth: 400,
        margin: "auto",
        padding: 3,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        backgroundColor: "#fff",
        marginTop: "20px",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 2, textAlign: "center" }}>
        Login
      </Typography>
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        required
        variant="outlined"
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        required
        variant="outlined"
        onChange={(e) => setPassword(e.target.value)}
      />
      {isLoading ? (
        <CircularProgress></CircularProgress>
      ) : (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: 2,
            backgroundColor: "#3f51b5",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Login
        </Button>
      )}
    </Box>
  );
};

export default Login;
