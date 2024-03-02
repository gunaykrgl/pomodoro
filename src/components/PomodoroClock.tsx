import { useState, useEffect } from 'react';
// import { CiPlay1 } from "react-icons/ci";

// @ts-ignore
import useSound from "use-sound";

import startWorkSound from "../assets/sounds/Stop.mp3"
import shutdownSound from "../assets/sounds/Start.mp3"

export default function PomodoroClock({ workMinutes, breakMinutes, setHoursWorkedFn }: { workMinutes: Number, breakMinutes: Number, setHoursWorkedFn: Function }) {

    ///!!!!!
    const [time, setTime] = useState(Number(workMinutes) * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isWorkTime, setIsWorkTime] = useState(true);

    // Calculate hours minutes and seconds from time
    const hours: number = Math.floor(time / 3600)
    const minutes: number = Math.floor(time % 3600 / 60)
    const seconds: number = Math.floor(time % 3600 % 60)

    // Sound effects
    const [startWorkPlay] = useSound(startWorkSound)
    const [shutdownPlay] = useSound(shutdownSound)

    useEffect(() => {
        if (!isRunning) return;

        const worker = new Worker("src/utils/worker.js")
        worker.postMessage('start')

        worker.onmessage = () => {
            setTime((prev: any) => {
                if (prev <= 0) {
                    if (isWorkTime) {
                        setIsWorkTime(false)
                        shutdownPlay()
                        handleWorkSessionEnd()
                        return Number(breakMinutes) * 60
                    } else {
                        setIsWorkTime(true)
                        startWorkPlay()
                        handleStart()
                        return Number(workMinutes) * 60
                    }
                }
                return prev - 1
            })
            document.title = `${(hours * 60 + minutes).toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }
        return () => {
            worker.terminate()
        }
    })

    const handleStart = () => {
        const now = new Date(Date.now())
        setHoursWorkedFn((prev: any) => {
            if (prev.length > 0 && prev[prev.length - 1].end === null) return prev
            return [...prev, { start: now, end: null }]
        });
        setIsRunning(true);
    };

    const handleStop = () => {
        setIsRunning(false);

        handleWorkSessionEnd()
        // setTime(0);
    };
    const handleStartStop = () => {
        if (isRunning) {
            handleStop()
        } else {
            handleStart()
        }
    }

    const handleReset = () => {
        setIsRunning(false);
        setIsWorkTime(true);
        setTime(Number(workMinutes) * 60);
    }

    const handleWorkSessionEnd = () => {
        setHoursWorkedFn((prev: any) => {
            const last = prev[prev.length - 1]
            if (last.end) return prev

            last.end = new Date(Date.now())
            return [...prev.slice(0, prev.length - 1), last]
        });
    }

    return (
        <div>
            <h1 className='text-4xl text-white p-4'>{hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0')}</h1>
            <div className='flex flex-row gap-4 justify-center'>
                <button className=" w-24 bg-red-400 h-8" onClick={handleStartStop}>{isRunning ? "⏸ Pause" : "▶ Start"}</button>
                <button className=' w-24  bg-red-400 h-8' onClick={handleReset}>↺ Reset</button>
            </div>
        </div>
    );
}