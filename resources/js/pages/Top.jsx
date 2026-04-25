import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { formatMinutes } from "../utils/format";
import { router } from "@inertiajs/react";

export default function Top({ categories, records, todayStudyTime }) {
    const today = new Date().toLocaleDateString('sv-SE').slice(0, 10);

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
        setData('study_date', date);
        fetchRecordsByDate(date);
    };

    return (
        <div style={{ padding: "24px" }}>
            <h1>学習時間記録アプリ</h1>

            <section style={{ marginBottom: "24px" }}>
                <h2>表示日付</h2>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </section>

            <section style={{ marginBottom: "24px" }}>
                <h2>合計勉強時間</h2>
                <p>
                    {loading
                        ? "読み込み中..."
                        : formatMinutes(displayStudyTime)}
                </p>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </section>

            <section style={{ marginBottom: "24px" }}>
                <h2>勉強記録登録</h2>

                <form onSubmit={submit}>
                    <div style={{ marginBottom: "12px" }}>
                        <label>カテゴリー</label>
                        <br />
                        <select
                            value={data.category_id}
                            onChange={(e) =>
                                setData("category_id", e.target.value)
                            }
                        >
                            <option value="">選択してください</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <div style={{ color: "red" }}>
                                {errors.category_id}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                        <label>勉強時間（分）</label>
                        <br />
                        <input
                            type="number"
                            value={data.study_time}
                            step="30"
                            onChange={(e) =>
                                setData("study_time", e.target.value)
                            }
                        />
                        {errors.study_time && (
                            <div style={{ color: "red" }}>
                                {errors.study_time}
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={processing}>
                        登録
                    </button>
                </form>
            </section>

            <section>
                <h2>{selectedDate} の勉強記録一覧</h2>

                {loading ? (
                    <p>読み込み中...</p>
                ) : displayRecords.length === 0 ? (
                    <p>この日の記録はありません。</p>
                ) : (
                    <table
                        border="1"
                        cellPadding="8"
                        style={{ borderCollapse: "collapse" }}
                    >
                        <thead>
                            <tr>
                                <th>日付</th>
                                <th>カテゴリー</th>
                                <th>勉強時間</th>
                                <th>削除</th>
                                <th>編集</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayRecords.map((record) => (
                                <tr key={record.id}>
                                    <td>{record.study_date}</td>
                                    <td>{record.category?.name ?? "未設定"}</td>
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
                                        >
                                            編集
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}
