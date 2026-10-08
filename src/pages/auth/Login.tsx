import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import { Box, Paper, Typography, Link, Divider } from "@mui/material";

import { LoadingButton } from "@mui/lab";
import { Login as LoginIcon } from "@mui/icons-material";

import FormInput from "../../components/common/FormInput";
import { loginSchema } from "../../utils/validations";
import { login, clearError } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type { LoginFormValues } from "../../typescript/type/auth.types";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Clear auth error when leaving the page
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Login submit
  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    const result = await dispatch(login(data)).unwrap();
    

    console.log("role", result.data.user?.role);

    if (result.data.user?.role === "admin") {
      navigate("/admin/dashboard");
    } else if (result.data.user?.role === "agent") {
      navigate("/agent/dashboard");
    } else if (result.data.user?.role === "owner") {
      navigate("/owner/dashboard");
    } else if (result.data.user?.role === "customer") {
      navigate("/user");
    } else {
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 450,
          width: "100%",
          borderRadius: 3,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            textAlign: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 1,
            }}
          >
            Sign in to your account to continue
          </Typography>
        </Box>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <FormInput<LoginFormValues>
            name="email"
            control={control}
            label="Email Address"
            type="email"
          />

          {/* Password */}
          <FormInput<LoginFormValues>
            name="password"
            control={control}
            label="Password"
            type="password"
          />

          {/* Forgot Password */}
          <Box
            sx={{
              textAlign: "right",
              mb: 2,
            }}
          >
            <Link
              component={RouterLink}
              to="/forgot-password"
              variant="body2"
              underline="hover"
            >
              Forgot Password?
            </Link>
          </Box>

          {/* Login Button */}
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            loading={loading}
            startIcon={<LoginIcon />}
            sx={{
              py: 1.5,
              mb: 2,
            }}
          >
            Sign In
          </LoadingButton>
        </form>

        {/* Divider */}
        <Divider
          sx={{
            my: 2,
          }}
        >
          OR
        </Divider>

        {/* Normal Registration */}
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
          }}
        >
          Don't have an account?{" "}
          <Link
            component={RouterLink}
            to="/register"
            sx={{
              fontWeight: 600,
            }}
          >
            Register here
          </Link>
        </Typography>

        {/* Agent / Owner Registration */}
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            mt: 1,
          }}
        >
          <Link
            component={RouterLink}
            to="/agent/register"
            sx={{
              fontWeight: 600,
            }}
          >
            Register as Agent
          </Link>

          {" | "}

          <Link
            component={RouterLink}
            to="/owner/register"
            sx={{
              fontWeight: 600,
            }}
          >
            Register as Owner
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
