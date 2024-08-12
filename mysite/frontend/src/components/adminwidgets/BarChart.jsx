import React from "react";
import { Box, Typography, Grid } from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  Cell,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  LabelList,
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

export const BarChartComponent = ({ data, title }) => {
  return (
    <>
      {" "}
      <Typography marginLeft={"10px"} marginBottom={"1px"} >{title}</Typography>
      <ResponsiveContainer width={"100%"} height={200}>
        <BarChart
          data={data}
          {...{
            overflow: "visible",
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            scaleToFit="true"
            textAnchor="end"
            angle="-40"
            verticalAnchor="start"
            interval={0}
          />
          <YAxis />
          <Tooltip />

          <Bar dataKey="value" fill="#8884d8">
            <LabelList dataKey="value" position="top" />
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};
