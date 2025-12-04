import { Box, Grid, Button, TextField, MenuItem, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const GlobalFilters = ({ filters, setFilters, onFilter }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <DatePicker
            label="Start Date"
            value={filters.start}
            onChange={(v) => setFilters({ ...filters, start: v })}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DatePicker
            label="End Date"
            value={filters.end}
            onChange={(v) => setFilters({ ...filters, end: v })}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            label="Region"
            fullWidth
            select
            value={filters.region || ""}
            onChange={(e) =>
              setFilters({ ...filters, region: e.target.value })
            }
          >
            <MenuItem value="">All Regions</MenuItem>
            <MenuItem value="North">North</MenuItem>
            <MenuItem value="South">South</MenuItem>
            <MenuItem value="East">East</MenuItem>
            <MenuItem value="West">West</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={1}>
          <Button
            fullWidth
            variant="contained"
            onClick={onFilter}
            sx={{ height: "100%" }}
          >
            Go
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GlobalFilters;
