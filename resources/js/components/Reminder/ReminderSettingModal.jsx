import { useForm } from "@inertiajs/react";

const defaultIntervals = [
    { type: "hours", value: 6 },
    { type: "days", value: 1 },
    { type: "days", value: 3 },
    { type: "days", value: 7 },
    { type: "months", value: 1 },
];

export default function ReminderSettingModal({ reminderSetting, onClose }) {
    const { data, setData, patch, processing, errors } = useForm({
        previous_day_notify_time:
            reminderSetting?.previous_day_notify_time?.slice(0, 5) ?? "22:00",
        same_day_notify_time:
            reminderSetting?.same_day_notify_time?.slice(0, 5) ?? "07:00",
        intervals: reminderSetting?.intervals ?? defaultIntervals,
    });

    const updateInterval = (index, key, value) => {
        const next = [...data.intervals];

        next[index] = {
            ...next[index],
            [key]: key === "value" ? Number(value) : value,
        };

        setData("intervals", next);
    };

    const submit = (e) => {
        e.preventDefault();

        patch("/reminder-settings", {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-4 shadow-xl dark:bg-gray-800">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        リマインド設定
                    </h3>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-2 py-1 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={submit} className="mt-4 space-y-5">
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                            通知時刻
                        </h4>

                        <div>
                            <label className="mb-1 block text-xs font-bold text-gray-600 dark:text-gray-300">
                                前日通知
                            </label>

                            <input
                                type="time"
                                value={data.previous_day_notify_time}
                                onChange={(e) =>
                                    setData(
                                        "previous_day_notify_time",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold text-gray-600 dark:text-gray-300">
                                当日通知
                            </label>

                            <input
                                type="time"
                                value={data.same_day_notify_time}
                                onChange={(e) =>
                                    setData(
                                        "same_day_notify_time",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                            復習間隔
                        </h4>

                        {data.intervals.map((interval, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-[70px_1fr_1fr] items-center gap-2"
                            >
                                <p className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                    {index + 1}回目
                                </p>

                                <input
                                    type="number"
                                    min="1"
                                    value={interval.value}
                                    onChange={(e) =>
                                        updateInterval(
                                            index,
                                            "value",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                                />

                                <select
                                    value={interval.type}
                                    onChange={(e) =>
                                        updateInterval(
                                            index,
                                            "type",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-2 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                                >
                                    <option value="hours">時間後</option>
                                    <option value="days">日後</option>
                                    <option value="months">か月後</option>
                                </select>
                            </div>
                        ))}
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <p className="text-xs text-red-600">
                            入力内容を確認してください。
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
                        >
                            キャンセル
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-purple-600 py-2 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-60"
                        >
                            保存
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
