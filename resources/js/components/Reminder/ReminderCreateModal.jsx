import { useForm } from "@inertiajs/react";

export default function ReminderCreateModal({ reminderSetting, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        memo: "",
    });

    const firstInterval = reminderSetting?.intervals?.[0] ?? {
        type: "hours",
        value: 6,
    };

    const firstReminderText =
        firstInterval.type === "hours"
            ? `${Number(firstInterval.value)}時間後`
            : firstInterval.type === "days"
              ? `${Number(firstInterval.value)}日後`
              : `${Number(firstInterval.value)}か月後`;

    const submit = (e) => {
        e.preventDefault();

        post("/reminders", {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl dark:bg-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        リマインド作成
                    </h3>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-2 py-1 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={submit} className="mt-4 space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-bold text-gray-700 dark:text-gray-200">
                            タイトル
                        </label>

                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 text-base dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                            placeholder="例：英単語100個"
                        />

                        {errors.title && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-bold text-gray-700 dark:text-gray-200">
                            メモ
                        </label>

                        <textarea
                            value={data.memo}
                            onChange={(e) => setData("memo", e.target.value)}
                            className="h-28 w-full rounded-lg border px-3 py-2 text-base dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                            placeholder="例：ターゲット1900 1〜100"
                        />

                        {errors.memo && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.memo}
                            </p>
                        )}
                    </div>

                    <div className="rounded-lg bg-purple-50 p-3 text-xs font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">
                        作成すると、まず{firstReminderText}
                        にリマインドされます。
                    </div>

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
                            作成
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
