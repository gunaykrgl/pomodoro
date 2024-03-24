import { useState, useEffect } from 'react';
import pauseButton from '/src/assets/svg/pauseButton.svg';
import playButton from '/src/assets/svg/playButton.svg';
import settingsButton from '/src/assets/svg/settingsButton.svg';

// @ts-ignore
import useSound from "use-sound";

import startWorkSound from "../assets/sounds/Stop.mp3"
import shutdownSound from "../assets/sounds/Start.mp3"

export default function PomodoroClock({ workMinutes, breakMinutes, setHoursWorkedFn, setSelectedTab, setShowSettings }: { workMinutes: number, breakMinutes: number, setHoursWorkedFn: Function, setSelectedTab: Function, setShowSettings: Function }) {
    // Remaining time till the end of the work/break (in seconds)
    const [time, setTime] = useState(Number(workMinutes) * 60);

    // Update The time, when workMinutes setting change
    useEffect(() => setTime(() => workMinutes * 60), [workMinutes])

    const [isRunning, setIsRunning] = useState(false);
    const [isWorkTime, setIsWorkTime] = useState(true);

    // Calculate hours minutes and seconds from time
    const hours: number = Math.floor(time / 3600)
    const minutes: number = Math.floor(time % 3600 / 60)
    const seconds: number = Math.floor(time % 3600 % 60)

    // Sound effects
    const [startWorkPlay] = useSound(startWorkSound)
    const [shutdownPlay] = useSound(shutdownSound)

    // Worker to update the time
    useEffect(() => {
        if (!isRunning) return;
        const worker = new Worker(new URL("/src/utils/worker.js", import.meta.url))

        worker.onmessage = () => {
            setTime((prev: any) => {
                if (prev <= 0) {
                    if (isWorkTime) {
                        handleWorkSessionEnd()
                        return Number(breakMinutes) * 60
                    } else {
                        handleStart()
                        return Number(workMinutes) * 60
                    }
                }
                return prev - 1
            })
            document.title = `${(hours * 60 + minutes).toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }

        worker.postMessage('start')
        return () => {
            worker.terminate()
        }
    })

    const handleStart = () => {
        setTime(Number(workMinutes) * 60);
        const now = new Date()
        setSelectedTab(now.toLocaleDateString())
        startWorkPlay()
        setHoursWorkedFn((prev: any) => {
            if (prev.length > 0 && prev[prev.length - 1].end === null) return prev
            return [...prev, { start: new Date(now), end: null }]
        });
        setIsRunning(true);
        setIsWorkTime(true)
    };

    const handleStop = () => {
        setIsRunning(false);
        handleWorkSessionEnd()
        // setTime(0);
    };
    const handleStartStop = () => {
        isRunning ? handleStop() : handleStart()
    }

    const handleReset = () => {
        setIsRunning(false);
        setIsWorkTime(false);

        // Remove last entry from the hoursWorked array
        if (isWorkTime) {
            setHoursWorkedFn((prev: any) => [...prev.slice(0, prev.length - 1)])
        }
        setTime(Number(workMinutes) * 60);
    }

    const handleWorkSessionEnd = () => {
        shutdownPlay()

        if (!isWorkTime) return;
        setHoursWorkedFn((prev: any) => {
            return [...prev.slice(0, prev.length - 1), { ...prev[prev.length - 1], end: new Date(Date.now()) }]
        });
        setIsWorkTime(false)
    }

    return (
        <div className='w-96 h-60 [&>*]:overflow-clip'>
            <h1 className='text-9xl font-micro flex justify-center h-32'>{hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0')}</h1>
            <div className='flex flex-row gap-4 justify-around text-4xl h-28 [&>*]:bg-red-400'>
                <button className='w-24 h-24' onClick={handleStartStop}><img src={isRunning ? pauseButton : playButton} alt="Play or pause button" /></button>
                <button className='w-24 h-24' onClick={handleReset}>↺</button>
                <button className='w-24 h-24' onClick={() => setShowSettings((x: boolean) => !x)}><img src={settingsButton} className='m-auto' /></button>
            </div>
        </div>
    );
}