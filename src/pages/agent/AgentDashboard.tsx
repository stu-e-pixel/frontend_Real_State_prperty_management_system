import React from "react";
import type { ReactNode } from "react";

import { useAppSelector } from "../../hooks/useAppDispatch";

import { Paper, Typography, Box, Avatar, Link } from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

import { Person, VpnKey, People, Home } from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  link?: string;
  color: "primary" | "secondary" | "success" | "info" | "warning" | "error";
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  link,
  color,
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
      }}
    >
      {/* Card Content */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Icon */}
        <Avatar
          sx={{
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            width: 56,
            height: 56,
          }}
        >
          {icon}
        </Avatar>

        {/* Text */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            {value}
          </Typography>
        </Box>
      </Box>

      {/* Details Link */}
      {link && (
        <Link
          component={RouterLink}
          to={link}
          sx={{
            mt: 2,
            display: "block",
          }}
        >
          View Details →
        </Link>
      )}
    </Paper>
  );
};

const Dashboard: React.FC = () => {
  const { user, model } = useAppSelector((state) => state.auth);

  return (
    <MainLayout>
      {/* Welcome Section */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          {/* User Avatar */}
          <Avatar
            src={user?.image}
            sx={{
              width: 80,
              height: 80,
              fontSize: 32,
            }}
          >
            {user?.name?.charAt(0)}
          </Avatar>

          {/* User Information */}
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
              }}
            >
              Welcome, {user?.name}!
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              {user?.email} • {model}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Statistics Cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        {/* Profile */}
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "calc(50% - 12px)",
              md: "calc(25% - 18px)",
            },
          }}
        >
          <StatCard
            icon={<Person />}
            title="Profile"
            value="Manage"
            link="/profile"
            color="primary"
          />
        </Box>

        {/* Security */}
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "calc(50% - 12px)",
              md: "calc(25% - 18px)",
            },
          }}
        >
          <StatCard
            icon={<VpnKey />}
            title="Security"
            value="Password"
            link="/change-password"
            color="warning"
          />
        </Box>

        {/* Admin Cards */}
        {user?.role === "admin" && (
          <>
            {/* Agents */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                  md: "calc(25% - 18px)",
                },
              }}
            >
              <StatCard
                icon={<People />}
                title="Agents"
                value="Manage"
                link="/admin/agents"
                color="success"
              />
            </Box>

            {/* Owners */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                  md: "calc(25% - 18px)",
                },
              }}
            >
              <StatCard
                icon={<Home />}
                title="Owners"
                value="Manage"
                link="/admin/owners"
                color="info"
              />
            </Box>
          </>
        )}
      </Box>
    </MainLayout>
  );
};

export default Dashboard;
