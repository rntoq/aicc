"use client";

import { Box } from "@mui/material";
import {
  Cell,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export const CHART_COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#06b6d4",
  "#ef4444",
  "#a855f7",
  "#10b981",
  "#3b82f6",
  "#ec4899",
];

const TOOLTIP_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.96)",
  border: "1px solid rgba(148,163,184,0.3)",
  borderRadius: 12,
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 600,
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
};

export type RadarPoint = { label: string; value: number; max?: number };

export function ResultRadar({
  data,
  height = 240,
  color = "#6366f1",
  fill = "rgba(99,102,241,0.25)",
  domainMax,
}: {
  data: RadarPoint[];
  height?: number;
  color?: string;
  fill?: string;
  domainMax?: number;
}) {
  const max = domainMax ?? Math.max(...data.map((d) => d.value), 1);
  return (
    <Box sx={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="rgba(148,163,184,0.35)" />
          <PolarAngleAxis dataKey="label" tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }} />
          <PolarRadiusAxis domain={[0, max]} tick={false} axisLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`${value}`, ""]} />
          <Radar
            dataKey="value"
            stroke={color}
            fill={fill}
            fillOpacity={1}
            strokeWidth={2}
            dot={{ r: 3, fill: color }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export type DonutSlice = { label: string; value: number; color?: string };

export function ResultDonut({
  data,
  height = 220,
  centerLabel,
  centerSubLabel,
}: {
  data: DonutSlice[];
  height?: number;
  centerLabel?: string;
  centerSubLabel?: string;
}) {
  return (
    <Box sx={{ position: "relative", width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="58%"
            outerRadius="85%"
            paddingAngle={3}
            startAngle={90}
            endAngle={-270}
          >
            {data.map((d, i) => (
              <Cell key={d.label} fill={d.color ?? CHART_COLORS[i % CHART_COLORS.length]} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value, name) => [`${value}`, String(name)]} />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerSubLabel) && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          {centerLabel && (
            <Box sx={{ fontWeight: 900, fontSize: 24, lineHeight: 1.1, color: "text.primary" }}>{centerLabel}</Box>
          )}
          {centerSubLabel && (
            <Box sx={{ fontSize: 12, color: "text.secondary", mt: 0.3 }}>{centerSubLabel}</Box>
          )}
        </Box>
      )}
    </Box>
  );
}
