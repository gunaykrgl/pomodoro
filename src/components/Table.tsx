import { Tabs, Tab, TabList, TabPanel } from "react-tabs"
import DateTimeRange from "../../types/DateTimeRange";

export default function Table({ data, selectedTab, setSelectedTab }: { data: [{ string: [{ start: Date, end: Date }] }], selectedTab: string, setSelectedTab: Function }) {
    const sortedDates = Object.keys(data).sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime());
    const dayDifference = ((new Date(sortedDates[sortedDates.length - 1]).getDay() - new Date(sortedDates[0]).getDay()) / (1000 * 3600 * 24)) || 1

    const limitedSortedDates = sortedDates.slice(0, 2);
    if (limitedSortedDates.length > 0 && !selectedTab) setSelectedTab(limitedSortedDates[0])

    const works_in_selected_tab = data[selectedTab as any] || []
    // Calculate the total time worked in selected day
    const totalWorksInTab = (works_in_selected_tab as any).reduce((total: number, work: any) => {
        if (!work.start || !work.duration) return total;

        return total + work.duration;
    }, 0);

    // const sum = Object.values(data).flat().map((e: any) => e.duration).filter(a => a > 0).reduce((a: any, b: any) => (a + b), 0)

    // @ts-ignore
    // const averageWorkedMins = Math.floor(sum / dayDifference / 1000 / 60)

    return (
        <Tabs className="cursor-default w-72 select-none"
            onSelect={(index) => {
                const selectedDate = limitedSortedDates[index];
                setSelectedTab(selectedDate);
            }}
        >
            <TabList className="flex justify-center cursor-pointer gap-4 text-red-300">
                {limitedSortedDates.map((date: any) => {
                    return <Tab key={date} className={`outline-none ${date === selectedTab ? "underline" : ""} text-xl`}>{date}</Tab>
                })}

                {sortedDates.length >= 3 && <select className={`outline-none bg-transparent text-xl ${limitedSortedDates.every(el => el !== selectedTab) ? "underline" : ""}`}
                    onChange={(e) => setSelectedTab(e.target.value)} value={selectedTab}
                    onClick={e => sortedDates.length === 3 ? setSelectedTab(sortedDates[2]) : null}

                >
                    {sortedDates.slice(2).map((date: any) => {
                        return <option value={date}>{date}</option>
                    })}
                </select>}

            </TabList>
            {
                limitedSortedDates.map((date: any) => {
                    return (
                        <TabPanel title={date}>
                            <div className="h-52 overflow-auto">

                                {
                                    works_in_selected_tab.map((e: any) => {
                                        const duration = Math.floor((e.end - e.start) / 1000 / 60);
                                        return (<p>
                                            {e.start.getHours().toString().padStart(2, '0')}:{e.start.getMinutes().toString().padStart(2, '0')} 
                                            {e.end && `- ${e.end.getHours().toString().padStart(2, '0')}:${e.end.getMinutes().toString().padStart(2, '0')} (${duration} min. worked)`}
                                            </p>)
                                    })}
                            </div>
                        </TabPanel>
                    )
                })

            }
            <br></br>
            <h1 className="text-md">Total Worked: {Math.floor(totalWorksInTab / 60).toString().padStart(2, "0")}:{(totalWorksInTab % 60).toString().padStart(2, "0")} ({totalWorksInTab} minutes)</h1>
            {/* <h1 className="text-md">AVG time Worked over the last {sortedDates.length} days: {Math.floor(averageWorkedMins / 60).toString().padStart(2, "0")}:{(averageWorkedMins % 60).toString().padStart(2, "0")} ({averageWorkedMins} minutes)</h1> */}
        </Tabs>
    )
}