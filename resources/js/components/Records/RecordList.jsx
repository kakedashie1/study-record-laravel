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
            } h-full min-w-0 flex-col overflow-hidden rounded-xl border p-2 sm:p-4 lg:col-span-3 lg:flex`}
        >
            <div className="mb-3">
                <h2 className="text-lg font-bold text-blue-600">
                    学習記録一覧
                </h2>

                <p className="text-sm text-gray-500">選択した日の記録</p>
            </div>

            <div className="mb-3 min-w-0 overflow-hidden">
                <label className="mb-1 block text-sm font-bold">
                    日付を選択
                </label>

                <input
                    type="date"
                    value={listDate}
                    onChange={handleListDateChange}
                    className="block h-9 w-full max-w-full min-w-0 appearance-none rounded border px-1 py-1 text-xs sm:h-10 sm:px-3 sm:py-2 sm:text-sm"
                />
            </div>

            <div className="mb-3 rounded-lg bg-blue-50 p-3">
                <p className="text-sm text-gray-600">{listDate} の合計時間</p>

                <p className="text-xl font-bold text-blue-600">
                    {formatMinutes(listStudyTime)}
                </p>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden rounded-xl bg-gray-50 p-2">
                <div className="h-full overflow-y-auto space-y-3 pb-6 pr-1">
                    {loading ? (
                        <p>読み込み中...</p>
                    ) : listRecords.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            この日の記録はありません。
                        </p>
                    ) : (
                        listRecords.map((record) => (
                            <div
                                key={record.id}
                                className="rounded-xl border bg-white p-3 shadow-sm"
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

                                    <p className="font-bold text-blue-600">
                                        {record.category?.category_name ??
                                            "未設定"}
                                    </p>
                                </div>

                                {/* 時間 + 編集削除 */}
                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-xl font-bold text-gray-800">
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
                                            className="rounded border px-3 py-1 text-sm hover:bg-blue-500 hover:text-white"
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
