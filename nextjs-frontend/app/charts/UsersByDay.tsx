"use client";

import React from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface UsersByDayProps {
  data: {
    date: string;
    totalUsers: string;
  }[];
}

const UsersByDay = ({ data }: UsersByDayProps) => {
  return (
    <ResponsiveContainer width={"100%"} minHeight={300}>
      <AreaChart data={data} width={500} height={200}>
        <CartesianGrid stroke="#E0E0E0" />
        <XAxis dataKey="date" stroke="#000" fontSize={12} />
        <YAxis stroke="#000" fontSize={12} />
        <Tooltip cursor={{ fill: "#E0E0E0" }} />
        <Area
          dataKey="totalUsers"
          name="Users By Day"
          stroke="#8884d8"
          fill="#8884d8"
          type={"monotone"}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default UsersByDay;
