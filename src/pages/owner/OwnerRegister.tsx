import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Link,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { PhotoCamera, Home } from "@mui/icons-material";

import FormInput from "../../components/common/FormInput";
import { ownerRegisterSchema } from "../../utils/validations";
import { createOwner } from "../../features/owner/ownerSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type {
  OwnerRegisterFormValues,
  OwnerRegisterData,
} from "../../typescript/type/owner.types";

const OwnerRegister: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading } = useAppSelector((state) => state.owner);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { control, handleSubmit } = useForm<OwnerRegisterFormValues>({
    resolver: yupResolver(ownerRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",

      address: {
        street: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
      },
    },
  });

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

  const onSubmit = async (data: OwnerRegisterFormValues): Promise<void> => {
    const { ...rest } = data;

    const ownerData: OwnerRegisterData = {
      ...rest,
      ...(imageFile && { image: [imageFile] }),
    };

    const result = await dispatch(createOwner(ownerData));

    if (createOwner.fulfilled.match(result)) {
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
        sx={{
          p: 4,
          maxWidth: 550,
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
            Owner Registration
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 1,
            }}
          >
            List your properties as an owner
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

          <input
            accept="image/*"
            style={{ display: "none" }}
            id="owner-image-upload"
            type="file"
            onChange={handleImageChange}
          />

          <label htmlFor="owner-image-upload">
            <IconButton color="primary" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Full Name */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<OwnerRegisterFormValues>
                name="name"
                control={control}
                label="Full Name"
              />
            </Box>

            {/* Email */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<OwnerRegisterFormValues>
                name="email"
                control={control}
                label="Email"
                type="email"
              />
            </Box>

            {/* Phone */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<OwnerRegisterFormValues>
                name="phone"
                control={control}
                label="Phone"
              />
            </Box>

            {/* Address */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Address
                </Typography>
              </Box>

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 8px)",
                  },
                }}
              >
                <FormInput<OwnerRegisterFormValues>
                  name="address.street"
                  control={control}
                  label="Street"
                />
              </Box>

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 8px)",
                  },
                }}
              >
                <FormInput<OwnerRegisterFormValues>
                  name="address.city"
                  control={control}
                  label="City"
                />
              </Box>

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 8px)",
                  },
                }}
              >
                <FormInput<OwnerRegisterFormValues>
                  name="address.state"
                  control={control}
                  label="State"
                />
              </Box>

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 8px)",
                  },
                }}
              >
                <FormInput<OwnerRegisterFormValues>
                  name="address.country"
                  control={control}
                  label="Country"
                />
              </Box>

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 8px)",
                  },
                }}
              >
                <FormInput<OwnerRegisterFormValues>
                  name="address.pincode"
                  control={control}
                  label="Pincode"
                />
              </Box>
            </Box>

            {/* Password */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<OwnerRegisterFormValues>
                name="password"
                control={control}
                label="Password"
                type="password"
              />
            </Box>

            {/* Confirm Password */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<OwnerRegisterFormValues>
                name="confirmPassword"
                control={control}
                label="Confirm Password"
                type="password"
              />
            </Box>
          </Box>

          {/* Submit Button */}
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            loading={loading}
            startIcon={<Home />}
            sx={{
              py: 1.5,
              mt: 3,
              mb: 2,
            }}
          >
            Register as Owner
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

export default OwnerRegister;
