import { Tabs, Tab, TabList, TabPanel } from "react-tabs"

export default function Table({ data, selectedTab, setSelectedTab }: { data: [{ string: [{ start: Date, end: Date }] }], selectedTab: string, setSelectedTab: Function }) {
    const sortedDates = Object.keys(data).sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime());

    const limitedSortedDates = sortedDates.slice(0, 2);
    if (limitedSortedDates.length > 0 && !selectedTab) setSelectedTab(limitedSortedDates[0])

    const works_in_selected_tab = data[selectedTab as any] || []
    // Calculate the total time worked in selected day
    const totalWorksInTab = (works_in_selected_tab as any).reduce((total: number, work: any) => {
        if (!work.start || !work.end) return total;
        const duration = Math.floor((work.end - work.start) / 1000 / 60);

        return total + duration;
    }, 0);

    return (
        <Tabs className="cursor-default w-96 h-96 select-none pt-4"
            onSelect={(index) => {
                const selectedDate = limitedSortedDates[index];
                setSelectedTab(selectedDate);
            }}
        >
            <TabList className="justify-center cursor-pointer gap-4 text-red-300 hidden md:flex">
                {limitedSortedDates.map((date: any) => {
                    return <Tab key={date} className={`outline-none ${date === selectedTab ? "underline" : ""} text-xl`}>{date}</Tab>
                })}
                {
                    sortedDates.length == 3 && <Tab key={sortedDates[2]} className={`outline-none ${sortedDates[2] === selectedTab ? "underline" : ""} text-xl`}>{sortedDates[2]}</Tab>
                }
                {sortedDates.length > 3 && <select className={`outline-none bg-transparent text-xl ${limitedSortedDates.every(el => el !== selectedTab) ? "underline" : ""}`}
                    onChange={(e) => setSelectedTab(e.target.value)} value={selectedTab}
                    onClick={_ => sortedDates.length === 3 ? setSelectedTab(sortedDates[2]) : null}

                >
                    {sortedDates.slice(2).map((date: any) => {
                        return <option className="text-black" value={date}>{date}</option>
                    })}
                </select>}
            </TabList>
            <TabList className="block md:hidden">
                <select className="w-full text-red-600 bg-transparent border-gray-600 border-4 py-3 text-3xl">
                    {sortedDates.map((date: any) => {
                        return <option className="text-black" value={date}>{date}</option>
                    })}
                </select>
            </TabList>

            {
                limitedSortedDates.map((date: any) => {
                    return (
                        <TabPanel title={date}>
                            <div className="h-60 lg:h-80 overflow-auto py-4">

                                {
                                    // @ts-ignore
                                    works_in_selected_tab.map((e: any) => {
                                        const duration = Math.floor((e.end - e.start) / 1000 / 60);
                                        return (<p className="text-xl lg:text-2xl px-4">
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