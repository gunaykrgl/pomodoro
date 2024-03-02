import PomodoroClock from "./components/PomodoroClock"
import { useState, useEffect } from "react"
import DateTimeRange from "../types/DateTimeRange"
import Table from "./components/Table";
import Graph from "./components/Graph";
import HoursGraph from "./components/HoursGraph";

function App() {
  const [hoursWorked, setHoursWorked] = useState<DateTimeRange[]>([]);

  const hoursWorkedCookie = localStorage.getItem("hoursWorked");

  if (hoursWorkedCookie && hoursWorked.length === 0) {
    const parsedHoursWorked = JSON.parse(hoursWorkedCookie).map((item: DateTimeRange) => ({
      start: new Date(item.start),
      end: item.end ? new Date(item.end) : null
    }));

    if (parsedHoursWorked.length > 0) {
      setHoursWorked(parsedHoursWorked);
    }
  }

  //? Group the data by date
  const groupedData = hoursWorked.reduce((acc: any, curr: any) => {
    const startDate = curr.start.toLocaleDateString();
    if (!acc[startDate]) {
      acc[startDate] = [];
    }
    acc[startDate].push(curr);
    return acc;
  }, {});
  //? End of grouping the data by date

  useEffect(() => {
    localStorage.setItem("hoursWorked", JSON.stringify(hoursWorked.filter(e => e.end !== null)))
  }, [hoursWorked]);


  // const data = [
  //   { label: 'Task 1', startTime: 0, endTime: 10 },
  //   { label: 'Task 2', startTime: 15, endTime: 25 },
  //   { label: 'Task 3', startTime: 30, endTime: 45 },
  //   // Add more data as needed
  // ];

  return (
    <div id="container" className="flex flex-col overflow-x-hidden overflow-y-auto bg-slate-800 w-screen h-screen items-center">
      <PomodoroClock workMinutes={25} breakMinutes={5} setHoursWorkedFn={setHoursWorked} />
      <br />
      <Table data={groupedData} />
      <br />
      <HoursGraph data={groupedData} />
      <br />
      <Graph data={groupedData} />
    </div>
  )
}

export default App
