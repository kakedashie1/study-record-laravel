import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { formatMinutes } from "../utils/format";
import { router } from "@inertiajs/react";

export default function Top({ categories, records, todayStudyTime }) {
    const today = new Date().toLocaleDateString("sv-SE").slice(0, 10);

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
            setDisplayStudyTime(result.totalStudyTime);
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

    return (
        <div class="grid grid-cols-4 gap-4">
            <h1 class="col-span-4 text-2xl font-bold ml-4 mt-4">学習時間記録アプリ</h1>
            <section  class="col-span-4 flex justify-center">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    class="text-2xl"
                />
            </section>

            <section class="col-span-4 flex justify-center flex-col items-center mt-4 mb-4 ">
                <div class="bg-stone-50 rounded-lg p-4 flex flex-col items-center">
                <h2 class="text-xl mb-2">{selectedDate} 勉強時間</h2>
                <p class="text-lg">
                    {loading
                        ? "読み込み中..."
                        : formatMinutes(displayStudyTime)}

                </p>
                {errorMessage && <p>{errorMessage}</p>}
                </div>
            </section>
            <h2 class="col-span-4 flex justify-center text-xl">勉強記録登録</h2>
            <section class="col-span-4  flex justify-center mb-4">
                <form onSubmit={submit} class="flex flex-row items-center gap-8 outline-2 outline-offset-2 outline-gray-200 p-4">
                    <div class="">
                        <button
                            type="button"
                            onClick={() => router.get("/categories")}
                            class="border-1 border-solid w-full rounded-xl"
                        >
                            カテゴリー
                        </button>
                        <br />
                        <select
                            value={data.category_id}
                            onChange={(e) =>
                                setData("category_id", e.target.value)
                            }
                            class="border-1 border-solid mt-2"
                        >
                            <option value="" >選択してください</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <div>{errors.category_id}</div>}
                    </div>

                    <div class="flex justify-center flex-col items-center">
                        <label class="text-center">勉強時間（分）</label>
                        <input
                            type="number"
                            value={data.study_time}
                            step="30"
                            min="30"
                            onChange={(e) =>
                                setData("study_time", e.target.value)
                            }
                            class="border-2 border-solid mt-2 text-center"
                        />
                        {errors.study_time && <div>{errors.study_time}</div>}
                    </div>

                    <button type="submit" disabled={processing} class="border-1 border-solid cursor-pointer p-1 transition delay-5 duration-30 ease-in-out hover:-translate-y-1 hover:scale-100 hover:gray-200 hover:shadow-xl rounded-xs">
                        登録
                    </button>
                </form>
            </section>

            <section class="col-span-4  flex justify-center">
                <div class="h-48 overflow-y-auto  outline-2 outline-offset-2 outline-gray-200">
                {loading ? (
                    <p>読み込み中...</p>
                ) : displayRecords.length === 0 ? (
                    <p>この日の記録はありません。</p>
                ) : (
                    <table  class="table-auto table-fixed border-separate border-spacing-x-8 border-spacing-y-4">
                        <thead>
                            <tr class="py-6">
                                <th class="sticky top-0 bg-stone-50">カテゴリー</th>
                                <th class="sticky top-0 bg-stone-50">勉強時間</th>
                                <th class="sticky top-0 bg-stone-50">削除</th>
                                <th class="sticky top-0 bg-stone-50 py-2">編集</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayRecords.map((record) => (
                                <tr key={record.id}>
                                    <td>
                                        {record.category?.category_name ??
                                            "未設定"}
                                    </td>
                                    <td>{formatMinutes(record.study_time)}</td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        "本当に削除しますか？",
                                                    )
                                                ) {
                                                    router.delete(
                                                        "/destroy/" + record.id,
                                                        {
                                                            onSuccess: () => {
                                                                fetchRecordsByDate(
                                                                    selectedDate,
                                                                );
                                                            },
                                                        },
                                                    );
                                                }
                                            }}
                                            class="border-1 border-solid cursor-pointer p-1 transition delay-5 duration-30 ease-in-out hover:-translate-y-1 hover:scale-100 hover:gray-200 hover:shadow-xl rounded-xs"
                                        >
                                            削除
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                router.get(
                                                    "/edit/" + record.id,
                                                );
                                            }}
                                            class="border-1 border-solid cursor-pointer p-1 transition delay-5 duration-30 ease-in-out hover:-translate-y-1 hover:scale-100 hover:gray-200 hover:shadow-xl rounded-xs"
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
    );
}
