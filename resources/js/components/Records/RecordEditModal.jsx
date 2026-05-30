import TimeInput from "./TimeInput";

export default function RecordEditModal({
    editingRecord,
    setEditingRecord,
    editForm,
    categories,
    listDate,
    fetchListRecordsByDate,
    fetchDashboardData,
    fetchChartData,
}) {
    if (!editingRecord) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setEditingRecord(null)}
        >
            <div
                className="w-[400px] rounded-xl bg-white p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="mb-4 text-xl font-bold">学習記録編集</h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();

                        editForm.put(`/update/${editingRecord.id}`, {
                            onSuccess: () => {
                                setEditingRecord(null);
                                fetchListRecordsByDate(listDate);
                                fetchDashboardData();
                                fetchChartData();
                            },
                        });
                    }}
                >
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-bold">
                            日付
                        </label>

                        <input
                            type="date"
                            value={editForm.data.study_date}
                            onChange={(e) =>
                                editForm.setData("study_date", e.target.value)
                            }
                            className="w-full rounded border px-2 py-1"
                        />

                        {editForm.errors.study_date && (
                            <p className="text-red-500">
                                {editForm.errors.study_date}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-bold">
                            カテゴリー
                        </label>

                        <select
                            value={editForm.data.category_id}
                            onChange={(e) =>
                                editForm.setData("category_id", e.target.value)
                            }
                            className="w-full rounded border px-2 py-1"
                        >
                            <option value="">選択してください</option>

                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>

                        {editForm.errors.category_id && (
                            <p className="text-red-500">
                                {editForm.errors.category_id}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <TimeInput
                            value={editForm.data.study_time}
                            onChange={(value) =>
                                editForm.setData("study_time", value)
                            }
                            min={30}
                        />

                        {editForm.errors.study_time && (
                            <p className="text-red-500">
                                {editForm.errors.study_time}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setEditingRecord(null)}
                            className="rounded border px-4 py-2"
                        >
                            キャンセル
                        </button>

                        <button
                            type="submit"
                            disabled={editForm.processing}
                            className="rounded bg-blue-500 px-4 py-2 text-white"
                        >
                            更新
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
