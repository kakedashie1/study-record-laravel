import { router } from "@inertiajs/react";

function getReminderDate(reminder) {
    if (reminder.remind_date) return reminder.remind_date;
    if (reminder.remind_at) return reminder.remind_at.slice(0, 10);
    return null;
}

function getStatus(reminder) {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (reminder.remind_at) {
        const remindAt = new Date(reminder.remind_at);

        if (remindAt < now) {
            return {
                label: "期限切れ",
                className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
            };
        }

        const remindDate = new Date(remindAt);
        remindDate.setHours(0, 0, 0, 0);

        if (remindDate.getTime() === today.getTime()) {
            return {
                label: "今日",
                className: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200",
            };
        }

        return {
            label: "予定",
            className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200",
        };
    }

    if (reminder.remind_date) {
        const remindDate = new Date(reminder.remind_date);
        remindDate.setHours(0, 0, 0, 0);

        if (remindDate < today) {
            return {
                label: "期限切れ",
                className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
            };
        }

        if (remindDate.getTime() === today.getTime()) {
            return {
                label: "今日",
                className: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200",
            };
        }

        return {
            label: "予定",
            className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200",
        };
    }

    return {
        label: "未定",
        className: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100",
    };
}

function formatReminder(reminder) {
    if (reminder.remind_at) {
        const date = new Date(reminder.remind_at);

        return date.toLocaleString("ja-JP", {
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    if (reminder.remind_date) {
        const date = new Date(reminder.remind_date);

        return date.toLocaleDateString("ja-JP", {
            month: "numeric",
            day: "numeric",
            weekday: "short",
        });
    }

    return "未定";
}

function getStepLabel(step) {
    const labels = {
        1: "1回目",
        2: "2回目",
        3: "3回目",
        4: "4回目",
        5: "5回目",
    };

    return labels[step] ?? `${step}回目`;
}

export default function ReminderList({ reminders }) {
    const completeReminder = (id) => {
        router.patch(`/reminders/${id}/complete`, {}, {
            preserveScroll: true,
        });
    };

    const deleteReminder = (id) => {
        if (!confirm("このリマインドを削除しますか？")) return;

        router.delete(`/reminders/${id}`, {
            preserveScroll: true,
        });
    };

    if (!reminders || reminders.length === 0) {
        return (
            <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-300">
                リマインドはありません。
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {reminders.map((reminder) => {
                const status = getStatus(reminder);

                return (
                    <div
                        key={reminder.id}
                        className="rounded-xl border bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${status.className}`}
                                    >
                                        {status.label}
                                    </span>

                                    <span className="text-xs font-bold text-purple-600 dark:text-purple-300">
                                        {getStepLabel(reminder.step)}
                                    </span>
                                </div>

                                <p className="mt-2 break-words text-sm font-bold text-gray-800 dark:text-gray-100">
                                    {reminder.title}
                                </p>

                                {reminder.memo && (
                                    <p className="mt-1 whitespace-pre-wrap break-words text-xs text-gray-600 dark:text-gray-300">
                                        {reminder.memo}
                                    </p>
                                )}

                                <p className="mt-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                                    リマインド：{formatReminder(reminder)}
                                </p>
                            </div>

                            <div className="flex shrink-0 flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={() => completeReminder(reminder.id)}
                                    className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700"
                                >
                                    復習完了
                                </button>

                                <button
                                    type="button"
                                    onClick={() => deleteReminder(reminder.id)}
                                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                                >
                                    削除
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
