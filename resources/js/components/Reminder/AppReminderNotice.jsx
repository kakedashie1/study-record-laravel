export default function AppReminderNotice({ reminderNoticeCount, setActivePanel }) {
    if (!reminderNoticeCount || reminderNoticeCount <= 0) {
        return null;
    }

    return (
        <div className="mb-3 rounded-2xl border border-orange-200 bg-orange-50 p-3 shadow-sm dark:border-orange-900 dark:bg-orange-900/30">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-bold text-orange-700 dark:text-orange-200">
                        復習があります
                    </p>

                    <p className="mt-1 text-xs text-orange-700 dark:text-orange-200">
                        期限切れ・今日のリマインドが {reminderNoticeCount} 件あります。
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setActivePanel("reminder")}
                    className="shrink-0 rounded-lg bg-orange-600 px-3 py-2 text-xs font-bold text-white"
                >
                    確認
                </button>
            </div>
        </div>
    );
}
