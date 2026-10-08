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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  TextField,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";
import { PhotoCamera, PersonAdd } from "@mui/icons-material";

import FormInput from "../../components/common/FormInput";

import { agentRegisterSchema } from "../../utils/validations";
import { createAgent } from "../../features/agent/agentSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/useAppDispatch";

import type {
  AgentRegisterFormValues,
  AgentRegisterData,
} from "../../typescript/type/agent.types";

const specializationOptions = [
  "Residential",
  "Commercial",
  "Land",
  "Rental",
  "Luxury",
];

const AgentRegister: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading } = useAppSelector(
    (state) => state.agent
  );

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AgentRegisterFormValues>({
    resolver: yupResolver(agentRegisterSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      licenseNumber: "",
      agencyName: "",
      experience: 0,

      // Array because backend expects an array
      specialization: [],

      bio: "",

      // Address will be converted to object before submit
      address: {
        street: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
      },
    },
  });

  const selectedSpecializations =
    watch("specialization") || [];

  // ==============================
  // Image Upload
  // ==============================

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  // ==============================
  // Submit
  // ==============================

  const onSubmit = async (
    data: AgentRegisterFormValues
  ): Promise<void> => {
    const agentData: AgentRegisterData = {
      ...data,

      // Make sure specialization is an array
      specialization: Array.isArray(data.specialization)
        ? data.specialization
        : data.specialization
        ? [data.specialization]
        : [],

      // Make sure address is an object
      address: {
        street: data.address?.street || "",
        city: data.address?.city || "",
        state: data.address?.state || "",
        country: data.address?.country || "India",
        pincode: data.address?.pincode || "",
      },

      ...(imageFile && {
        image: [imageFile],
      }),
    };

    const result = await dispatch(
      createAgent(agentData)
    );

    if (createAgent.fulfilled.match(result)) {
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
          maxWidth: 800,
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
            Agent Registration
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 1,
            }}
          >
            Join as a real estate agent
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
            style={{
              display: "none",
            }}
            id="agent-image-upload"
            type="file"
            onChange={handleImageChange}
          />

          <label htmlFor="agent-image-upload">
            <IconButton
              color="primary"
              component="span"
            >
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
            {/* Name */}

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<AgentRegisterFormValues>
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
              <FormInput<AgentRegisterFormValues>
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
              <FormInput<AgentRegisterFormValues>
                name="phone"
                control={control}
                label="Phone"
              />
            </Box>

            {/* License Number */}

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<AgentRegisterFormValues>
                name="licenseNumber"
                control={control}
                label="License Number"
              />
            </Box>

            {/* Agency Name */}

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<AgentRegisterFormValues>
                name="agencyName"
                control={control}
                label="Agency Name"
              />
            </Box>

            {/* Experience */}

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<AgentRegisterFormValues>
                name="experience"
                control={control}
                label="Experience (years)"
                type="number"
              />
            </Box>

            {/* Specialization */}

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormControl
                fullWidth
                size="small"
                error={Boolean(errors.specialization)}
              >
                <InputLabel>
                  Specialization
                </InputLabel>

                <Select
                  multiple
                  value={selectedSpecializations}
                  onChange={(event) => {
                    const value =
                      event.target.value;

                    setValue(
                      "specialization",
                      typeof value === "string"
                        ? value.split(",")
                        : value,
                      {
                        shouldValidate: true,
                      }
                    );
                  }}
                  input={
                    <OutlinedInput label="Specialization" />
                  }
                  renderValue={(selected) => (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                      }}
                    >
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {specializationOptions.map(
                    (specialization) => (
                      <MenuItem
                        key={specialization}
                        value={specialization}
                      >
                        {specialization}
                      </MenuItem>
                    )
                  )}
                </Select>

                {errors.specialization && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "error.main",
                      mt: 0.5,
                      ml: 1.5,
                    }}
                  >
                    {errors.specialization.message}
                  </Typography>
                )}
              </FormControl>
            </Box>

            {/* Street */}

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <TextField
                fullWidth
                size="small"
                label="Street"
                {...register("address.street")}
                error={Boolean(
                  errors.address?.street
                )}
                helperText={
                  errors.address?.street?.message
                }
              />
            </Box>

            {/* City */}

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <TextField
                fullWidth
                size="small"
                label="City"
                {...register("address.city")}
                error={Boolean(
                  errors.address?.city
                )}
                helperText={
                  errors.address?.city?.message
                }
              />
            </Box>

            {/* State */}

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <TextField
                fullWidth
                size="small"
                label="State"
                {...register("address.state")}
                error={Boolean(
                  errors.address?.state
                )}
                helperText={
                  errors.address?.state?.message
                }
              />
            </Box>

            {/* Country */}

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <TextField
                fullWidth
                size="small"
                label="Country"
                {...register("address.country")}
                defaultValue="India"
                error={Boolean(
                  errors.address?.country
                )}
                helperText={
                  errors.address?.country?.message
                }
              />
            </Box>

            {/* Pincode */}

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <TextField
                fullWidth
                size="small"
                label="Pincode"
                {...register("address.pincode")}
                error={Boolean(
                  errors.address?.pincode
                )}
                helperText={
                  errors.address?.pincode?.message
                }
              />
            </Box>

            {/* Bio */}

            <Box
              sx={{
                width: "100%",
              }}
            >
              <FormInput<AgentRegisterFormValues>
                name="bio"
                control={control}
                label="Bio"
                multiline
                rows={3}
              />
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
              <FormInput<AgentRegisterFormValues>
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
              <FormInput<AgentRegisterFormValues>
                name="confirmPassword"
                control={control}
                label="Confirm Password"
                type="password"
              />
            </Box>
          </Box>

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
              mt: 3,
              mb: 2,
            }}
          >
            Register as Agent
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

export default AgentRegister;