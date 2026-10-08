
import React from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  useNavigate,
  useParams,
  Link as RouterLink,
} from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Link,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";
import { Lock } from "@mui/icons-material";

import FormInput from "../../components/common/FormInput";

import {
  resetPasswordSchema,
} from "../../utils/validations";

import {
  resetPassword,
} from "../../features/auth/authSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/useAppDispatch";

import type {
  ResetPasswordFormValues,
} from "../../typescript/type/auth.types";

const ResetPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id, token } = useParams<{
    id: string;
    token: string;
  }>();

  const { loading } = useAppSelector(
    (state) => state.auth
  );

  // React Hook Form
  const {
    control,
    handleSubmit,
  } = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordSchema),

    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  // Submit
  const onSubmit = async (
    data: ResetPasswordFormValues
  ): Promise<void> => {
    if (!id || !token) {
      return;
    }

    const result = await dispatch(
      resetPassword({
        id,
        token,
        data,
      })
    );

    if (resetPassword.fulfilled.match(result)) {
      navigate("/login");
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
          <Lock
            sx={{
              fontSize: 60,
              color: "primary.main",
              mb: 1,
            }}
          />

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
            }}
          >
            Reset Password
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 1,
            }}
          >
            Enter your new password
          </Typography>
        </Box>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* New Password */}
          <FormInput<ResetPasswordFormValues>
            name="password"
            control={control}
            label="New Password"
            type="password"
          />

          {/* Confirm Password */}
          <FormInput<ResetPasswordFormValues>
            name="confirm_password"
            control={control}
            label="Confirm New Password"
            type="password"
          />

          {/* Reset Button */}
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            loading={loading}
            sx={{
              py: 1.5,
              mb: 2,
            }}
          >
            Reset Password
          </LoadingButton>
        </form>

        {/* Back to Login */}
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
          }}
        >
          <Link
            component={RouterLink}
            to="/login"
            sx={{
              fontWeight: 600,
            }}
          >
            Back to Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ResetPassword;