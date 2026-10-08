import React, { useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useNavigate, useLocation } from "react-router-dom";

import { Box, Paper, Typography, Button } from "@mui/material";

import { LoadingButton } from "@mui/lab";

import { VerifiedUser } from "@mui/icons-material";

import FormInput from "../../components/common/FormInput";

import { verifyEmailSchema } from "../../utils/validations";

import {
  verifyEmail,
  resendOTP,
  clearError,
} from "../../features/auth/authSlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type { VerifyEmailFormValues } from "../../typescript/type/auth.types";

interface LocationState {
  email?: string;
}

const VerifyEmail: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading } = useAppSelector((state) => state.auth);

  const email = (location.state as LocationState | null)?.email || "";

  // React Hook Form
  const { control, handleSubmit, setValue } = useForm<VerifyEmailFormValues>({
    resolver: yupResolver(verifyEmailSchema),

    defaultValues: {
      email,
      otp: "",
    },
  });

  // Set email from navigation state
  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
  }, [email, setValue]);

  // Clear auth error when leaving page
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Verify email
  const onSubmit = async (data: VerifyEmailFormValues): Promise<void> => {
    const result = await dispatch(verifyEmail(data));

    if (verifyEmail.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  // Resend OTP
  const handleResendOTP = (): void => {
    dispatch(
      resendOTP({
        email,
      }),
    );
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
          <VerifiedUser
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
            Verify Your Email
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 1,
            }}
          >
            Enter the 6-digit OTP sent to your email
          </Typography>
        </Box>

        {/* Verify Email Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <FormInput<VerifyEmailFormValues>
            name="email"
            control={control}
            label="Email"
            type="email"
            disabled={!!email}
          />

          {/* OTP */}
          <FormInput<VerifyEmailFormValues>
            name="otp"
            control={control}
            label="OTP"
            slotProps={{
              htmlInput: {
                maxLength: 6,
              },
            }}
          />

          {/* Verify Button */}
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
            Verify Email
          </LoadingButton>
        </form>

        {/* Resend OTP */}
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 1,
            }}
          >
            Didn't receive the OTP?
          </Typography>

          <Button variant="text" onClick={handleResendOTP}>
            Resend OTP
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
