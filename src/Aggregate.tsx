import React, { useState, useEffect } from "react";
import { fetchAggregateData } from "./api";
import { AggregateData } from "./types";

const AggregateComponent = ({
  category,
  startTime,
  endTime,
}: {
  category: string;
  startTime: string;
  endTime: string;
}) => {
  const [aggregateData, setAggregateData] = useState<AggregateData | null>(
    null
  );

  const fetchData = async (category: string) => {
    const data = await fetchAggregateData(category, startTime, endTime);

    setAggregateData(data);
  };

  useEffect(() => {
    if (category) {
      fetchData(category);
    }
  }, [category]);
  return (
    <div>
      {aggregateData != null ? (
        <>
          <h2>Aggregate for: {category}</h2>
          <p>Total: {aggregateData.total}</p>
          <p>Total Credit: {aggregateData.total_credit}</p>
          <p>Total Debit: {aggregateData.total_debit}</p>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default AggregateComponent;
