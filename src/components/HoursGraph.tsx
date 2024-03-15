// function FilterButton({ text }: { text: string }) {
//     return (
//         <button className="text-white rounded-md bg-red-500 border-red-500 border-4 px-2 w-16 h-12">{text}</button>
//     )
// }
export default function HoursGraph({ data }: { data: { [key: string]: number[] } }) {
    const concattedData: number[] = (([] as number[]).concat(...Object.values(data)))

    const data_1 = concattedData.map((ds: any) => {
        return {
            start: ds["start"], startDay: ds["start"].getDay(), hourOfWeek: 24 * ds["start"].getDay() + ds["start"].getHours(),

            duration: Math.floor((ds["end"] - ds["start"]) / (1000 * 60))
        }
    })

    const groupedData: { [hourOfWeek: string]: number } = {};
    const count: { [hourOfWeek: string]: number } = {};
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    data_1.forEach(entry => {
        const { hourOfWeek, duration } = entry;
        if (groupedData[hourOfWeek]) {
            groupedData[hourOfWeek] += duration;
            count[hourOfWeek]++;
        } else {
            groupedData[hourOfWeek] = duration;
            count[hourOfWeek] = 1;
        }
    });

    interface Result {
        [hourOfWeek: number]: number;
    }

    const result: Result = {};
    for (const hourOfWeek in groupedData) {
        result[parseInt(hourOfWeek)] = groupedData[hourOfWeek] / count[hourOfWeek];
    }

    let d = Array(7 * 24).fill(0)
    for (const hourOfWeek in result) {
        d[hourOfWeek] = result[hourOfWeek]
    }

    const newArr = [];
    while (d.length) newArr.push(d.splice(0, 24));

    return (
        <div className="p-4 border-gray-500 border-4 rounded-md my-4">
            <h1>Hours Graph</h1>
            {/* <FilterButton text="1 Week" /> */}
            <table className="table-fixed w-80">
                <td> </td>
                {
                    Array.from({ length: 24 }, (_, i) => (
                        <td key={i}>{i % 6 === 0 ? i : ""}</td>
                    ))
                }

                {
                    newArr.map((day: any, index: number) => {
                        return <tr key={index}>
                            <td className="align-middle">{daysOfWeek[index][0]}</td>
                            {day.map((x: any) => <td className={`text-4xl text-red ${x === 0 ? "text-white" : "text-red-600"}`}>
                                <span>.</span></td>)}

                        </tr>
                    })
                }
            </table>
        </div>
    )
}