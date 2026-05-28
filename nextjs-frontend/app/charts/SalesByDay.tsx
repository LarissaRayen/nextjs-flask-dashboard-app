"use client";

import React from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface SalesByDayProps {
  data: {
    date: string;
    totalSales: string;
  }[];
}

const SalesByDay = ({ data }: SalesByDayProps) => {
  return (
    <ResponsiveContainer width={"100%"} minHeight={300}>
      <LineChart data={data} width={500} height={200}>
        <CartesianGrid stroke="#E0E0E0" />
        <XAxis dataKey="date" stroke="#000" fontSize={12} />
        <YAxis
          stroke="#000"
          tickFormatter={(value) => `$${value}`}
          fontSize={12}
        />
        <Tooltip
          cursor={{ fill: "#E0E0E0" }}
          formatter={(value) => `$${value}`}
        />
        <Line
          dataKey="totalSales"
          name="Sales By Day"
          stroke="#8884d8"
          type={"monotone"}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesByDay;
