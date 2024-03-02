import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from 'react';

export default function Graph({ data }: { data: any }) {
    const graph_data = Object.entries(data).map(([index, value]) => ({ date: index, value: value }))
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const hoursWorked = graph_data.map((e: any) => e.value?.reduce((total: number, work: any) => {
        if (!work.end) return total;

        const duration = Math.floor((work.end.getTime() - work.start.getTime()) / 1000 / 60);
        return total + duration;
    }, 0));
    
    const lowestDate = graph_data[0].date;
    const highestDate = graph_data[graph_data.length - 1].date;

    //? For resizing the graph
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    //? End of resizing the graph
    
    const d = new Date(lowestDate);
    const endDate = new Date(highestDate);

    //? Get heours worked for each day
    let ind;
    const newDict: { [key: string]: number } = {};
    const dates = graph_data.map(e => e.date);
    while (d <= endDate) {
        ind = dates.indexOf(d.toLocaleDateString())
        newDict[d.toLocaleDateString()] = hoursWorked[ind] || 0;
        d.setDate(d.getDate() + 1);
    }
    //? End of getting hours worked for each day
    return (
        <div className='stroke-white'>
            <h1 className="text-white">Graph</h1>
            <BarChart
                series={[
                    { data: Object.values(newDict), label: 'Min. Worked' }
                ]}
                height={300}
                width={Math.min(.8 * screenWidth, 700)}
                xAxis={[{ data: Object.keys(newDict), scaleType: 'band' }]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}

            />

        </div >
    )
}