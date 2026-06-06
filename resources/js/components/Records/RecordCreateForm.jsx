import TimeInput from "./TimeInput";
import CategorySelect from "../Categories/CategorySelect";

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
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-100">
                            日付
                        </label>
                    </div>

                    <input
                        type="date"
                        value={data.study_date}
                        onChange={(e) => setData("study_date", e.target.value)}
                        className="h-10 w-full max-w-full min-w-0 rounded border border-slate-300 bg-white px-1 py-1 text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 sm:px-2 sm:text-sm"
                    />
                </div>

                {/* カテゴリー */}
                <div className="min-w-0">
                    <div className="mb-1 flex h-7 items-center justify-between gap-1">
                        <label className="truncate text-xs font-bold text-slate-700 dark:text-slate-100">
                            カテゴリー
                        </label>

                        <button
                            type="button"
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="shrink-0 whitespace-nowrap rounded border border-slate-300 px-1 py-1 text-[10px] text-slate-700 hover:bg-blue-500 hover:text-white dark:border-slate-600 dark:text-slate-100 dark:hover:bg-blue-600 sm:px-2 sm:text-xs"
                        >
                            カテゴリー編集
                        </button>
                    </div>

                    <CategorySelect
                        categories={categories}
                        value={data.category_id}
                        onChange={(value) => setData("category_id", value)}
                        placeholder="選択してください"
                    />

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
                className="w-full rounded-xl bg-blue-600 px-3 py-1.5 text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
                登録する
            </button>
        </form>
    );
}
