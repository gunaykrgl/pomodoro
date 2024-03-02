import { Tabs, Tab, TabList, TabPanel } from "react-tabs"
import { useState } from "react"

export default function Table({ data }: { data: [{ string: [{ start: Date, end: Date }] }] }) {
    const uniqueDates: string[] = Object.keys(data);
    const sortedDates = uniqueDates.sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime());
    const limitedSortedDates = sortedDates.slice(0, 3);

    const [selectedTab, setSelectedTab] = useState(limitedSortedDates[0])

    const works_in_selected_tab = data[selectedTab as any]
    const totalHoursWorked = (works_in_selected_tab as any).reduce((total: number, work: any) => {
        if (!work.start || !work.end) return total;

        const duration = Math.floor((work.end.getTime() - work.start.getTime()) / 1000 / 60);
        return total + duration;
    }, 0);


    const differences = Object.values(data).flat().map((e: any) => e.end - e.start)

    const sum = differences.filter(a => a > 0).reduce((a: any, b: any) => (a + b), 0)
    
    // @ts-ignore
    const dayDifference = (new Date(uniqueDates[0]) - new Date(uniqueDates[uniqueDates.length - 1])) / (1000 * 3600 * 24)

    const averageWorkedMins = Math.floor(sum / dayDifference / 1000 / 60)
    return (
        <Tabs className="text-red-300 cursor-default w-72 select-none"
            onSelect={(index) => {
                const selectedDate = limitedSortedDates[index];
                setSelectedTab(selectedDate);
            }}
        >
            <TabList className="flex cursor-pointer gap-4 pb-4">
                {limitedSortedDates.map((date: any) => {
                    return <Tab className={`outline-none ${date === selectedTab ? "underline" : ""}`}>{date}</Tab>
                })}
                <select className={`outline-none bg-transparent text-white ${limitedSortedDates.every(el => el !== selectedTab) ? "underline" : ""}`} onChange={(e) => setSelectedTab(e.target.value)}>
                    <option className="bg-black" value="select" disabled selected>...</option>
                    {sortedDates.slice(3).map((date: any) => {
                        return <option className="bg-black" value={date}>{date}</option>
                    })}
                </select>
            </TabList>
            {
                limitedSortedDates.map((date: any) => {
                    return (
                        <TabPanel title={date}>
                            <div className="h-36 overflow-auto">
                                
                                {// @ts-ignore
                                works_in_selected_tab.map((e: any) => {
                                    return <p className="text-white text-sm px-4">{e.start.getHours().toString().padStart(2, '0') + ":" + e.start.getMinutes().toString().padStart(2, '0')
                                        + " - " + (e.end ? e.end.getHours().toString().padStart(2, '0') + ":" + e.end.getMinutes().toString().padStart(2, '0')
                                            + "  (" + Math.floor((e.end.getTime() - e.start.getTime()) / 1000 / 60) + " min worked)" : "")

                                    }</p>
                                })}
                            </div>
                        </TabPanel>
                    )
                })

            }
            <br></br>
            <h1 className="text-white">Total Worked: {Math.floor(totalHoursWorked / 60).toString().padStart(2, "0")}:{(totalHoursWorked % 60).toString().padStart(2, "0")} ({totalHoursWorked} minutes)</h1>
            <h1 className="text-white">Average Worked: {Math.floor(averageWorkedMins / 60).toString().padStart(2, "0")}:{(averageWorkedMins % 60).toString().padStart(2, "0")} ({averageWorkedMins} minutes)</h1>
        </Tabs>
    )
}