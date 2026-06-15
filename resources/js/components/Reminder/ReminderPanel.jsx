import { useState } from "react";
import ReminderList from "./ReminderList";
import ReminderCalendar from "./ReminderCalendar";
import ReminderCreateModal from "./ReminderCreateModal";
import ReminderSettingModal from "./ReminderSettingModal";

export default function ReminderPanel({ reminders, reminderSetting }) {
    const [viewMode, setViewMode] = useState("list");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSettingOpen, setIsSettingOpen] = useState(false);

    return (
        <section className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-white p-4 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    リマインド
                </h2>

                <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="absolute bottom-20 left-1/2 z-40 w-[90%] max-w-md -translate-x-1/2 rounded-full bg-purple-600 py-3 text-sm font-bold text-white shadow-lg hover:bg-purple-700"
                >
                    設定
                </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`rounded-lg border py-2 text-sm font-bold transition ${
                        viewMode === "list"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-100"
                    }`}
                >
                    一覧表示
                </button>

                <button
                    type="button"
                    onClick={() => setViewMode("calendar")}
                    className={`rounded-lg border py-2 text-sm font-bold transition ${
                        viewMode === "calendar"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-100"
                    }`}
                >
                    カレンダー表示
                </button>
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pb-32">
                {viewMode === "list" ? (
                    <ReminderList reminders={reminders} />
                ) : (
                    <ReminderCalendar reminders={reminders} />
                )}
            </div>

            <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="fixed bottom-20 left-1/2 z-40 w-[90%] max-w-md -translate-x-1/2 rounded-full bg-purple-600 py-3 text-sm font-bold text-white shadow-lg hover:bg-purple-700 lg:absolute lg:bottom-4"
            >
                ＋ リマインド作成
            </button>

            {isCreateOpen && (
                <ReminderCreateModal onClose={() => setIsCreateOpen(false)} />
            )}

            {isSettingOpen && (
                <ReminderSettingModal
                    reminderSetting={reminderSetting}
                    onClose={() => setIsSettingOpen(false)}
                />
            )}
        </section>
    );
}
