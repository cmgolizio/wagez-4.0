"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAppContext } from "@/context/AppContext";

const shiftSchema = yup
  .object()
  .shape({
    inTime: yup.string().required(),
    outTime: yup.string().required(),
    hourlyWage: yup.number().positive().required(),
    breakStarted: yup.string().default("00:00"),
    breakEnded: yup.string().default("00:00"),
  })
  .test("validTimes", "Out-time must be after in-time", (value) => {
    if (!value.inTime || !value.outTime) return true;
    return (
      new Date(`1970-01-01T${value.outTime}`) >
      new Date(`1970-01-01T${value.inTime}`)
    );
  });

const formSchema = yup.object().shape({
  shifts: yup.array().of(shiftSchema).min(1, "At least one shift is required"),
});

const calculateShift = ({
  inTime,
  outTime,
  hourlyWage,
  breakStarted,
  breakEnded,
}) => {
  const inT = new Date(`1970-01-01T${inTime}`);
  const outT = new Date(`1970-01-01T${outTime}`);
  const breakStart = breakStarted ? new Date(`1970-01-01T${breakStarted}`) : 0;
  const breakEnd = breakEnded ? new Date(`1970-01-01T${breakEnded}`) : 0;
  let breakTime = (breakEnd - breakStart) / (1000 * 60);
  let totalHours = (outT - inT) / (1000 * 60 * 60);
  totalHours -= breakTime / 60;
  const totalPay = totalHours * hourlyWage;
  return { totalHours, totalPay };
};

export default function Form() {
  const { setShifts, setResults, results } = useAppContext();

  useEffect(() => {
    if (results) {
      console.log("Results updated:", results);
    }
  }, [results]);

  const { control, register, handleSubmit } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      shifts: [
        {
          inTime: "",
          outTime: "",
          hourlyWage: 0,
          breakStarted: "",
          breakEnded: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "shifts" });

  const onSubmit = (data) => {
    setShifts(data.shifts);
    const results = data.shifts?.map(calculateShift);
    const totalHours = results?.reduce((acc, curr) => acc + curr.totalHours, 0);
    const totalEarnings = results?.reduce(
      (acc, curr) => acc + curr.totalPay,
      0
    );
    setResults({ results, totalHours, totalEarnings });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id} className='w-full h-full flex flex-col'>
          <div className='flex flex-row gap-2'>
            <input
              {...register(`shifts.${index}.inTime`)}
              placeholder='In Time'
              type='time'
            />
            <input
              {...register(`shifts.${index}.outTime`)}
              placeholder='Out Time'
              type='time'
            />
            <input
              {...register(`shifts.${index}.hourlyWage`)}
              placeholder='Hourly Wage'
              type='number'
            />
          </div>
          <div>
            <input
              {...register(`shifts.${index}.breakStarted`)}
              placeholder='Break Started'
              type='time'
            />
            <input
              {...register(`shifts.${index}.breakEnded`)}
              placeholder='Break Ended'
            />
          </div>
          <button type='button' onClick={() => remove(index)}>
            Remove Shift
          </button>
        </div>
      ))}
      <button
        type='button'
        onClick={() =>
          append({
            inTime: "",
            outTime: "",
            hourlyWage: "",
            breakStarted: "",
            breakEnded: "",
          })
        }
      >
        Add Shift
      </button>
      <button type='submit'>Do Math.</button>
    </form>
  );
}
