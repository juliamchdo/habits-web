import { HabitDay } from "./HabitDay";
import { generateRangeDates } from "../utils/generate-range-dates";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import dayjs from "dayjs";

type Summary = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>;

export function SummaryTable() {
  const weekDays = ["S", "T", "Q", "Q", "S", "S", "D"];

  const summaryDates = generateRangeDates();
  const minimumSummaryDates = 18 * 7;
  const amountOfDaysToFill = minimumSummaryDates - summaryDates.length;
  const [summary, setSummary] = useState<Summary>([]);

  useEffect(() => {
    api.get("summary").then((res) => {
      setSummary(res.data);
    });
  }, []);

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, i) => {
          return (
            <div
              key={`${weekDay}-${i}`}
              className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
            >
              {weekDay}
            </div>
          );
        })}
      </div>
      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length &&
          summaryDates.map((date) => {
            console.log("date", date);
            const dayInSummary = summary.find((day) => {
              return dayjs(date).isSame(day.date, "day");
            });
            return (
              <HabitDay
                key={date.toString()}
                amount={dayInSummary?.amount}
                completed={dayInSummary?.completed}
                date={date}
              />
            );
          })}

        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, i) => {
            return (
              <div
                key={i}
                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
              />
            );
          })}
      </div>
    </div>
  );
}
