"use client";

import React, { useEffect } from "react";

import { useAppContext } from "@/context/AppContext";

const Display = () => {
  const { results } = useAppContext();

  useEffect(() => {
    if (results) {
      console.log("FROM DISPLAY: Results updated:", results);
    }
  }, [results]);

  if (!results) return <></>;
  return (
    <div className='p-4 border mt-4 rounded-lg bg-gray-50'>
      <h2 className='font-bold text-xl mb-2'>Results</h2>
      {results.shiftResults &&
        results.shiftResults.map((s, i) => (
          <p key={i}>
            Shift {i + 1}: {s.hours.toFixed(2)} hrs — ${s.earnings.toFixed(2)}
          </p>
        ))}
      <hr className='my-2' />
      <p className='font-bold'>
        Total: {results.totalHours.toFixed(2)} hrs — $
        {results.totalEarnings.toFixed(2)}
      </p>
    </div>
  );
};

export default Display;
