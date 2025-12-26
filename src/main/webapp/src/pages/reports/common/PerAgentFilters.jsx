// PerAgentFilters.jsx
import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { url as baseUrl } from "../../../api";

const PerAgentFilters = ({ filters, setFilters, onGenerate, loading }) => {
  const token = localStorage.getItem("token");
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAgents = async () => {
      setLoadingAgents(true);
      setError(null);
      
      try {
        console.log('Fetching agents from:', `${baseUrl}staff/agents?page=0&size=1000`);
        
        const response = await axios.get(`${baseUrl}staff/agents?page=0&size=1000`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Agents API Response:', response.data);
        
        // Handle different response structures
        let agentsList = [];
        
        if (response.data?.content) {
          // Paginated response
          agentsList = response.data.content;
        } else if (Array.isArray(response.data)) {
          // Direct array response
          agentsList = response.data;
        } else if (response.data?.data) {
          // Nested data property
          agentsList = response.data.data;
        }
        
        console.log('Parsed agents list:', agentsList);
        
        setAgents(agentsList);
        
        if (agentsList.length === 0) {
          console.warn('No agents found in response');
        }
        
      } catch (err) {
        console.error("Failed to load agents:", err);
        console.error("Error response:", err.response);
        setError("Failed to load agents");
      } finally {
        setLoadingAgents(false);
      }
    };
    
    loadAgents();
  }, [token, baseUrl]);

  const isGenerateDisabled = !filters.start || !filters.end || loading;

  return (
    <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
      {/* START DATE */}
      <TextField
        type="date"
        size="small"
        label="Start Date"
        InputLabelProps={{ shrink: true }}
        value={filters.start || ""}
        onChange={(e) =>
          setFilters((f) => ({
            ...f,
            start: e.target.value,
            page: 0,
          }))
        }
      />

      {/* END DATE */}
      <TextField
        type="date"
        size="small"
        label="End Date"
        InputLabelProps={{ shrink: true }}
        value={filters.end || ""}
        onChange={(e) =>
          setFilters((f) => ({
            ...f,
            end: e.target.value,
            page: 0,
          }))
        }
      />

      {/* AGENT SELECT */}
      <TextField
  select
  size="small"
  label="Agent"
  value={filters.agentId === null || filters.agentId === undefined ? "" : filters.agentId}
  onChange={(e) =>
    setFilters((f) => ({
      ...f,
      agentId: e.target.value === "" ? "" : e.target.value,
      page: 0,
    }))
  }
  sx={{ minWidth: 220 }}
  disabled={loadingAgents}
  error={!!error}
  helperText={error}
>
  {/* ALL AGENTS — ALWAYS SELECTABLE */}
  <MenuItem value="">
    <em>Select Agents</em>
  </MenuItem>
  <MenuItem value=" ">
    <em>All Agents</em>
  </MenuItem>

  {loadingAgents ? (
    <MenuItem disabled>Loading agents...</MenuItem>
  ) : agents.length === 0 ? (
    <MenuItem disabled>No agents available</MenuItem>
  ) : (
    agents.map((a) => (
      <MenuItem key={a.id} value={a.id}>
        {(a.firstname || a.firstName || "")}{" "}
        {(a.lastname || a.lastName || "")}
        {!a.firstname && !a.firstName && (a.name || `Agent ${a.id}`)}
      </MenuItem>
    ))
  )}
</TextField>


      {/* STATUS */}
      <TextField
        select
        size="small"
        label="Status"
        value={filters.status || ""}
        onChange={(e) =>
          setFilters((f) => ({
            ...f,
            status: e.target.value,
            page: 0,
          }))
        }
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="">-------Select Status-----</MenuItem>
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="FULFILLED">Fulfilled</MenuItem>
        <MenuItem value="PROCESSING">Processing</MenuItem>
        <MenuItem value="CANCELLED">Cancelled</MenuItem>
      </TextField>

      <Button 
        variant="contained" 
        onClick={onGenerate}
        disabled={isGenerateDisabled}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Generate"}
      </Button>
    </Box>
  );
};

export default PerAgentFilters;