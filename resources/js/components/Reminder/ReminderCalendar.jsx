function getDateKey(reminder) {
    if (reminder.remind_date) return reminder.remind_date;
    if (reminder.remind_at) return reminder.remind_at.slice(0, 10);
    return "未定";
}

function formatDate(dateKey) {
    if (dateKey === "未定") return "未定";

    const date = new Date(dateKey);

    return date.toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
        weekday: "short",
    });
}

export default function ReminderCalendar({ reminders }) {
    if (!reminders || reminders.length === 0) {
        return (
            <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-300">
                カレンダーに表示するリマインドはありません。
            </div>
        );
    }

    const grouped = reminders.reduce((acc, reminder) => {
        const key = getDateKey(reminder);

        if (!acc[key]) {
            acc[key] = [];
        }

        acc[key].push(reminder);

        return acc;
    }, {});

    return (
        <div className="space-y-4">
            {Object.entries(grouped).map(([dateKey, items]) => (
                <div
                    key={dateKey}
                    className="rounded-xl border bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                >
                    <h3 className="border-b pb-2 text-sm font-bold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        {formatDate(dateKey)}
                    </h3>

                    <div className="mt-3 space-y-2">
                        {items.map((reminder) => (
                            <div
                                key={reminder.id}
                                className="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/30"
                            >
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                                    {reminder.title}
                                </p>

                                {reminder.memo && (
                                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                                        {reminder.memo}
                                    </p>
                                )}

                                <p className="mt-1 text-xs font-bold text-purple-600 dark:text-purple-300">
                                    {reminder.step}回目
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
