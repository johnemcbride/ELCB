import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#066C37",
  "#00674D",
  "#00615C",
  "#005962",
  "#135061",
  "#2F4858",
];

export const PieChartComponent = ({ data, title }) => {
  return (
    <>
      {" "}
      <Typography marginLeft={"10px"} variant={"h5"}>
        {title}
      </Typography>
      <ResponsiveContainer width={"100%"} height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill="#8884d8"
            label={(entry) => entry.name + " (" + entry.value + ")"}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};
