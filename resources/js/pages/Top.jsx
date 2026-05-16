import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { formatMinutes } from "../utils/format";
import { router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

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
    const [chartDate, setChartDate] = useState(today);
    const [chartPeriod, setChartPeriod] = useState("daily");
    const [chartCategoryId, setChartCategoryId] = useState("");
    const [barChartData, setBarChartData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);

    const { auth } = usePage().props;
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

    const fetchChartData = async () => {
        try {
            const params = new URLSearchParams({
                date: chartDate,
                period: chartPeriod,
                category_id: chartCategoryId,
            });

            const response = await fetch(`/records/chart?${params.toString()}`);

            if (!response.ok) {
                throw new Error("グラフデータの取得に失敗しました");
            }

            const result = await response.json();

            setBarChartData(result.barChartData);
            setPieChartData(result.pieChartData);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        fetchChartData();
    }, [chartDate, chartPeriod, chartCategoryId]);

    const submit = (e) => {
        e.preventDefault();

        post("/store", {
            onSuccess: () => {
                reset();
                fetchRecordsByDate(selectedDate);
                fetchChartData();
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

    const formatChartLabel = (value) => {
        if (chartPeriod === "daily") {
            const date = new Date(value);
            const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

            return `${date.getMonth() + 1}/${date.getDate()}(${weekDays[date.getDay()]})`;
        }

        if (chartPeriod === "weekly") {
            const date = new Date(value);

            return `${date.getMonth() + 1}/${date.getDate()}週`;
        }

        if (chartPeriod === "monthly") {
            const [year, month] = value.split("-");

            return `${Number(month)}月`;
        }

        return value;
    };

    const getYAxisConfig = () => {
        if (chartPeriod === "daily") {
            return {
                domain: [0, 600],
                ticks: [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600],
            };
        }

        if (chartPeriod === "weekly") {
            return {
                domain: [0, 3000],
                ticks: [
                    0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000,
                ],
            };
        }

        if (chartPeriod === "monthly") {
            return {
                domain: [0, 6000],
                ticks: [
                    0, 600, 1200, 1800, 2400, 3000, 3600, 4200, 4800, 5400,
                    6000,
                ],
            };
        }

        return {
            domain: [0, 600],
            ticks: [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600],
        };
    };

    const yAxisConfig = getYAxisConfig();

    const getPieChartRangeLabel = () => {
        const date = new Date(chartDate);

        if (chartPeriod === "daily") {
            return `${date.getMonth() + 1}/${date.getDate()} の割合`;
        }

        if (chartPeriod === "weekly") {
            const startDate = new Date(date);
            const day = startDate.getDay();
            const diff = day === 0 ? -6 : 1 - day;

            startDate.setDate(startDate.getDate() + diff);

            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);

            return `${startDate.getMonth() + 1}/${startDate.getDate()}〜${endDate.getMonth() + 1}/${endDate.getDate()} の割合`;
        }

        if (chartPeriod === "monthly") {
            return `${date.getFullYear()}年${date.getMonth() + 1}月 の割合`;
        }

        return "カテゴリー別の割合";
    };

    return (
        <>
            <div className="h-screen overflow-hidden bg-white p-3">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold ml-4">
                        学習時間記録アプリ
                    </h1>
                    <div className="mr-4 ">
                        <label>{auth.user.name}</label>
                        <form method="POST" action="/logout" className="inline">
                            <button className="border-1 border-solid cursor-pointer p-1 transition delay-5 duration-30 ease-in-out hover:-translate-y-1 hover:scale-100 hover:gray-200 hover:shadow-xl rounded-xl ml-4">
                                ログアウト
                            </button>
                        </form>
                    </div>
                </div>
                <div className="grid h-[calc(100vh-68px)] grid-cols-12 gap-3 overflow-hidden">
                    <section className="col-span-3 h-full overflow-hidden rounded-xl border p-4">
                        <div className="h-86 overflow-y-auto  outline-2 outline-offset-2 outline-gray-200">
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
                                                        ?.category_name ??
                                                        "未設定"}
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
                                                                                fetchChartData();
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
                    <section className="col-span-4 h-full overflow-hidden rounded-xl border p-4">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="text-2xl  cursor-pointer"
                        />
                        <div className="flex flex-col items-center outline-2 outline-offset-2 outline-gray-200 p-4">
                            <div className="rounded-xl border p-3">
                                <h2 className="mb-4 text-lg font-bold text-blue-600">
                                    期間別の合計時間
                                </h2>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-lg border p-3">
                                        <p className="text-sm font-bold">
                                            日別
                                        </p>
                                        <p className="mt-2 text-2xl font-bold">
                                            {formatMinutes(displayStudyTime)}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border p-3">
                                        <p className="text-sm font-bold">
                                            週別
                                        </p>
                                        <p className="mt-2 text-2xl font-bold">
                                            {formatMinutes(weeklyStudyTime)}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border p-3">
                                        <p className="text-sm font-bold">
                                            月別
                                        </p>
                                        <p className="mt-2 text-2xl font-bold">
                                            {formatMinutes(monthlyStudyTime)}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border p-3">
                                        <p className="text-sm font-bold">
                                            年別
                                        </p>
                                        <p className="mt-2 text-2xl font-bold">
                                            {formatMinutes(yearlyStudyTime)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 rounded-lg border p-3">
                                    <p className="text-sm font-bold">総合計</p>
                                    <p className="mt-2 text-2xl font-bold">
                                        {formatMinutes(totalStudyTime)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h2 className="col-span-4 flex justify-center text-xl">
                            学習記録登録
                        </h2>

                        <form
                            onSubmit={submit}
                            noValidate
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
                    <section className="col-span-5 h-full min-h-0 overflow-hidden rounded-xl border p-3 flex flex-col">
                        <h2 className="mb-2 text-lg font-bold text-blue-600 shrink-0">
                            学習時間のグラフ
                        </h2>

                        {/* 条件選択 */}
                        <div className="grid grid-cols-3 gap-2 mb-2 shrink-0">
                            <div>
                                <label className="mb-1 block text-sm">
                                    日付を選択
                                </label>
                                <input
                                    type="date"
                                    value={chartDate}
                                    onChange={(e) =>
                                        setChartDate(e.target.value)
                                    }
                                    className="w-full rounded border px-2 py-1"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm">
                                    期間
                                </label>
                                <div className="flex">
                                    <button
                                        type="button"
                                        onClick={() => setChartPeriod("daily")}
                                        className={`px-3 py-1 ${
                                            chartPeriod === "daily"
                                                ? "bg-blue-600 text-white"
                                                : "border"
                                        }`}
                                    >
                                        日別
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setChartPeriod("weekly")}
                                        className={`px-3 py-1 ${
                                            chartPeriod === "weekly"
                                                ? "bg-blue-600 text-white"
                                                : "border"
                                        }`}
                                    >
                                        週別
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setChartPeriod("monthly")
                                        }
                                        className={`px-3 py-1 ${
                                            chartPeriod === "monthly"
                                                ? "bg-blue-600 text-white"
                                                : "border"
                                        }`}
                                    >
                                        月別
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm">
                                    カテゴリー
                                </label>
                                <select
                                    value={chartCategoryId}
                                    onChange={(e) =>
                                        setChartCategoryId(e.target.value)
                                    }
                                    className="w-full rounded border px-2 py-1"
                                >
                                    <option value="">すべてのカテゴリー</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 円グラフ */}
                        <div className="rounded-xl border p-2 mb-2 shrink-0">
                            <h3 className="mb-1 text-sm font-bold">
                                カテゴリー別の学習時間（
                                {getPieChartRangeLabel()}）
                            </h3>

                            <div className="flex h-[170px] items-center">
                                <div className="w-1/2 h-full">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={pieChartData}
                                                dataKey="total"
                                                nameKey="category_name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={35}
                                                outerRadius={60}
                                            >
                                                {pieChartData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                [
                                                                    "#2563eb",
                                                                    "#22c55e",
                                                                    "#f59e0b",
                                                                    "#8b5cf6",
                                                                    "#ef4444",
                                                                ][index % 5]
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </Pie>

                                            <Tooltip
                                                formatter={(value) =>
                                                    formatMinutes(value)
                                                }
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="w-1/2 pl-3">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="py-1 text-left">
                                                    カテゴリ
                                                </th>
                                                <th className="py-1 text-right">
                                                    時間
                                                </th>
                                                <th className="py-1 text-right">
                                                    割合
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {pieChartData.map((item, index) => {
                                                const total =
                                                    pieChartData.reduce(
                                                        (sum, data) =>
                                                            sum +
                                                            Number(data.total),
                                                        0,
                                                    );

                                                const percent =
                                                    total > 0
                                                        ? (
                                                              (Number(
                                                                  item.total,
                                                              ) /
                                                                  total) *
                                                              100
                                                          ).toFixed(1)
                                                        : 0;

                                                return (
                                                    <tr
                                                        key={index}
                                                        className="border-b"
                                                    >
                                                        <td className="py-1">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="h-2 w-2 rounded-full"
                                                                    style={{
                                                                        backgroundColor:
                                                                            [
                                                                                "#2563eb",
                                                                                "#22c55e",
                                                                                "#f59e0b",
                                                                                "#8b5cf6",
                                                                                "#ef4444",
                                                                            ][
                                                                                index %
                                                                                    5
                                                                            ],
                                                                    }}
                                                                />
                                                                {
                                                                    item.category_name
                                                                }
                                                            </div>
                                                        </td>

                                                        <td className="py-1 text-right">
                                                            {formatMinutes(
                                                                item.total,
                                                            )}
                                                        </td>

                                                        <td className="py-1 text-right">
                                                            {percent}%
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* 棒グラフ */}
                        <div className="rounded-xl border p-2 flex-1 min-h-0">
                            <h3 className="mb-1 text-sm font-bold">
                                学習時間の推移（棒グラフ）
                            </h3>

                            <div className="h-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis
                                            dataKey="label"
                                            interval={0}
                                            fontSize={10}
                                            tickFormatter={formatChartLabel}
                                        />

                                        <YAxis
                                            domain={yAxisConfig.domain}
                                            ticks={yAxisConfig.ticks}
                                            fontSize={10}
                                            tickFormatter={(value) =>
                                                formatMinutes(value)
                                            }
                                        />

                                        <Tooltip
                                            formatter={(value) =>
                                                formatMinutes(value)
                                            }
                                            labelFormatter={(value) =>
                                                formatChartLabel(value)
                                            }
                                        />

                                        <Bar dataKey="total" fill="#2563eb" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            {/* 学習記録編集モーダル */}
            {editingRecord && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                    onClick={() => setEditingRecord(null)}
                >
                    <div
                        className="bg-white p-6 rounded-xl w-[400px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">学習記録編集</h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                editForm.put(`/update/${editingRecord.id}`, {
                                    onSuccess: () => {
                                        setEditingRecord(null);
                                        fetchRecordsByDate(selectedDate);
                                        fetchChartData();
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
                                className="border-1 border-solid cursor-pointer p-1 transition delay-5 duration-30 ease-in-out hover:-translate-y-1 hover:scale-100 hover:gray-200 hover:shadow-xl rounded-xs"
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

                                <tbody className="text-center">
                                    {categories.map((category) => (
                                        <tr key={category.id}>
                                            <td>{category.category_name}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="border-1 border-solid cursor-pointer p-1 transition delay-5 duration-30 ease-in-out hover:-translate-y-1 hover:scale-100 hover:gray-200 hover:shadow-xl rounded-xs"
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
                                                    className="border-1 border-solid cursor-pointer p-1 transition delay-5 duration-30 ease-in-out hover:-translate-y-1 hover:scale-100 hover:gray-200 hover:shadow-xl rounded-xs"
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
                                className="border-1 border-solid cursor-pointer p-1 transition delay-5 duration-30 ease-in-out hover:-translate-y-1 hover:scale-100 hover:gray-200 hover:shadow-xl rounded-xs"
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
