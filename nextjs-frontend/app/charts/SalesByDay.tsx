"use client";

import React from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SalesByDayProps {
  data: {
    date: string;
    totalSales: string;
  }[];
}

const SalesByDay = ({ data }: SalesByDayProps) => {
  return (
    <ResponsiveContainer>
      <BarChart data={data} width={500} height={300}>
        <CartesianGrid stroke="#E0E0E0" />
        <XAxis dataKey="date" stroke="#fff" />
        <YAxis stroke="fff" tickFormatter={(value) => `$${value}`} />
        <Tooltip
          cursor={{ fill: "#E0E0E0" }}
          formatter={(value) => `$${value}`}
        />
        <Bar dataKey="totalSales" name="Sales By Day" stroke="#E0E0E0" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesByDay;
