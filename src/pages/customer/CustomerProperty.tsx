import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  Paper,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TablePagination,
  Avatar,
  InputAdornment,
  Skeleton,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  Visibility,
  Close,
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
  Refresh,
  AttachMoney,
  Search,
  FilterList,
  CheckCircle,
  Home,
  Sort,
  EventAvailable,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";

import {
  getPublicApproved,
  getPropertyById,
  clearSelectedProperty,
} from "../../features/property/propertySlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type {
  Property,
  PopulatedUser,
} from "../../typescript/type/property.types";

import InquiryModal from "./InquiryModal";
import BookAppointmentModal from "./BookAppointmentModal";
import RentalApplicationModal from "./RentalApplicationModal";
import { AssignmentTurnedIn } from "@mui/icons-material";

// =====================================================
// OPTIONS
// =====================================================

const PURPOSES = [
  { value: "", label: "All Purposes" },
  { value: "Sale", label: "For Sale" },
  { value: "Rent", label: "For Rent" },
];

const PROPERTY_TYPES = [
  { value: "", label: "All Types" },
  { value: "Apartment", label: "Apartment" },
  { value: "House", label: "House" },
  { value: "Villa", label: "Villa" },
  { value: "Land", label: "Land" },
  { value: "Office", label: "Office" },
  { value: "Shop", label: "Shop" },
  { value: "Warehouse", label: "Warehouse" },
];

const FURNISHING = [
  { value: "", label: "Any" },
  { value: "Furnished", label: "Furnished" },
  { value: "Semi-Furnished", label: "Semi-Furnished" },
  { value: "Unfurnished", label: "Unfurnished" },
];

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest First" },
  { value: "createdAt-asc", label: "Oldest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "area-desc", label: "Largest First" },
  { value: "bedrooms-desc", label: "Most Bedrooms" },
];

// =====================================================
// POPULATED USER CHECK
// =====================================================

const isPopulatedUser = (
  val: string | PopulatedUser | null | undefined,
): val is PopulatedUser => !!val && typeof val === "object" && "name" in val;

// =====================================================
// PAGE
// =====================================================

