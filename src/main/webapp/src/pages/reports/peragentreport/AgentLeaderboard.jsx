import React from "react";
import { Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const AgentLeaderboard = ({ rows = [] }) => (
  <Paper sx={{ p: 2 }}>
    <h3>Agent Leaderboard</h3>
    <Table size="small">
      <TableHead>
        <TableRow><TableCell>Agent</TableCell><TableCell>Units</TableCell><TableCell>Revenue</TableCell></TableRow>
      </TableHead>
      <TableBody>
        {rows.map(r => (
          <TableRow key={r.agentId}><TableCell>{r.agentName}</TableCell><TableCell>{r.units}</TableCell><TableCell>{r.revenue}</TableCell></TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
);

export default AgentLeaderboard;
