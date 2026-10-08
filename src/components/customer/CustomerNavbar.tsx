import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
  Divider,
  ListItemIcon,
} from "@mui/material";
import {
  AccountCircle,
  Logout,
  Email,
  Person,
  Lock,
  Home,
  Event,
  AssignmentTurnedIn,
  Description,
} from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import type { UserRole } from "../../typescript/type/auth.types";

// =====================================================
// ROLE-BASED ROUTE HELPERS
// =====================================================

const getProfileRoute = (role?: UserRole): string => {
  switch (role) {
    case "admin":
      return "/admin/profile";
    case "agent":
      return "/agent/profile";
    case "owner":
      return "/owner/profile";
    case "customer":
    default:
      return "/profile";
  }
};

const getChangePasswordRoute = (role?: UserRole): string => {
  switch (role) {
    case "admin":
      return "/admin/change-password";
    case "agent":
      return "/agent/change-password";
    case "owner":
      return "/owner/change-password";
    case "customer":
    default:
      return "/change-password";
  }
};

const getDashboardRoute = (role?: UserRole): string => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "agent":
      return "/agent/dashboard";
    case "owner":
      return "/owner/dashboard";
    case "customer":
    default:
      return "/dashboard";
  }
};

// =====================================================
// COMPONENT
// =====================================================

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleLogout = async (): Promise<void> => {
    handleClose();
    await dispatch(logout());
    navigate("/login");
  };

  const isCustomer = user?.role === "customer";

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        {/* ============ BRAND ============ */}
        <Typography
          variant="h6"
          component={Link}
          to={isAuthenticated ? getDashboardRoute(user?.role) : "/"}
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "primary.main",
            fontWeight: 700,
          }}
        >
          RealEstate{" "}
          <Typography
            component="span"
            sx={{ fontWeight: 400, color: "text.secondary" }}
          >
            {user?.role ? `• ${user.role}` : ""}
          </Typography>
        </Typography>

        {/* ============ AUTHENTICATED USER ============ */}
        {isAuthenticated ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1.5 },
            }}
          >
            {/* ---------- Dashboard ---------- */}
            <Button
              component={Link}
              to={getDashboardRoute(user?.role)}
              color="inherit"
              size="small"
              startIcon={<Home />}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              Dashboard
            </Button>

            {/* ---------- My Inquiries (CUSTOMER ONLY) ---------- */}
            {isCustomer && (
              <Button
                component={Link}
                to="/user/inquiries"
                variant="outlined"
                color="primary"
                size="small"
                startIcon={
                  <Badge color="error" variant="dot" invisible={false}>
                    <Email fontSize="small" />
                  </Badge>
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  display: { xs: "none", sm: "inline-flex" },
                }}
              >
                My Inquiries
              </Button>
            )}

            {/* ---------- My Appointments (CUSTOMER ONLY) ---------- */}
            {isCustomer && (
              <Button
                component={Link}
                to="/user/appointments"
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={
                  <Badge color="error" variant="dot" invisible={false}>
                    <Event fontSize="small" />
                  </Badge>
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  display: { xs: "none", sm: "inline-flex" },
                }}
              >
                My Appointments
              </Button>
            )}

            {/* ---------- My Rentals (CUSTOMER ONLY) ---------- */}
            {isCustomer && (
              <Button
                component={Link}
                to="/user/rental-applications"
                variant="outlined"
                color="success"
                size="small"
                startIcon={
                  <Badge color="error" variant="dot" invisible={false}>
                    <AssignmentTurnedIn fontSize="small" />
                  </Badge>
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  display: { xs: "none", sm: "inline-flex" },
                }}
              >
                My Rentals
              </Button>
            )}

            {/* ---------- My Leases (CUSTOMER ONLY) ---------- */}
            {isCustomer && (
              <Button
                component={Link}
                to="/user/leases"
                variant="outlined"
                color="info"
                size="small"
                startIcon={
                  <Badge color="error" variant="dot" invisible={false}>
                    <Description fontSize="small" />
                  </Badge>
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  display: { xs: "none", sm: "inline-flex" },
                }}
              >
                My Leases
              </Button>
            )}

            {/* ---------- Avatar / Profile Menu ---------- */}
            <IconButton onClick={handleMenu} size="large">
              {user?.image ? (
                <Avatar src={user.image} sx={{ width: 36, height: 36 }} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
                    minWidth: 220,
                    borderRadius: 2,
                    boxShadow: 3,
                  },
                },
              }}
            >
              {/* Header inside menu */}
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                }}
              >
                <Typography
                  variant="subtitle2"
                  noWrap
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {user?.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "block",
                  }}
                >
                  {user?.email}
                </Typography>
              </Box>

              <Divider />

              {/* My Inquiries (mobile fallback) */}
              {isCustomer && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/user/inquiries");
                  }}
                >
                  <ListItemIcon>
                    <Email fontSize="small" />
                  </ListItemIcon>
                  My Inquiries
                </MenuItem>
              )}

              {/* My Appointments (mobile fallback) */}
              {isCustomer && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/user/appointments");
                  }}
                >
                  <ListItemIcon>
                    <Event fontSize="small" />
                  </ListItemIcon>
                  My Appointments
                </MenuItem>
              )}

              {/* My Rentals (mobile fallback) */}
              {isCustomer && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/user/rental-applications");
                  }}
                >
                  <ListItemIcon>
                    <AssignmentTurnedIn fontSize="small" />
                  </ListItemIcon>
                  My Rentals
                </MenuItem>
              )}

              {/* My Leases (mobile fallback) */}
              {isCustomer && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/user/leases");
                  }}
                >
                  <ListItemIcon>
                    <Description fontSize="small" />
                  </ListItemIcon>
                  My Leases
                </MenuItem>
              )}

              {/* Profile */}
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate(getProfileRoute(user?.role));
                }}
              >
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>

              {/* Change Password */}
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate(getChangePasswordRoute(user?.role));
                }}
              >
                <ListItemIcon>
                  <Lock fontSize="small" />
                </ListItemIcon>
                Change Password
              </MenuItem>

              <Divider />

              {/* Logout */}
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          /* ============ GUEST ============ */
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button component={Link} to="/login" color="inherit">
              Login
            </Button>
            <Button component={Link} to="/register" variant="contained">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;