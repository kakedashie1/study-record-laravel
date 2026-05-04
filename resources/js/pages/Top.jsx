import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { formatMinutes } from "../utils/format";
import { router } from "@inertiajs/react";

export default function Top({
    categories,
    records,
    todayStudyTime,
    weeklyStudyTime: weeklyStudyTimeProp,
    monthlyStudyTime: monthlyStudyTimeProp,
    yearlyStudyTime: yearlyStudyTimeProp,
    totalStudyTime: totalStudyTimeProp,
}) {
    const today = new Date().toLocaleDateString("sv-SE").slice(0, 10);
    const [weeklyStudyTime, setWeeklyStudyTime] = useState(weeklyStudyTimeProp);
    const [monthlyStudyTime, setMonthlyStudyTime] =
        useState(monthlyStudyTimeProp);
    const [yearlyStudyTime, setYearlyStudyTime] = useState(yearlyStudyTimeProp);
    const [totalStudyTime, setTotalStudyTime] = useState(totalStudyTimeProp);
    const [summaryType, setSummaryType] = useState("daily");
    const [editingRecord, setEditingRecord] = useState(null);
    const editForm = useForm({
        study_time: "",
        category_id: "",
        study_date: "",
    });
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const categoryForm = useForm({
        category_name: "",
    });
    const [selectedDate, setSelectedDate] = useState(today);
    const [displayRecords, setDisplayRecords] = useState(records);
    const [displayStudyTime, setDisplayStudyTime] = useState(todayStudyTime);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        study_time: "",
        category_id: "",
        study_date: selectedDate,
    });

    const fetchRecordsByDate = async (date) => {
        try {
            setLoading(true);
            setErrorMessage("");

            const response = await fetch(`/records/by-date?date=${date}`);

            if (!response.ok) {
                throw new Error("記録の取得に失敗しました");
            }

            const result = await response.json();

            setDisplayRecords(result.records);
            setDisplayStudyTime(result.todayStudyTime);
            setWeeklyStudyTime(result.weeklyStudyTime);
            setMonthlyStudyTime(result.monthlyStudyTime);
            setYearlyStudyTime(result.yearlyStudyTime);
            setTotalStudyTime(result.totalStudyTime);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post("/store", {
            onSuccess: () => {
                reset();
                fetchRecordsByDate(selectedDate);
            },
        });
    };

    const handleDateChange = (e) => {
        const date = e.target.value;

        setSelectedDate(date);
        setData("study_date", date);
        fetchRecordsByDate(date);
    };

    const summaryLabels = {
        daily: `${selectedDate} 勉強時間`,
        weekly: "今週の勉強時間",
        monthly: "今月の勉強時間",
        yearly: "今年の勉強時間",
        total: "総勉強時間",
    };

    const summaryValues = {
        daily: displayStudyTime,
        weekly: weeklyStudyTime,
        monthly: monthlyStudyTime,
        yearly: yearlyStudyTime,
        total: totalStudyTime,
    };

    return (
        <>
            <div className="grid grid-cols-4 gap-4">
                <h1 className="col-span-4 text-2xl font-bold ml-4 mt-4">
                    学習時間記録アプリ
                </h1>
                <section className="col-span-4 flex justify-center">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="text-2xl  cursor-pointer"
                    />
                </section>

                <section className="col-span-4 flex justify-center flex-row items-center mt-4 mb-4 ">
                    <div className="flex flex-col items-center outline-2 outline-offset-2 outline-gray-200 p-4">
                        <h2 className="text-xl mb-2">
                            {summaryLabels[summaryType]}
                        </h2>

                        <select
                            value={summaryType}
                            onChange={(e) => setSummaryType(e.target.value)}
                            className="border rounded px-2 py-1 mb-2"
                        >
                            <option value="daily">日別</option>
                            <option value="weekly">週別</option>
                            <option value="monthly">月別</option>
                            <option value="yearly">年別</option>
                            <option value="total">総合計</option>
                        </select>

                        <p className="text-lg">
                            {loading
                                ? "読み込み中..."
                                : formatMinutes(summaryValues[summaryType])}
                        </p>

                        {errorMessage && <p>{errorMessage}</p>}
                    </div>
                </section>
                <h2 className="col-span-4 flex justify-center text-xl">
                    学習記録登録
                </h2>
                <section className="col-span-4  flex justify-center mb-4">
                    <form
                        onSubmit={submit}
                        className="flex flex-row items-center gap-8 outline-2 outline-offset-2 outline-gray-200 p-4"
                    >
                        <div className="">
                            <button
                                type="button"
                                onClick={() => setIsCategoryModalOpen(true)}
                                className="border-1 border-solid w-full rounded-xl cursor-pointer hover:bg-blue-500 hover:text-white"
                            >
                                カテゴリー
                            </button>
                            <br />
                            <select
                                value={data.category_id}
                                onChange={(e) =>
                                    setData("category_id", e.target.value)
                                }
                                className="border-1 border-solid mt-2"
                            >
                                <option value="">選択してください</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.category_name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <div className="text-red-500">
                                    {errors.category_id}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center flex-col items-center">
                            <label className="text-center">
                                勉強時間（分）
                            </label>
                            <input
                                type="number"
                                value={data.study_time}
                                step="30"
                                min="30"
                                onChange={(e) =>
                                    setData("study_time", e.target.value)
                                }
                                className="border-2 border-solid mt-2 text-center"
                            />
                            {errors.study_time && (
                                <div className="text-red-500">
                                    {errors.study_time}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="border-1 border-solid cursor-pointer p-1 transition delay-5 duration-30 ease-in-out hover:-translate-y-1 hover:scale-100 hover:gray-200 hover:shadow-xl rounded-xs"
                        >
                            登録
                        </button>
                    </form>
                </section>

                <section className="col-span-4  flex justify-center">
                    <div className="h-48 overflow-y-auto  outline-2 outline-offset-2 outline-gray-200">
                        {loading ? (
                            <p>読み込み中...</p>
                        ) : displayRecords.length === 0 ? (
                            <p>この日の記録はありません。</p>
                        ) : (
                            <table className="table-auto table-fixed border-separate border-spacing-x-8 border-spacing-y-4">
                                <thead>
                                    <tr className="py-6">
                                        <th className="sticky top-0 bg-stone-50">
                                            カテゴリー
                                        </th>
                                        <th className="sticky top-0 bg-stone-50">
                                            勉強時間
                                        </th>
                                        <th className="sticky top-0 bg-stone-50">
                                            削除
                                        </th>
                                        <th className="sticky top-0 bg-stone-50 py-2">
                                            編集
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayRecords.map((record) => (
                                        <tr key={record.id}>
                                            <td>
                                                {record.category
                                                    ?.category_name ?? "未設定"}
                                            </td>
                                            <td>
                                                {formatMinutes(
                                                    record.study_time,
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                "本当に削除しますか？",
                                                            )
                                                        ) {
                                                            router.delete(
                                                                "/destroy/" +
                                                                    record.id,
                                                                {
                                                                    onSuccess:
                                                                        () => {
                                                                            fetchRecordsByDate(
                                                                                selectedDate,
                                                                            );
                                                                        },
                                                                },
                                                            );
                                                        }
                                                    }}
                                                    className="border-1 border-solid cursor-pointer p-1 transition delay-5 duration-30 ease-in-out hover:-translate-y-1 hover:scale-100 hover:gray-200 hover:shadow-xl rounded-xs"
                                                >
                                                    削除
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        setEditingRecord(
                                                            record,
                                                        );
                                                        editForm.setData({
                                                            study_time:
                                                                record.study_time,
                                                            category_id:
                                                                record.category_id ||
                                                                "",
                                                            study_date:
                                                                record.study_date,
                                                        });
                                                    }}
                                                    className="border-1 border-solid cursor-pointer p-1 transition delay-5 duration-30 ease-in-out hover:-translate-y-1 hover:scale-100 hover:gray-200 hover:shadow-xl rounded-xs"
                                                >
                                                    編集
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </div>
            {/* 学習記録編集モーダル */}
            {editingRecord && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-[400px]">
                        <h2 className="text-xl font-bold mb-4">学習記録編集</h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                editForm.put(`/update/${editingRecord.id}`, {
                                    onSuccess: () => {
                                        setEditingRecord(null);
                                        fetchRecordsByDate(selectedDate);
                                    },
                                });
                            }}
                        >
                            <div className="mb-4">
                                <label>カテゴリー</label>
                                <select
                                    value={editForm.data.category_id}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "category_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border mt-1"
                                >
                                    <option value="">選択してください</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>

                                {editForm.errors.category_id && (
                                    <div className="text-red-500">
                                        {editForm.errors.category_id}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label>勉強時間（分）</label>
                                <input
                                    type="number"
                                    value={editForm.data.study_time}
                                    step="30"
                                    min="30"
                                    onChange={(e) =>
                                        editForm.setData(
                                            "study_time",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border mt-1 text-center"
                                />

                                {editForm.errors.study_time && (
                                    <div className="text-red-500">
                                        {editForm.errors.study_time}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingRecord(null)}
                                    className="border px-4 py-2 rounded"
                                >
                                    キャンセル
                                </button>

                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="border px-4 py-2 rounded bg-blue-500 text-white"
                                >
                                    更新
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* カテゴリー一覧モーダル */}
            {isCategoryModalOpen && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                    onClick={() => setIsCategoryModalOpen(false)}
                >
                    <div
                        className="bg-white p-6 rounded-xl w-[500px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">
                            カテゴリー管理
                        </h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                categoryForm.post("/categories/store", {
                                    onSuccess: () => {
                                        categoryForm.reset();
                                    },
                                });
                            }}
                            className="flex gap-2 mb-4"
                        >
                            <input
                                type="text"
                                value={categoryForm.data.category_name}
                                onChange={(e) =>
                                    categoryForm.setData(
                                        "category_name",
                                        e.target.value,
                                    )
                                }
                                className="border px-2 py-1 flex-1"
                                placeholder="カテゴリー名"
                            />

                            <button
                                type="submit"
                                disabled={categoryForm.processing}
                                className="border px-4 py-1 rounded"
                            >
                                追加
                            </button>
                        </form>

                        {categoryForm.errors.category_name && (
                            <p className="text-red-500">
                                {categoryForm.errors.category_name}
                            </p>
                        )}

                        <div className="max-h-64 overflow-y-auto">
                            <table className="w-full border-separate border-spacing-y-2">
                                <thead>
                                    <tr>
                                        <th>カテゴリー名</th>
                                        <th>削除</th>
                                        <th>編集</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {categories.map((category) => (
                                        <tr key={category.id}>
                                            <td>{category.category_name}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="border px-2 py-1 rounded"
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                "本当に削除しますか？",
                                                            )
                                                        ) {
                                                            router.delete(
                                                                `/categories/destroy/${category.id}`,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    削除
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="border px-2 py-1 rounded"
                                                    onClick={() => {
                                                        setEditingCategory(
                                                            category,
                                                        );
                                                        categoryForm.setData(
                                                            "category_name",
                                                            category.category_name,
                                                        );
                                                    }}
                                                >
                                                    編集
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                className="border px-4 py-2 rounded"
                                onClick={() => setIsCategoryModalOpen(false)}
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editingCategory && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]"
                    onClick={() => setEditingCategory(null)}
                >
                    <div
                        className="bg-white p-6 rounded-xl w-[400px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">
                            カテゴリー編集
                        </h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                categoryForm.put(
                                    `/categories/update/${editingCategory.id}`,
                                    {
                                        onSuccess: () => {
                                            setEditingCategory(null);
                                            categoryForm.reset();
                                        },
                                    },
                                );
                            }}
                        >
                            <input
                                type="text"
                                value={categoryForm.data.category_name}
                                onChange={(e) =>
                                    categoryForm.setData(
                                        "category_name",
                                        e.target.value,
                                    )
                                }
                                className="w-full border px-2 py-1 mb-4"
                            />

                            {categoryForm.errors.category_name && (
                                <p className="text-red-500">
                                    {categoryForm.errors.category_name}
                                </p>
                            )}

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="border px-4 py-2 rounded"
                                    onClick={() => setEditingCategory(null)}
                                >
                                    キャンセル
                                </button>

                                <button
                                    type="submit"
                                    disabled={categoryForm.processing}
                                    className="border px-4 py-2 rounded bg-blue-500 text-white"
                                >
                                    更新
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
