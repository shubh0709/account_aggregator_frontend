import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { fetchTrendData } from "./api";
import { TrendData } from "./types";

const TrendComponent = ({
  category,
  startTime,
  endTime,
}: {
  category: string;
  startTime: string;
  endTime: string;
}) => {
  const [trendData, setTrendData] = useState<TrendData[]>([]);

  const fetchData = async (category: string) => {
    const data = await fetchTrendData(category, startTime, endTime);
    setTrendData(data);
  };

  useEffect(() => {
    if (category) {
      fetchData(category);
    }
  }, [category]);

  return (
    <div>
      {trendData.length > 0 ? (
        <>
          <h2>Trend for: {category}</h2>
          <LineChart
            width={500}
            height={300}
            data={trendData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_credit" stroke="#8884d8" />
            <Line type="monotone" dataKey="total_debit" stroke="#82ca9d" />
          </LineChart>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TrendComponent;
