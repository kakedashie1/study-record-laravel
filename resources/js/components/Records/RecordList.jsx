import { router } from "@inertiajs/react";
import { formatMinutes } from "../../utils/format";

export default function RecordList({
    activePanel,
    listDate,
    listRecords,
    listStudyTime,
    loading,
    handleListDateChange,
    setEditingRecord,
    editForm,
    fetchListRecordsByDate,
    fetchDashboardData,
    fetchChartData,
}) {
    return (
        <section
            className={`${
                activePanel === "left" ? "flex" : "hidden"
            } h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900 sm:p-4 lg:col-span-3 lg:flex`}
        >
            <div className="mb-3">
                <h2 className="mb-3 text-base font-bold text-slate-700 dark:text-slate-100">
                    学習記録一覧
                </h2>

                <p className="text-sm text-gray-500 dark:text-slate-400">
                    選択した日の記録
                </p>
            </div>

            <div className="mb-3 min-w-0 overflow-hidden">
                <label className="mb-1 block text-sm font-bold text-slate-800 dark:text-slate-100">
                    日付を選択
                </label>

                <input
                    type="date"
                    value={listDate}
                    onChange={handleListDateChange}
                    className="box-border h-8 w-full max-w-full min-w-0 cursor-pointer rounded border border-slate-500 bg-white px-1 text-[10px] text-slate-900 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100 sm:text-sm"
                />
            </div>

            <div className="mb-3 rounded-2xl border border-blue-200 bg-white p-3 shadow-md transition-colors duration-300 dark:border-blue-800 dark:bg-slate-800">
                <p className="text-sm text-gray-600 dark:text-slate-300">
                    {listDate} の合計時間
                </p>

                <p className="text-xl font-bold text-gray-900 dark:text-slate-100">
                    {formatMinutes(listStudyTime)}
                </p>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-300 bg-white p-2 shadow-md transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800">
                <div className="h-full overflow-y-auto space-y-3 pb-20 pr-1 lg:pb-6">
                    {loading ? (
                        <p>読み込み中...</p>
                    ) : listRecords.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                            この日の記録はありません。
                        </p>
                    ) : (
                        listRecords.map((record) => (
                            <div
                                key={record.id}
                                className="rounded-2xl border p-3 shadow-md transition"
                                style={{
                                    backgroundColor: `${record.category?.color ?? "#9ca3af"}15`,
                                    borderColor:
                                        record.category?.color ?? "#d1d5db",
                                }}
                            >
                                {/* カテゴリー */}
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-3 w-3 rounded-full border"
                                        style={{
                                            backgroundColor:
                                                record.category?.color ??
                                                "#9ca3af",
                                        }}
                                    />

                                    <p className="font-bold text-gray-900 dark:text-slate-100">
                                        {record.category?.category_name ??
                                            "未設定"}
                                    </p>
                                </div>

                                {/* 時間 + ボタン */}
                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                                        {formatMinutes(record.study_time)}
                                    </p>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingRecord(record);

                                                editForm.setData({
                                                    study_time:
                                                        record.study_time,
                                                    category_id:
                                                        record.category_id ??
                                                        "",
                                                    study_date:
                                                        record.study_date,
                                                });
                                            }}
                                            className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-900 hover:bg-blue-500 hover:text-white dark:border-slate-600 dark:text-slate-100 dark:hover:bg-blue-600"
                                        >
                                            編集
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        "本当に削除しますか？",
                                                    )
                                                ) {
                                                    router.delete(
                                                        `/destroy/${record.id}`,
                                                        {
                                                            onSuccess: () => {
                                                                fetchListRecordsByDate(
                                                                    listDate,
                                                                );
                                                                fetchDashboardData();
                                                                fetchChartData();
                                                            },
                                                        },
                                                    );
                                                }
                                            }}
                                            className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                                        >
                                            削除
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
