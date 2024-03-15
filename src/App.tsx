import PomodoroClock from "./components/PomodoroClock"
import { useState, useEffect } from "react"
import DateTimeRange from "../types/DateTimeRange"
import Table from "./components/Table";
import BarGraph from "./components/BarGraph";
import HoursGraph from "./components/HoursGraph";
import Settings from "./components/Settings";

function App() {
  const [loading, setLoading] = useState(true);
  const [hoursWorked, setHoursWorked] = useState<DateTimeRange[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  // For Table 
  const [selectedTab, setSelectedTab] = useState('');

  useEffect(() => {
    const hoursWorkedCookie = localStorage.getItem("hoursWorked");
    if (hoursWorkedCookie) {
      const parsedHoursWorked = JSON.parse(hoursWorkedCookie).map((item: DateTimeRange) => ({
        start: new Date(item.start),
        end: new Date(item.end) || null,
      }));
      setHoursWorked(parsedHoursWorked);
    }
    setLoading(false);
  }, [])

  //? Group the data by date
  const groupedData = hoursWorked.reduce((acc: any, curr: any) => {
    const startDate = curr.start.toLocaleDateString();
    if (!acc[startDate]) {
      acc[startDate] = [];
    }
    acc[startDate].push(curr);
    return acc;
  }, {}) || {};
  //? End of grouping the data by date

  useEffect(() => {
    if (loading) return;
    localStorage.setItem("hoursWorked", JSON.stringify(hoursWorked.filter(e => e.end !== null)))
  }, [hoursWorked]);


  useEffect(() => { console.log(workMinutes, breakMinutes) }, [workMinutes, breakMinutes]);

  return (
    <div className="bg-slate-800 text-white min-w-screen min-h-screen grid
     grid-cols-1 md:grid-cols-2 md:px-12 2xl:grid-cols-3 py-4 place-items-center">
      <div className="">
        <PomodoroClock workMinutes={workMinutes} breakMinutes={breakMinutes} setHoursWorkedFn={setHoursWorked} setSelectedTab={setSelectedTab} setShowSettings={setShowSettings} />
        <Settings showSettings={showSettings} setWorkMinutes={setWorkMinutes} setBreakMinutes={setBreakMinutes} workMinutes={workMinutes} breakMinutes={breakMinutes} />
        <div className="block 2xl:hidden">
          <Table data={groupedData} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </div>
      </div>
      <div className="hidden 2xl:block">
        <Table data={groupedData} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>
      <div>
        <HoursGraph data={groupedData} />
        {/* <br /> */}
        <BarGraph data={groupedData} />

      </div>
    </div>
  )
}

export default App
