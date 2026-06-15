export default function AppReminderDialog({
    isOpen,
    onClose,
    reminderNoticeCount,
    setActivePanel,
}) {
    if (!isOpen || !reminderNoticeCount || reminderNoticeCount <= 0) {
        return null;
    }

    const goReminder = () => {
        setActivePanel("reminder");
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            復習があります
                        </h2>

                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            期限切れ・今日のリマインドが{" "}
                            <span className="font-bold text-orange-600">
                                {reminderNoticeCount}
                            </span>{" "}
                            件あります。
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-2 py-1 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700"
                    >
                        あとで
                    </button>

                    <button
                        type="button"
                        onClick={goReminder}
                        className="rounded-lg bg-purple-600 py-2 text-sm font-bold text-white hover:bg-purple-700"
                    >
                        確認する
                    </button>
                </div>
            </div>
        </div>
    );
}