const CustomerProperty: React.FC = () => {
  const dispatch = useAppDispatch();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { properties, property, pagination, loading } = useAppSelector(
    (state) => state.property,
  );

  // =====================================================
  // FILTER STATE
  // =====================================================

  const [search, setSearch] = useState<string>("");

  const [submittedSearch, setSubmittedSearch] = useState<string>("");

  const [purpose, setPurpose] = useState<string>("");

  const [propertyType, setPropertyType] = useState<string>("");

  const [furnishingStatus, setFurnishingStatus] = useState<string>("");

  const [bedrooms, setBedrooms] = useState<string>("");

  const [priceInput, setPriceInput] = useState<[string, string]>(["", ""]);

  const [sort, setSort] = useState<string>("createdAt-desc");

  // =====================================================
  // PAGINATION
  // =====================================================

  const [page, setPage] = useState<number>(0);

  const [rowsPerPage, setRowsPerPage] = useState<number>(12);

  // =====================================================
  // UI STATE
  // =====================================================

  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  const [viewOpen, setViewOpen] = useState<boolean>(false);

  const [inquiryProperty, setInquiryProperty] = useState<Property | null>(null);

  // ✅ NEW — tracks which property is being booked
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);

  const [rentalProperty, setRentalProperty] = useState<Property | null>(null);

  // =====================================================
  // FETCH PROPERTIES
  // =====================================================

  useEffect(() => {
    const [sortBy, sortOrder] = sort.split("-");

    dispatch(
      getPublicApproved({
        page: page + 1,
        limit: rowsPerPage,

        ...(submittedSearch && {
          search: submittedSearch,
        }),

        ...(purpose && {
          purpose,
        }),

        ...(propertyType && {
          propertyType,
        }),

        ...(furnishingStatus && {
          furnishingStatus,
        }),

        ...(bedrooms && {
          bedrooms,
        }),

        ...(priceInput[0] && {
          minprice: priceInput[0],
        }),

        ...(priceInput[1] && {
          maxprice: priceInput[1],
        }),

        sortBy,
        sortOrder,
      }),
    );
  }, [
    dispatch,
    page,
    rowsPerPage,
    submittedSearch,
    purpose,
    propertyType,
    furnishingStatus,
    bedrooms,
    priceInput,
    sort,
  ]);

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    setPage(0);
    setSubmittedSearch(search);
  };

  // =====================================================
  // RESET
  // =====================================================

  const handleReset = (): void => {
    setSearch("");
    setSubmittedSearch("");

    setPurpose("");
    setPropertyType("");
    setFurnishingStatus("");
    setBedrooms("");

    setPriceInput(["", ""]);

    setSort("createdAt-desc");

    setPage(0);

    setFilterDrawerOpen(false);
  };

  // =====================================================
  // APPLY FILTERS
  // =====================================================

  const handleApplyFilters = (): void => {
    setPage(0);
    setFilterDrawerOpen(false);
  };

  // =====================================================
  // VIEW PROPERTY
  // =====================================================

  const handleView = async (id: string): Promise<void> => {
    await dispatch(getPropertyById(id));

    setViewOpen(true);
  };

  // =====================================================
  // CLOSE PROPERTY
  // =====================================================

  const closeView = (): void => {
    setViewOpen(false);

    dispatch(clearSelectedProperty());
  };

  // =====================================================
  // ACTIVE FILTER COUNT
  // =====================================================

  const activeFilterCount =
    (purpose ? 1 : 0) +
    (propertyType ? 1 : 0) +
    (furnishingStatus ? 1 : 0) +
    (bedrooms ? 1 : 0) +
    (priceInput[0] || priceInput[1] ? 1 : 0);

  // =====================================================
  // FILTER FIELDS
  // =====================================================

  const FilterFields = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* PROPERTY TYPE */}

      <FormControl fullWidth size="small">
        <InputLabel>Property Type</InputLabel>

        <Select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          label="Property Type"
        >
          {PROPERTY_TYPES.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* PURPOSE */}

      <FormControl fullWidth size="small">
        <InputLabel>Purpose</InputLabel>

        <Select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          label="Purpose"
        >
          {PURPOSES.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* FURNISHING */}

      <FormControl fullWidth size="small">
        <InputLabel>Furnishing</InputLabel>

        <Select
          value={furnishingStatus}
          onChange={(e) => setFurnishingStatus(e.target.value)}
          label="Furnishing"
        >
          {FURNISHING.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* BEDROOMS */}

      <FormControl fullWidth size="small">
        <InputLabel>Min Bedrooms</InputLabel>

        <Select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          label="Min Bedrooms"
        >
          <MenuItem value="">Any</MenuItem>

          <MenuItem value="1">1+</MenuItem>

          <MenuItem value="2">2+</MenuItem>

          <MenuItem value="3">3+</MenuItem>

          <MenuItem value="4">4+</MenuItem>

          <MenuItem value="5">5+</MenuItem>
        </Select>
      </FormControl>

      {/* PRICE */}

      <Box>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Price Range
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <TextField
            size="small"
            type="number"
            label="Min"
            value={priceInput[0]}
            onChange={(e) => setPriceInput([e.target.value, priceInput[1]])}
            fullWidth
          />

          <Typography variant="body2">—</Typography>

          <TextField
            size="small"
            type="number"
            label="Max"
            value={priceInput[1]}
            onChange={(e) => setPriceInput([priceInput[0], e.target.value])}
            fullWidth
          />
        </Box>
      </Box>

      {/* FILTER BUTTONS */}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Button variant="contained" fullWidth onClick={handleApplyFilters}>
          Apply Filters
        </Button>

        <Button variant="outlined" fullWidth onClick={handleReset}>
          Reset All
        </Button>
      </Box>
    </Box>
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <MainLayout>
      <Paper
        sx={{
          p: {
            xs: 2,
            md: 4,
          },
          borderRadius: 3,
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
              }}
            >
              Available Properties
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Browse all approved listings
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip
              icon={<CheckCircle />}
              label={`${pagination?.total ?? 0} Approved`}
              color="success"
              variant="outlined"
            />

            {isMobile && (
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilterDrawerOpen(true)}
              >
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
            )}
          </Box>
        </Box>

        <Divider
          sx={{
            mb: 3,
          }}
        />

        {/* =================================================
            SEARCH + SORT
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              flex: 1,
              minWidth: 260,
            }}
          >
            <TextField
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <FormControl
            size="small"
            sx={{
              minWidth: 200,
            }}
          >
            <InputLabel>Sort</InputLabel>

            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              label="Sort"
              startAdornment={
                <Sort
                  fontSize="small"
                  sx={{
                    mr: 1,
                  }}
                />
              }
            >
              {SORT_OPTIONS.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </Box>

        {/* =================================================
            SIDEBAR + CONTENT
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          {/* =================================================
              DESKTOP SIDEBAR
          ================================================= */}

          {!isMobile && (
            <Box
              sx={{
                width: {
                  xs: "100%",
                  md: "calc(25% - 12px)",
                },
                flexShrink: 0,
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  position: "sticky",
                  top: 80,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <FilterList />

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Filters
                  </Typography>

                  {activeFilterCount > 0 && (
                    <Chip
                      label={activeFilterCount}
                      size="small"
                      color="primary"
                    />
                  )}
                </Box>

                {FilterFields}
              </Paper>
            </Box>
          )}

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <Box
            sx={{
              width: {
                xs: "100%",
                md: isMobile ? "100%" : "calc(75% - 12px)",
              },
              minWidth: 0,
            }}
          >
            {/* =================================================
                LOADING
            ================================================= */}

            {loading && properties.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Box
                    key={item}
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "calc(50% - 12px)",
                        md: "calc(33.333% - 16px)",
                      },
                    }}
                  >
                    <Skeleton
                      variant="rounded"
                      height={360}
                      sx={{
                        borderRadius: 3,
                      }}
                    />
                  </Box>
                ))}
              </Box>
            ) : properties.length === 0 ? (
              /* =================================================
                  EMPTY STATE
              ================================================= */

              <Box
                sx={{
                  textAlign: "center",
                  py: 10,
                }}
              >
                <Home
                  sx={{
                    fontSize: 80,
                    color: "text.disabled",
                    mb: 2,
                  }}
                />

                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                  }}
                >
                  No properties found
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                  }}
                >
                  Try adjusting your filters or search query.
                </Typography>

                <Button variant="outlined" onClick={handleReset}>
                  Clear Filters
                </Button>
              </Box>
            ) : (
              <>
                {/* =================================================
                    PROPERTY CARDS
                ================================================= */}

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                  }}
                >
                  {properties.map((p: Property) => (
                    <Box
                      key={p._id}
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "calc(50% - 12px)",
                          md: "calc(33.333% - 16px)",
                        },
                        display: "flex",
                      }}
                    >
                      <Card
                        sx={{
                          borderRadius: 3,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "transform 0.2s, box-shadow 0.2s",

                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 6,
                          },
                        }}
                      >
                        {/* =================================================
                              IMAGE
                          ================================================= */}

                        <Box
                          sx={{
                            position: "relative",
                          }}
                        >
                          <CardMedia
                            component="img"
                            sx={{
                              height: 180,
                            }}
                            image={
                              p.images[0]?.image ||
                              "https://via.placeholder.com/300x180?text=No+Image"
                            }
                            alt={p.title}
                          />

                          <Chip
                            label={p.purpose}
                            size="small"
                            color={
                              p.purpose === "Sale" ? "primary" : "secondary"
                            }
                            sx={{
                              position: "absolute",
                              top: 8,
                              left: 8,
                              fontWeight: 600,
                            }}
                          />

                          <Chip
                            label={p.propertyType}
                            size="small"
                            variant="filled"
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              fontWeight: 600,
                              bgcolor: "rgba(255,255,255,0.9)",
                              color: "text.primary",
                            }}
                          />
                        </Box>

                        {/* =================================================
                              CARD CONTENT
                          ================================================= */}

                        <CardContent
                          sx={{
                            flexGrow: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            noWrap
                            sx={{
                              fontWeight: 700,
                            }}
                          >
                            {p.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              mb: 1,
                            }}
                          >
                            {p.description}
                          </Typography>

                          {/* PRICE */}

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mb: 1,
                            }}
                          >
                            <AttachMoney
                              fontSize="small"
                              sx={{
                                color: "success.main",
                              }}
                            />

                            <Typography
                              variant="h6"
                              color="success.main"
                              sx={{
                                fontWeight: 700,
                              }}
                            >
                              {p.price.toLocaleString()}
                            </Typography>
                          </Box>

                          {/* STATS */}

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              flexWrap: "wrap",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Bed fontSize="small" color="action" />

                              <Typography variant="caption">
                                {p.bedrooms}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Bathtub fontSize="small" color="action" />

                              <Typography variant="caption">
                                {p.bathrooms}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <SquareFoot fontSize="small" color="action" />

                              <Typography variant="caption">
                                {p.area} sqft
                              </Typography>
                            </Box>
                          </Box>

                          {/* LOCATION */}

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mt: 1,
                            }}
                          >
                            <LocationOn fontSize="small" color="action" />

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {p.location.coordinates[1].toFixed(4)},{" "}
                              {p.location.coordinates[0].toFixed(4)}
                            </Typography>
                          </Box>
                        </CardContent>

                        <Divider />

                        {/* =================================================
                              ACTIONS
                        ================================================= */}

                        <CardActions
                          sx={{
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1,
                            p: 1.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              pl: 0.5,
                            }}
                          >
                            {new Date(p.createdAt).toLocaleDateString()}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            {/* VIEW */}

                            <Tooltip title="View details">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleView(p._id)}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* INQUIRE */}

                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => setInquiryProperty(p)}
                              sx={{
                                textTransform: "none",
                                fontWeight: 600,
                              }}
                            >
                              Inquire
                            </Button>

                            {/* ✅ VISIT / BOOK APPOINTMENT */}

                            <Button
                              size="small"
                              variant="contained"
                              color="secondary"
                              startIcon={<EventAvailable fontSize="small" />}
                              onClick={() => setBookingProperty(p)}
                              sx={{
                                textTransform: "none",
                                fontWeight: 600,
                              }}
                            >
                              Visit
                            </Button>

                            {p.purpose === "Rent" && (
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={
                                  <AssignmentTurnedIn fontSize="small" />
                                }
                                onClick={() => setRentalProperty(p)}
                                sx={{ textTransform: "none", fontWeight: 600 }}
                              >
                                Apply
                              </Button>
                            )}
                          </Box>
                        </CardActions>
                      </Card>
                    </Box>
                  ))}
                </Box>

                {/* =================================================
                    PAGINATION
                ================================================= */}

                {pagination && (
                  <TablePagination
                    component="div"
                    count={pagination.total}
                    page={page}
                    onPageChange={(_event, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event) => {
                      setRowsPerPage(parseInt(event.target.value, 10));

                      setPage(0);
                    }}
                    rowsPerPageOptions={[6, 12, 24, 48]}
                  />
                )}
              </>
            )}
          </Box>
        </Box>
      </Paper>

      {/* =====================================================
          MOBILE FILTER DRAWER
      ===================================================== */}

      <Drawer
        anchor="left"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      >
        <Box
          sx={{
            width: 320,
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Filters
            </Typography>

            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <Divider
            sx={{
              mb: 3,
            }}
          />

          {FilterFields}
        </Box>
      </Drawer>

      {/* =====================================================
          PROPERTY DETAILS DIALOG
      ===================================================== */}

      <Dialog open={viewOpen} onClose={closeView} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Property Details
          <IconButton onClick={closeView} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {loading && !property ? (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
              }}
            >
              <Skeleton
                variant="rounded"
                height={220}
                sx={{
                  mb: 2,
                }}
              />

              <Skeleton variant="text" width="60%" />

              <Skeleton variant="text" width="40%" />
            </Box>
          ) : property ? (
            <>
              {property.images.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mb: 2,
                    overflow: "auto",
                  }}
                >
                  {property.images.map((img, index) => (
                    <img
                      key={index}
                      src={img.image}
                      alt={`${property.title}-${index}`}
                      style={{
                        width: 220,
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 8,
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </Box>
              )}

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {property.title}
              </Typography>

              <Box
                sx={{
                  mb: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {property.description}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 1,
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Type
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {property.propertyType}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Purpose
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {property.purpose}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Price
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    ${property.price.toLocaleString()}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Area
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {property.area} sqft
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Bedrooms
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {property.bedrooms}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Bathrooms
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {property.bathrooms}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Furnishing
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {property.furnishingStatus}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {property.status}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Approval
                  </Typography>

                  <Box
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    <Chip
                      label="Approved"
                      icon={<CheckCircle fontSize="small" />}
                      color="success"
                      size="small"
                    />
                  </Box>
                </Box>

                {isPopulatedUser(property.owner) && (
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Divider
                      sx={{
                        my: 1,
                      }}
                    />

                    <Typography variant="caption" color="text.secondary">
                      Listed By
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mt: 1,
                        p: 1.5,
                        bgcolor: "#f9fafb",
                        borderRadius: 2,
                      }}
                    >
                      <Avatar
                        src={property.owner.image}
                        sx={{
                          width: 44,
                          height: 44,
                        }}
                      >
                        {property.owner.name?.charAt(0)}
                      </Avatar>

                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {property.owner.name}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {property.owner.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <LocationOn fontSize="small" color="action" />

                    <Typography variant="caption">
                      Coordinates: [{property.location.coordinates.join(", ")}]
                    </Typography>
                  </Box>
                </Box>

                {property.amenities.length > 0 && (
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Amenities
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        mt: 0.5,
                      }}
                    >
                      {property.amenities.map((amenity) => (
                        <Chip key={amenity} label={amenity} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Property not found.
            </Typography>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Button onClick={closeView}>Close</Button>

          {/* ✅ Bonus — Book Visit directly from the details dialog */}
          {property && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<EventAvailable />}
              onClick={() => {
                closeView();
                setBookingProperty(property);
              }}
            >
              Book Visit
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* =====================================================
          INQUIRY MODAL (moved OUT of .map — rendered once)
      ===================================================== */}

      {inquiryProperty && (
        <InquiryModal
          open={!!inquiryProperty}
          onClose={() => setInquiryProperty(null)}
          property={inquiryProperty}
        />
      )}

      {/* =====================================================
          ✅ BOOK APPOINTMENT MODAL (new)
      ===================================================== */}

      {bookingProperty && (
        <BookAppointmentModal
          open
          onClose={() => setBookingProperty(null)}
          property={bookingProperty}
        />
      )}

      {rentalProperty && (
        <RentalApplicationModal
          open
          onClose={() => setRentalProperty(null)}
          property={rentalProperty}
        />
      )}
    </MainLayout>
  );
};

export default CustomerProperty;
