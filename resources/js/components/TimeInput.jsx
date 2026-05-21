import { useState } from "react";
import { formatMinutes } from "../utils/format";

export default function TimeInput({ value, onChange, min = 0 }) {
    const [step, setStep] = useState(30);

    const changeTime = (amount) => {
        const nextValue = Number(value || 0) + amount;

        if (nextValue < min) {
            onChange(min);
            return;
        }

        onChange(nextValue);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold">勉強時間</label>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">記録単位</span>

                    <select
                        value={step}
                        onChange={(e) => setStep(Number(e.target.value))}
                        className="rounded border px-2 py-1 text-xs"
                    >
                        <option value={15}>15分</option>
                        <option value={30}>30分</option>
                        <option value={60}>60分</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex-1 rounded border px-3 py-2 text-center font-bold">
                    {formatMinutes(Number(value || 0))}
                </div>

                <button
                    type="button"
                    onClick={() => changeTime(step)}
                    className="rounded border px-3 py-2 hover:bg-blue-500 hover:text-white"
                >
                    +{step}
                </button>

                <button
                    type="button"
                    onClick={() => changeTime(-step)}
                    className="rounded border px-3 py-2 hover:bg-red-500 hover:text-white"
                >
                    -{step}
                </button>
            </div>
        </div>
    );
}
