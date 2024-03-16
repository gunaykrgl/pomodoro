import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const calculateMovingAverage = (data: any, windowSize: number) => {
    const movingAverage = [];
    for (let i = 0; i < data.length; i++) {
        const startIndex = Math.max(0, i - windowSize + 1);
        const valuesInRange = data.slice(startIndex, i + 1);
        const average = valuesInRange.reduce((sum: number, value: number) => sum + value, 0) / valuesInRange.length;
        movingAverage.push(average);
    }
    return movingAverage;
};

export default function BarGraph({ data }: { data: any }) {
    const graph_data = Object.entries(data).map(([index, value]) => ({ date: index, value: value }))
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const hoursWorked = graph_data.map((e: any) => e.value?.reduce((total: number, work: any) => {
        if (!work.end) return total;

        const duration = Math.floor((work.end.getTime() - work.start.getTime()) / 1000 / 60);
        return total + duration;
    }, 0));

    const lowestDate = graph_data[0]?.date;
    const highestDate = graph_data[graph_data.length - 1]?.date;

    const d = new Date(lowestDate);
    const endDate = new Date(highestDate);

    //? Get hours worked for each day
    let ind;
    const newDict: { [key: string]: number } = {};
    const dates = graph_data.map(e => e.date);
    while (d <= endDate) {
        ind = dates.indexOf(d.toLocaleDateString())
        newDict[d.toLocaleDateString()] = hoursWorked[ind] || 0;
        d.setDate(d.getDate() + 1);
    }
    //? End of getting hours worked for each day

    const mas_values = calculateMovingAverage(Object.values(newDict), 7)
    const mas_keys = Object.keys(newDict)

    let d_ar = new Array()
    for (let i = 0; i < mas_values.length; i++) {
        d_ar.push({ date: mas_keys[i], "7 day MA": mas_values[i], "worked minutes": newDict[mas_keys[i]] })
    }

    return (
        <div className='stroke-white p-4 border-gray-500 border-4 rounded-md my-4'>
            <h1>Bar Graph</h1>
            {Object.values(newDict).length > 0 &&

                <ComposedChart width={350 } height={250} data={d_ar}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Bar dataKey="worked minutes" barSize={20} fill="#0F0" />
                    <Line type="monotone" dataKey="7 day MA" stroke="#F00" />
                </ComposedChart>
            }
        </div >
    )
}