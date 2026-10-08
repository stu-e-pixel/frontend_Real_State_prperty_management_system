import React, { useState } from "react";
import type { ChangeEvent } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Link,
  Avatar,
  IconButton,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import { PhotoCamera, PersonAdd } from "@mui/icons-material";

import FormInput from "../../components/common/FormInput";
import { registerSchema } from "../../utils/validations";
import { register } from "../../features/auth/authSlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type {
  AuthFormValues,
  RegisterData,
} from "../../typescript/type/auth.types";

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading } = useAppSelector((state) => state.auth);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);

  // React Hook Form
  const { control, handleSubmit } = useForm<AuthFormValues>({
    resolver: yupResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  // Image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  // Submit registration
  const onSubmit = async (data: AuthFormValues): Promise<void> => {
    const registerData: RegisterData = {
      ...data,

      ...(imageFile && {
        image: [imageFile],
      }),
    };

    const result = await dispatch(register(registerData));

    if (register.fulfilled.match(result)) {
      navigate("/verify-email", {
        state: {
          email: data.email,
        },
      });
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
          maxWidth: 500,
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
            Create Account
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 1,
            }}
          >
            Register as a customer
          </Typography>
        </Box>

        {/* Profile Image */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Avatar
            src={imagePreview ?? undefined}
            sx={{
              width: 100,
              height: 100,
              mb: 1,
            }}
          />

          {/* Hidden file input */}
          <input
            accept="image/*"
            style={{
              display: "none",
            }}
            id="image-upload"
            type="file"
            onChange={handleImageChange}
          />

          {/* Image upload button */}
          <label htmlFor="image-upload">
            <IconButton color="primary" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <FormInput<AuthFormValues>
            name="name"
            control={control}
            label="Full Name"
          />

          {/* Email */}
          <FormInput<AuthFormValues>
            name="email"
            control={control}
            label="Email Address"
            type="email"
          />

          {/* Phone */}
          <FormInput<AuthFormValues>
            name="phone"
            control={control}
            label="Phone Number"
          />

          {/* Password */}
          <FormInput<AuthFormValues>
            name="password"
            control={control}
            label="Password"
            type="password"
          />

          {/* Confirm Password */}
          <FormInput<AuthFormValues>
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            type="password"
          />

          {/* Register Button */}
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            loading={loading}
            startIcon={<PersonAdd />}
            sx={{
              py: 1.5,
              mb: 2,
            }}
          >
            Register
          </LoadingButton>
        </form>

        {/* Login Link */}
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            sx={{
              fontWeight: 600,
            }}
          >
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
