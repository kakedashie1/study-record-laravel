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
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm rounded-3xl border-4 border-red-500 bg-white p-6 text-slate-900 shadow-2xl dark:bg-slate-800 dark:text-slate-100"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-red-600">
                    TEST DIALOG
                </h2>

                <p className="mt-3 text-sm">
                    期限切れ・今日のリマインドが {reminderNoticeCount} 件あります。
                </p>

                <div className="mt-6 grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border py-3 text-sm font-bold"
                    >
                        あとで
                    </button>

                    <button
                        type="button"
                        onClick={goReminder}
                        className="rounded-xl bg-purple-600 py-3 text-sm font-bold text-white"
                    >
                        確認する
                    </button>
                </div>
            </div>
        </div>
    );
}
