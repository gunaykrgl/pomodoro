function Card({ title, value, setValue, step }: { title: string, value: number, setValue: Function, step: number }) {
    function handleInputChange(e: any) {
        setValue(e.target.value)
    }

    return (
        <div className="flex flex-col border-gray-500 border-2 w-36 h-32">
            <label htmlFor={title} className="text-xl">{title}</label>
            <br />
            <input type="number" key={title} id={title} step={step} min="0"
                className="bg-slate-500 bg-opacity-20 w-16 h-16 ml-2 text-center text-4xl"
                placeholder={`${value}`} value={value}
                onChange={handleInputChange} />
        </div>
    )
}

export default function Settings({ showSettings, setWorkMinutes, setBreakMinutes, workMinutes, breakMinutes }:
    { showSettings: boolean, setWorkMinutes: Function, setBreakMinutes: Function, workMinutes: number, breakMinutes: number }) {
    if (!showSettings) return null;


    return (
        <div className="py-5">
            <div className="flex justify-center">
                <div className="flex flex-row gap-4 pl-4">
                    <Card title="Work Minutes" value={workMinutes} setValue={setWorkMinutes} step={5}/>
                    <Card title="Break Minutes" value={breakMinutes} setValue={setBreakMinutes} step={1}/>
                </div>
            </div>

        </div>
    )
}