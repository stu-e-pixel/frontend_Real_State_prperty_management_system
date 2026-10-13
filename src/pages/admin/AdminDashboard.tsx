import React, { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from "@mui/material";

import {
  People,
  Business,
  VerifiedUser,
  Apartment,
  Email,
  Event,
  Description,
  ReceiptLong,
  Star,
  ArrowForward,
  CheckCircle,
  Pending,
  AttachMoney,
  TrendingUp,
  AdminPanelSettings,
  Schedule,
  RateReview,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { getAllUsers } from "../../features/user/userSlice";
import { getAllOwners } from "../../features/owner/ownerSlice";
import { getAllAgents } from "../../features/agent/agentSlice";
import { getAllProperties } from "../../features/property/propertySlice";
import { getAllInquiries } from "../../features/inquiry/inquirySlice";
import { getAllAppointments } from "../../features/appointment/appointmentSlice";
import { getAllReviews } from "../../features/review/reviewSlice";

// =====================================================
// THEME
// =====================================================

const COLORS = {
  navy: "#0f172a",
  teal: "#134e4a",
  emerald: "#0f766e",
  emeraldHover: "#115e59",
  mint: "#ecfdf5",
  border: "#dbe7e4",
  slate: "#64748b",
  background: "#f8fafc",
  white: "#ffffff",
};

// =====================================================
// TYPES
// =====================================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subtitle?: string;
  color: string;
  path: string;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  path: string;
  color: string;
}

// =====================================================
// STAT CARD
// =====================================================

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subtitle,
  color,
  path,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(path)}
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: "18px",
        cursor: "pointer",
        bgcolor: COLORS.white,
        border: `1px solid ${COLORS.border}`,
        boxShadow: "0 3px 12px rgba(15, 23, 42, 0.025)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
          borderColor: color,
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 1.8, sm: 2.3 },
          "&:last-child": { pb: { xs: 1.8, sm: 2.3 } },
        }}
      >
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: "14px",
            bgcolor: `${color}15`,
            color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            "& svg": { fontSize: 25 },
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.55rem", sm: "1.85rem" },
            lineHeight: 1.2,
            fontWeight: 800,
            letterSpacing: "-0.8px",
            color: COLORS.navy,
            mb: 0.7,
            overflowWrap: "anywhere",
          }}
        >
          {value}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.84rem",
            fontWeight: 700,
            color: "#334155",
            mb: 0.5,
          }}
        >
          {label}
        </Typography>

        {subtitle && (
          <Typography
            sx={{
              fontSize: "0.73rem",
              color: COLORS.slate,
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// =====================================================
// SECTION HEADING
// =====================================================

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  icon,
}) => (
  <Box sx={{ mb: 2.2 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {icon && (
        <Box
          sx={{
            color: COLORS.emerald,
            display: "flex",
            alignItems: "center",
            "& svg": { fontSize: 23 },
          }}
        >
          {icon}
        </Box>
      )}

      <Typography
        sx={{
          fontSize: { xs: "1.05rem", sm: "1.2rem" },
          fontWeight: 800,
          color: COLORS.navy,
          letterSpacing: "-0.3px",
        }}
      >
        {title}
      </Typography>
    </Box>

    {subtitle && (
      <Typography
        sx={{
          mt: 0.5,
          fontSize: "0.82rem",
          color: COLORS.slate,
        }}
      >
        {subtitle}
      </Typography>
    )}
  </Box>
);

// =====================================================
// EMPTY STATE
// =====================================================

interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, message }) => (
  <Box
    sx={{
      py: 4,
      px: 2,
      textAlign: "center",
      color: COLORS.slate,
    }}
  >
    <Box
      sx={{
        width: 54,
        height: 54,
        mx: "auto",
        mb: 1.5,
        borderRadius: "50%",
        bgcolor: COLORS.mint,
        color: COLORS.emerald,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& svg": { fontSize: 28 },
      }}
    >
      {icon}
    </Box>

    <Typography sx={{ fontSize: "0.87rem", fontWeight: 600 }}>
      {message}
    </Typography>
  </Box>
);

// =====================================================
// ADMIN DASHBOARD
// =====================================================

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // =====================================================
  // REDUX STATE
  // =====================================================

  const { user } = useAppSelector((state) => state.auth);

  const { users } = useAppSelector((state) => state.user);
  const { owners } = useAppSelector((state) => state.owner);
  const { agents } = useAppSelector((state) => state.agent);

  const { properties, loading: loadingProperties } = useAppSelector(
    (state) => state.property
  );

  const { inquiries } = useAppSelector((state) => state.inquiry);
  const { appointments } = useAppSelector((state) => state.appointment);
  const { saleOffers } = useAppSelector((state) => state.saleOffer);
  const { reviews } = useAppSelector((state) => state.review);

  // =====================================================
  // FETCH PLATFORM DATA
  // =====================================================

  useEffect(() => {
    dispatch(getAllUsers({ page: 1, limit: 100, role: "customer" }));
    dispatch(getAllOwners({ page: 1, limit: 100 }));
    dispatch(getAllAgents({ page: 1, limit: 100 }));
    dispatch(getAllProperties({ page: 1, limit: 100 }));
    dispatch(getAllInquiries());
    dispatch(getAllAppointments());
    dispatch(getAllReviews());
  }, [dispatch]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalCustomers = users?.length ?? 0;
  const totalOwners = owners?.length ?? 0;
  const totalAgents = agents?.length ?? 0;
  const totalProperties = properties?.length ?? 0;
  const totalInquiries = inquiries?.length ?? 0;
  const totalAppointments = appointments?.length ?? 0;
  const totalOffers = saleOffers?.length ?? 0;
  const totalReviews = reviews?.length ?? 0;

  const approvedProperties =
    properties?.filter((property) => property.approvalStatus === "Approved")
      .length ?? 0;

  const pendingProperties =
    properties?.filter((property) => property.approvalStatus === "Pending")
      .length ?? 0;

  const pendingReviews =
    reviews?.filter((review) => review.status === "pending").length ?? 0;

  const avgRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
          totalReviews
        ).toFixed(1)
      : "—";

  // Portfolio value for approved listings
  const totalPortfolioValue =
    properties
      ?.filter((property) => property.approvalStatus === "Approved")
      .reduce((sum, property) => sum + (Number(property.price) || 0), 0) ?? 0;

  const totalPortfolioFormatted =
    totalPortfolioValue > 0
      ? `$${(totalPortfolioValue / 1_000_000).toFixed(2)}M`
      : "$0";

  // Most recent pending reviews
  const recentPendingReviews = [...(reviews ?? [])]
    .filter((review) => review.status === "pending")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  // Most recent pending properties
  const recentPendingProperties = [...(properties ?? [])]
    .filter((property) => property.approvalStatus === "Pending")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  // =====================================================
  // QUICK ACTIONS
  // =====================================================

  const quickActions: QuickAction[] = [
    {
      icon: <People />,
      label: "Users",
      path: "/admin/users",
      color: "#3b82f6",
    },
    {
      icon: <Business />,
      label: "Owners",
      path: "/admin/owners",
      color: "#0f766e",
    },
    {
      icon: <VerifiedUser />,
      label: "Agents",
      path: "/admin/agents",
      color: "#7c3aed",
    },
    {
      icon: <Apartment />,
      label: "Approvals",
      path: "/admin/properties",
      color: "#d97706",
    },
    {
      icon: <Email />,
      label: "Inquiries",
      path: "/admin/inquiries",
      color: "#0891b2",
    },
    {
      icon: <Event />,
      label: "Appointments",
      path: "/admin/appointments",
      color: "#db2777",
    },
    {
      icon: <Description />,
      label: "Leases",
      path: "/admin/AllLeases",
      color: "#6366f1",
    },
    {
      icon: <ReceiptLong />,
      label: "Transactions",
      path: "/admin/sale-transactions",
      color: "#0d9488",
    },
    {
      icon: <Star />,
      label: "Reviews",
      path: "/admin/allreview",
      color: "#ca8a04",
    },
  ];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        bgcolor: COLORS.background,
        p: { xs: 1.5, sm: 2.5, md: 3 },
        borderRadius: { xs: 2, md: 3 },
      }}
    >
      {/* ================= WELCOME HEADER ================= */}

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          p: { xs: 2.5, sm: 3.5, md: 4 },
          mb: 4,
          borderRadius: "24px",
          color: COLORS.white,
          background:
            "linear-gradient(120deg, #0f172a 0%, #134e4a 52%, #0f766e 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Decorative shapes */}
        <Box
          sx={{
            position: "absolute",
            width: 270,
            height: 270,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            top: -130,
            right: -55,
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 190,
            height: 190,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.045)",
            bottom: -120,
            right: 125,
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              minWidth: 0,
            }}
          >
            <Avatar
              src={user?.image || undefined}
              alt={user?.name || "Admin"}
              sx={{
                width: { xs: 55, sm: 68 },
                height: { xs: 55, sm: 68 },
                bgcolor: "rgba(255,255,255,0.13)",
                color: COLORS.white,
                fontSize: 27,
                fontWeight: 800,
                border: "2px solid rgba(255,255,255,0.35)",
                boxShadow: "0 5px 18px rgba(0,0,0,0.12)",
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Chip
                icon={<AdminPanelSettings />}
                label="ADMIN WORKSPACE"
                size="small"
                sx={{
                  mb: 1,
                  bgcolor: "rgba(209,250,229,0.14)",
                  color: "#d1fae5",
                  fontWeight: 800,
                  fontSize: "0.67rem",
                  letterSpacing: "1px",
                  "& .MuiChip-icon": {
                    color: "#a7f3d0",
                    fontSize: 16,
                  },
                }}
              />

              <Typography
                sx={{
                  fontSize: { xs: "1.55rem", sm: "2rem", md: "2.25rem" },
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: "-0.9px",
                }}
              >
                Welcome{user?.name ? `, ${user.name}` : " back"}!
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  color: "rgba(255,255,255,0.76)",
                  lineHeight: 1.6,
                }}
              >
                Manage your real-estate platform from one place.
              </Typography>

              <Typography
                sx={{
                  mt: 1.2,
                  fontSize: "0.78rem",
                  color: "#a7f3d0",
                  fontWeight: 600,
                }}
              >
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.2,
            }}
          >
            {pendingProperties > 0 && (
              <Chip
                icon={<Pending />}
                label={`${pendingProperties} Pending Properties`}
                onClick={() => navigate("/admin/properties")}
                sx={{
                  height: 38,
                  bgcolor: "rgba(255,255,255,0.13)",
                  color: COLORS.white,
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid rgba(255,255,255,0.17)",
                  "& .MuiChip-icon": { color: "#fde68a" },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
                }}
              />
            )}

            {pendingReviews > 0 && (
              <Chip
                icon={<RateReview />}
                label={`${pendingReviews} Pending Reviews`}
                onClick={() => navigate("/admin/allreview")}
                sx={{
                  height: 38,
                  bgcolor: "rgba(255,255,255,0.13)",
                  color: COLORS.white,
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid rgba(255,255,255,0.17)",
                  "& .MuiChip-icon": { color: "#fde68a" },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
                }}
              />
            )}
          </Box>
        </Box>
      </Paper>

      {/* ================= PLATFORM OVERVIEW ================= */}

      <SectionHeading
        title="Platform Overview"
        subtitle="A snapshot of your real-estate platform."
        icon={<TrendingUp />}
      />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
          "& > *": {
            width: {
              xs: "calc(50% - 8px)",
              sm: "calc(33.333% - 11px)",
              lg: "calc(16.6667% - 14px)",
            },
          },
        }}
      >
        <StatCard
          icon={<People />}
          label="Customers"
          value={totalCustomers}
          color="#2563eb"
          path="/admin/users"
        />

        <StatCard
          icon={<Business />}
          label="Owners"
          value={totalOwners}
          color="#0f766e"
          path="/admin/owners"
        />

        <StatCard
          icon={<VerifiedUser />}
          label="Agents"
          value={totalAgents}
          color="#7c3aed"
          path="/admin/agents"
        />

        <StatCard
          icon={<Apartment />}
          label="Properties"
          value={totalProperties}
          subtitle={`${approvedProperties} approved`}
          color="#d97706"
          path="/admin/properties"
        />

        <StatCard
          icon={<Email />}
          label="Inquiries"
          value={totalInquiries}
          color="#0891b2"
          path="/admin/inquiries"
        />

        <StatCard
          icon={<Event />}
          label="Appointments"
          value={totalAppointments}
          color="#db2777"
          path="/admin/appointments"
        />
      </Box>

      {/* ================= BUSINESS METRICS ================= */}

      <SectionHeading
        title="Business Metrics"
        subtitle="Property value, approvals and customer feedback."
        icon={<AttachMoney />}
      />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
          "& > *": {
            width: {
              xs: "calc(50% - 8px)",
              sm: "calc(50% - 8px)",
              md: "calc(25% - 12px)",
            },
          },
        }}
      >
        <StatCard
          icon={<AttachMoney />}
          label="Portfolio Value"
          value={totalPortfolioFormatted}
          subtitle="Approved listings value"
          color="#059669"
          path="/admin/properties"
        />

        <StatCard
          icon={<Pending />}
          label="Pending Approvals"
          value={pendingProperties}
          subtitle="Awaiting review"
          color="#d97706"
          path="/admin/properties"
        />

        <StatCard
          icon={<ReceiptLong />}
          label="Sale Offers"
          value={totalOffers}
          subtitle="Platform-wide offers"
          color="#6366f1"
          path="/admin/sale-transactions"
        />

        <StatCard
          icon={<Star />}
          label="Average Rating"
          value={avgRating}
          subtitle={`${totalReviews} total reviews`}
          color="#ca8a04"
          path="/admin/allreview"
        />
      </Box>

      {/* ================= MODERATION QUEUE ================= */}

      <SectionHeading
        title="Moderation Center"
        subtitle="Review pending listings and customer feedback."
        icon={<CheckCircle />}
      />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "stretch",
          gap: 2.5,
          mb: 4,
          "& > *": {
            width: { xs: "100%", lg: "calc(50% - 10px)" },
            minWidth: 0,
          },
        }}
      >
        {/* PENDING PROPERTIES */}

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.7 },
            borderRadius: "20px",
            border: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.white,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  bgcolor: "#fffbeb",
                  color: "#d97706",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Apartment />
              </Box>

              <Box>
                <Typography
                  sx={{ fontWeight: 800, color: COLORS.navy, fontSize: "1rem" }}
                >
                  Properties Awaiting Approval
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: COLORS.slate }}>
                  Check new property submissions
                </Typography>
              </Box>
            </Box>

            {pendingProperties > 0 && (
              <Chip
                label={pendingProperties}
                size="small"
                sx={{
                  bgcolor: "#fef3c7",
                  color: "#92400e",
                  fontWeight: 800,
                }}
              />
            )}
          </Box>

          <Divider sx={{ borderColor: "#edf2f7", mb: 1 }} />

          {loadingProperties && recentPendingProperties.length === 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, py: 1 }}>
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} variant="rounded" height={65} />
              ))}
            </Box>
          ) : recentPendingProperties.length === 0 ? (
            <EmptyState
              icon={<CheckCircle />}
              message="All properties have been reviewed!"
            />
          ) : (
            <List disablePadding>
              {recentPendingProperties.map((property, index) => (
                <ListItem
                  key={property._id}
                  disableGutters
                  sx={{
                    py: 1.6,
                    gap: 1,
                    alignItems: "center",
                    borderBottom:
                      index < recentPendingProperties.length - 1
                        ? "1px solid #edf2f7"
                        : "none",
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 50 }}>
                    <Avatar
                      src={property.images?.[0]?.image || undefined}
                      variant="rounded"
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: "#fef3c7",
                        color: "#b45309",
                        borderRadius: "12px",
                      }}
                    >
                      <Apartment />
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    sx={{ minWidth: 0, mr: 0.5 }}
                    primary={
                      <Typography
                        sx={{
                          fontSize: "0.87rem",
                          fontWeight: 800,
                          color: COLORS.navy,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {property.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: COLORS.slate,
                          mt: 0.4,
                        }}
                      >
                        {property.propertyType} • $
                        {Number(property.price || 0).toLocaleString()}
                      </Typography>
                    }
                  />

                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => navigate("/admin/properties")}
                    sx={{
                      flexShrink: 0,
                      borderRadius: "9px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: "#d97706",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "#b45309",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Review
                  </Button>
                </ListItem>
              ))}
            </List>
          )}

          <Button
            fullWidth
            endIcon={<ArrowForward />}
            onClick={() => navigate("/admin/properties")}
            sx={{
              mt: 1.5,
              py: 1,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              color: COLORS.emerald,
              bgcolor: COLORS.mint,
              "&:hover": { bgcolor: "#d1fae5" },
            }}
          >
            View All Properties
          </Button>
        </Paper>

        {/* PENDING REVIEWS */}

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.7 },
            borderRadius: "20px",
            border: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.white,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  bgcolor: "#fffbeb",
                  color: "#ca8a04",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Star />
              </Box>

              <Box>
                <Typography
                  sx={{ fontWeight: 800, color: COLORS.navy, fontSize: "1rem" }}
                >
                  Reviews Awaiting Moderation
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: COLORS.slate }}>
                  Check customer feedback
                </Typography>
              </Box>
            </Box>

            {pendingReviews > 0 && (
              <Chip
                label={pendingReviews}
                size="small"
                sx={{
                  bgcolor: "#fef3c7",
                  color: "#92400e",
                  fontWeight: 800,
                }}
              />
            )}
          </Box>

          <Divider sx={{ borderColor: "#edf2f7", mb: 1 }} />

          {recentPendingReviews.length === 0 ? (
            <EmptyState
              icon={<CheckCircle />}
              message="All reviews have been moderated!"
            />
          ) : (
            <List disablePadding>
              {recentPendingReviews.map((review, index) => {
                const reviewerName =
                  typeof review.user === "object" &&
                  review.user !== null &&
                  "name" in review.user
                    ? String(review.user.name || "Customer")
                    : "Customer";

                return (
                  <ListItem
                    key={review._id}
                    disableGutters
                    sx={{
                      py: 1.6,
                      gap: 1,
                      alignItems: "center",
                      borderBottom:
                        index < recentPendingReviews.length - 1
                          ? "1px solid #edf2f7"
                          : "none",
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 50 }}>
                      <Avatar
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "12px",
                          bgcolor: "#fef3c7",
                          color: "#a16207",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                        }}
                      >
                        {Number(review.rating || 0).toFixed(1)}★
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      sx={{ minWidth: 0, mr: 0.5 }}
                      primary={
                        <Typography
                          sx={{
                            fontSize: "0.87rem",
                            fontWeight: 800,
                            color: COLORS.navy,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {review.comment || "No written comment"}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: COLORS.slate,
                            mt: 0.4,
                          }}
                        >
                          {reviewerName} •{" "}
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                      }
                    />

                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate("/admin/allreview")}
                      sx={{
                        flexShrink: 0,
                        borderRadius: "9px",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        bgcolor: "#d97706",
                        boxShadow: "none",
                        "&:hover": {
                          bgcolor: "#b45309",
                          boxShadow: "none",
                        },
                      }}
                    >
                      Review
                    </Button>
                  </ListItem>
                );
              })}
            </List>
          )}

          <Button
            fullWidth
            endIcon={<ArrowForward />}
            onClick={() => navigate("/admin/allreview")}
            sx={{
              mt: 1.5,
              py: 1,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              color: COLORS.emerald,
              bgcolor: COLORS.mint,
              "&:hover": { bgcolor: "#d1fae5" },
            }}
          >
            View All Reviews
          </Button>
        </Paper>
      </Box>

      {/* ================= QUICK ACTIONS ================= */}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: "20px",
          border: `1px solid ${COLORS.border}`,
          bgcolor: COLORS.white,
        }}
      >
        <SectionHeading
          title="Quick Actions"
          subtitle="Jump directly to frequently used admin sections."
          icon={<Schedule />}
        />

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            "& > *": {
              width: {
                xs: "calc(50% - 6px)",
                sm: "calc(33.333% - 10px)",
                md: "calc(25% - 12px)",
                lg: "calc(20% - 12px)",
              },
            },
          }}
        >
          {quickActions.map((action) => (
            <Card
              key={action.label}
              onClick={() => navigate(action.path)}
              sx={{
                minWidth: 0,
                cursor: "pointer",
                borderRadius: "15px",
                border: `1px solid ${COLORS.border}`,
                boxShadow: "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  borderColor: action.color,
                  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
                  bgcolor: "#fcfefd",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.3,
                  p: { xs: 1.5, sm: 1.8 },
                  "&:last-child": { pb: { xs: 1.5, sm: 1.8 } },
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    borderRadius: "12px",
                    bgcolor: `${action.color}15`,
                    color: action.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "& svg": { fontSize: 22 },
                  }}
                >
                  {action.icon}
                </Box>

                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "0.82rem",
                      fontWeight: 800,
                      color: COLORS.navy,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {action.label}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.3,
                      fontSize: "0.7rem",
                      color: COLORS.slate,
                    }}
                  >
                    Open section
                  </Typography>
                </Box>

                <ArrowForward
                  sx={{
                    flexShrink: 0,
                    fontSize: 17,
                    color: "#94a3b8",
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;