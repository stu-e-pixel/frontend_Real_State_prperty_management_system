import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  Divider,
  TextField,
  InputAdornment,
  Avatar,
} from "@mui/material";
import { Search, Refresh } from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/common/Loader";
import { getAllLeases } from "../../features/lease/leaseSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import type { PopulatedUserLite } from "../../typescript/type/inquiry.types";
import type { Property } from "../../typescript/type/property.types";

const STATUS_COLORS: Record<
  string,
  "success" | "default" | "error" | "warning"
> = {
  active: "success",
  expired: "default",
  terminated: "error",
};

const isPopulatedProperty = (
  val: Property | string | undefined
): val is Property => !!val && typeof val === "object" && "title" in val;

const isPopulatedUser = (
  val: PopulatedUserLite | string | null | undefined
): val is PopulatedUserLite =>
  !!val && typeof val === "object" && "name" in val;

const AdminLeases: React.FC = () => {
  const dispatch = useAppDispatch();
  const { leases, loading } = useAppSelector((state) => state.lease);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    dispatch(getAllLeases());
  }, [dispatch]);

  const searchTerm = search.trim().toLowerCase();
  const filtered = leases.filter((l) => {
    if (!searchTerm) return true;
    return (
      (isPopulatedUser(l.tenant) &&
        l.tenant.name.toLowerCase().includes(searchTerm)) ||
      (isPopulatedProperty(l.property) &&
        l.property.title.toLowerCase().includes(searchTerm)) ||
      l.status.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <MainLayout>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              All Leases
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Platform-wide lease agreements
            </Typography>
          </Box>
          <Chip
            label={`${leases.length} Total`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box display="flex" gap={2} mb={3} alignItems="center">
          <TextField
            placeholder="Search by tenant, property, status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            color="primary"
            onClick={() => dispatch(getAllLeases())}
            disabled={loading}
          >
            <Refresh />
          </IconButton>
        </Box>

        {loading && leases.length === 0 ? (
          <Loader message="Loading leases..." />
        ) : filtered.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography color="text.secondary">No leases found.</Typography>
          </Box>
        ) : (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>Tenant</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Agent</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Rent</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((l) => (
                  <TableRow key={l._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {isPopulatedProperty(l.property) &&
                          l.property.images?.[0]?.image && (
                            <Avatar
                              src={l.property.images[0].image}
                              variant="rounded"
                              sx={{ width: 32, height: 32 }}
                            />
                          )}
                        <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
                          {isPopulatedProperty(l.property)
                            ? l.property.title
                            : "—"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {isPopulatedUser(l.tenant) ? l.tenant.name : "—"}
                      </Typography>
                      {isPopulatedUser(l.tenant) && (
                        <Typography variant="caption" color="text.secondary">
                          {l.tenant.email}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {isPopulatedUser(l.owner) ? l.owner.name : "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {isPopulatedUser(l.agent) ? l.agent.name : "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {new Date(l.startDate).toLocaleDateString()} —{" "}
                        {new Date(l.endDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        ${l.monthlyRent.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={l.status}
                        color={STATUS_COLORS[l.status] ?? "default"}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </MainLayout>
  );
};

export default AdminLeases;