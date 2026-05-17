import { useState } from "react";
import { formatMinutes } from "../utils/format";

export default function TimeInput({
    value,
    onChange,
    min = 0,
}) {
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

            {/* 調整単位 */}
            <div>
                <label className="mb-1 block text-xs font-bold">
                    調整単位
                </label>

                <select
                    value={step}
                    onChange={(e) => setStep(Number(e.target.value))}
                    className="w-full rounded border px-2 py-1"
                >
                    <option value={15}>15分</option>
                    <option value={30}>30分</option>
                    <option value={60}>60分</option>
                </select>
            </div>

            {/* 時間入力 */}
            <div className="flex items-center gap-2">

                {/* 時間表示 */}
                <div className="flex-1 rounded border px-3 py-2 text-center font-bold">
                    {formatMinutes(Number(value || 0))}
                </div>

                {/* プラス */}
                <button
                    type="button"
                    onClick={() => changeTime(step)}
                    className="rounded border px-3 py-2 hover:bg-blue-500 hover:text-white"
                >
                    +{step}
                </button>

                {/* マイナス */}
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
