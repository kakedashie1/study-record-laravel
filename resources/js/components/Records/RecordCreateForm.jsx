import TimeInput from "./TimeInput";

export default function RecordCreateForm({
    data,
    setData,
    errors,
    processing,
    submit,
    categories,
    setIsCategoryModalOpen,
}) {
    return (
        <form onSubmit={submit} noValidate className="space-y-2">
            <div className="grid w-full grid-cols-[42%_1fr] gap-3">
                {/* 日付 */}
                <div className="min-w-0">
                    <div className="mb-1 flex h-7 items-center">
                        <label className="text-xs font-bold">日付</label>
                    </div>

                    <input
                        type="date"
                        value={data.study_date}
                        onChange={(e) => setData("study_date", e.target.value)}
                        className="h-10 w-full max-w-full min-w-0 rounded border px-1 py-1 text-xs sm:px-2 sm:text-sm"
                    />
                </div>

                {/* カテゴリー */}
                <div className="min-w-0">
                    <div className="mb-1 flex h-7 items-center justify-between gap-1">
                        <label className="truncate text-xs font-bold">
                            カテゴリー
                        </label>

                        <button
                            type="button"
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="shrink-0 whitespace-nowrap rounded border px-1 py-1 text-[10px] hover:bg-blue-500 hover:text-white sm:px-2 sm:text-xs"
                        >
                            編集
                        </button>
                    </div>

                    <select
                        value={data.category_id}
                        onChange={(e) => setData("category_id", e.target.value)}
                        className="h-10 w-full max-w-full min-w-0 rounded border bg-white px-1 py-1 text-xs sm:px-2 sm:text-sm"
                    >
                        <option value="">選択してください</option>

                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>

                    {errors.category_id && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.category_id}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <TimeInput
                    value={data.study_time}
                    onChange={(value) => setData("study_time", value)}
                    min={30}
                />

                {errors.study_time && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.study_time}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
            >
                登録する
            </button>
        </form>
    );
}
