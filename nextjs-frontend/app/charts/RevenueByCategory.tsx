"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Tooltip, Pie } from "recharts";

interface RevenueByCategoryProps {
  data: {
    name: string;
    revenue: number;
  }[];
}

const RevenueByCategory = ({ data }: RevenueByCategoryProps) => {
  return (
    <ResponsiveContainer width={"100%"} minHeight={300}>
      <PieChart width={500} height={300}>
        <Tooltip
          cursor={{ fill: "#E0E0E0" }}
          formatter={(value) => `$${value}`}
        />
        <Pie
          data={data}
          dataKey={"revenue"}
          nameKey={"name"}
          fill="#000"
          label={(item) => item.name}
          cx="50%" // Centers the pie horizontally
          cy="50%" // Centers the pie vertically
          outerRadius={80} // Restricts diameter so text labels fit on screen
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RevenueByCategory;
