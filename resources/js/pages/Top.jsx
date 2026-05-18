import { useState, useEffect } from "react";
import { useForm, router, usePage } from "@inertiajs/react";
import { formatMinutes } from "../utils/format";
import TimeInput from "../components/TimeInput";

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

    const { auth } = usePage().props;

    /*
    |--------------------------------------------------------------------------
    | グラフ
    |--------------------------------------------------------------------------
    */

    const [chartDate, setChartDate] = useState(today);

    const [chartPeriod, setChartPeriod] = useState("daily");

    const [chartCategoryId, setChartCategoryId] = useState("");

    const [barChartData, setBarChartData] = useState([]);

    const [pieChartData, setPieChartData] = useState([]);

    /*
    |--------------------------------------------------------------------------
    | ダッシュボード
    |--------------------------------------------------------------------------
    */

    const [dashboardTodayTime, setDashboardTodayTime] =
        useState(todayStudyTime);

    const [dashboardWeeklyTime, setDashboardWeeklyTime] =
        useState(weeklyStudyTimeProp);

    const [dashboardMonthlyTime, setDashboardMonthlyTime] =
        useState(monthlyStudyTimeProp);

    const [dashboardYearlyTime, setDashboardYearlyTime] =
        useState(yearlyStudyTimeProp);

    const [dashboardTotalTime, setDashboardTotalTime] =
        useState(totalStudyTimeProp);

    /*
    |--------------------------------------------------------------------------
    | 左列一覧
    |--------------------------------------------------------------------------
    */

    const [listDate, setListDate] = useState(today);

    const [listRecords, setListRecords] = useState(records);

    const [listStudyTime, setListStudyTime] = useState(todayStudyTime);

    /*
    |--------------------------------------------------------------------------
    | モーダル
    |--------------------------------------------------------------------------
    */

    const [editingRecord, setEditingRecord] = useState(null);

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    const [editingCategory, setEditingCategory] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | その他
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Form
    |--------------------------------------------------------------------------
    */

    const { data, setData, post, processing, errors, reset } = useForm({
        study_time: "",
        category_id: "",
        study_date: today,
    });

    const editForm = useForm({
        study_time: "",
        category_id: "",
        study_date: "",
    });

    const categoryForm = useForm({
        category_name: "",
    });

    /*
    |--------------------------------------------------------------------------
    | 一覧取得
    |--------------------------------------------------------------------------
    */

    const fetchListRecordsByDate = async (date) => {
        try {
            setLoading(true);

            setErrorMessage("");

            const response = await fetch(`/records/by-date?date=${date}`);

            if (!response.ok) {
                throw new Error("記録の取得に失敗しました");
            }

            const result = await response.json();

            setListRecords(result.records);

            setListStudyTime(result.todayStudyTime);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | ダッシュボード取得
    |--------------------------------------------------------------------------
    */

    const fetchDashboardData = async () => {
        try {
            const response = await fetch("/records/dashboard");

            if (!response.ok) {
                throw new Error("ダッシュボードデータ取得失敗");
            }

            const result = await response.json();

            setDashboardTodayTime(result.todayStudyTime);

            setDashboardWeeklyTime(result.weeklyStudyTime);

            setDashboardMonthlyTime(result.monthlyStudyTime);

            setDashboardYearlyTime(result.yearlyStudyTime);

            setDashboardTotalTime(result.totalStudyTime);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | グラフ取得
    |--------------------------------------------------------------------------
    */

    const fetchChartData = async () => {
        try {
            const params = new URLSearchParams({
                date: chartDate,
                period: chartPeriod,
                category_id: chartCategoryId,
            });

            const response = await fetch(`/records/chart?${params.toString()}`);

            if (!response.ok) {
                throw new Error("グラフデータ取得失敗");
            }

            const result = await response.json();

            setBarChartData(result.barChartData);

            setPieChartData(result.pieChartData);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | useEffect
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        fetchChartData();
    }, [chartDate, chartPeriod, chartCategoryId]);

    /*
    |--------------------------------------------------------------------------
    | 左列日付変更
    |--------------------------------------------------------------------------
    */

    const handleListDateChange = (e) => {
        const date = e.target.value;

        setListDate(date);

        fetchListRecordsByDate(date);
    };

    /*
    |--------------------------------------------------------------------------
    | 登録
    |--------------------------------------------------------------------------
    */

    const submit = (e) => {
        e.preventDefault();

        post("/store", {
            onSuccess: () => {
                reset();

                fetchListRecordsByDate(listDate);

                fetchDashboardData();

                fetchChartData();
            },
        });
    };

    /*
    |--------------------------------------------------------------------------
    | グラフラベル
    |--------------------------------------------------------------------------
    */

    const formatChartLabel = (value) => {
        if (chartPeriod === "daily") {
            const date = new Date(value);

            const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

            return `${date.getMonth() + 1}/${date.getDate()}(${
                weekDays[date.getDay()]
            })`;
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

    /*
    |--------------------------------------------------------------------------
    | Y軸
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | 円グラフ期間
    |--------------------------------------------------------------------------
    */

    const getPieChartRangeLabel = () => {
        const date = new Date(chartDate);

        if (chartPeriod === "daily") {
            return `${date.getMonth() + 1}/${date.getDate()} の割合`;
        }

        if (chartPeriod === "weekly") {
            return "週間カテゴリー割合";
        }

        if (chartPeriod === "monthly") {
            return `${date.getFullYear()}年${date.getMonth() + 1}月 の割合`;
        }

        return "カテゴリー別割合";
    };

    return (
        <>
            <div className="h-screen overflow-hidden bg-white p-3">
                {/* ヘッダー */}
                <div className="mb-3 flex h-10 items-center justify-between">
                    <h1 className="ml-4 text-2xl font-bold">
                        学習時間記録アプリ
                    </h1>

                    <div className="mr-4 flex items-center gap-4">
                        <label>{auth.user?.name}</label>

                        <form method="POST" action="/logout" className="inline">
                            <button className="rounded-xl border px-3 py-1 hover:bg-gray-100">
                                ログアウト
                            </button>
                        </form>
                    </div>
                </div>

                <div className="grid h-[calc(100vh-24px)] grid-cols-12 gap-3 overflow-hidden">
                    {/* ========================= */}
                    {/* 左列 */}
                    {/* ========================= */}

                    <section className="col-span-3 h-full overflow-hidden rounded-xl border p-4">
                        <div className="mb-3">
                            <h2 className="text-lg font-bold text-blue-600">
                                学習記録一覧
                            </h2>

                            <p className="text-sm text-gray-500">
                                選択した日の記録
                            </p>
                        </div>

                        <div className="mb-3">
                            <label className="mb-1 block text-sm font-bold">
                                日付を選択
                            </label>

                            <input
                                type="date"
                                value={listDate}
                                onChange={handleListDateChange}
                                className="w-full rounded border px-3 py-2"
                            />
                        </div>

                        <div className="mb-3 rounded-lg bg-blue-50 p-3">
                            <p className="text-sm text-gray-600">
                                {listDate} の合計時間
                            </p>

                            <p className="text-xl font-bold text-blue-600">
                                {formatMinutes(listStudyTime)}
                            </p>
                        </div>

                        <div className="h-[calc(100%-170px)] overflow-y-auto space-y-3">
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
                                        <div className="mb-2 flex items-center justify-between">
                                            <p className="font-bold text-blue-600">
                                                {record.category
                                                    ?.category_name ?? "未設定"}
                                            </p>

                                            <p className="text-lg font-bold">
                                                {formatMinutes(
                                                    record.study_time,
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex justify-end gap-2">
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
                                                                onSuccess:
                                                                    () => {
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
                                                className="rounded border px-3 py-1 text-sm hover:bg-red-500 hover:text-white"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* ========================= */}
                    {/* 中央列 */}
                    {/* ========================= */}

                    <section className="col-span-4 h-full overflow-y-auto rounded-xl border p-4">
                        <h2 className="mb-3 text-lg font-bold text-blue-600">
                            学習時間
                        </h2>

                        <div className="w-full flex flex-col gap-3">
                            <div className="grid w-full grid-cols-3 gap-3">
                                <div className="w-full rounded-lg border p-3">
                                    <p className="text-sm font-bold">日別</p>

                                    <p className="mt-2 text-2xl font-bold">
                                        {formatMinutes(dashboardTodayTime)}
                                    </p>
                                </div>

                                <div className="w-full rounded-lg border p-3">
                                    <p className="text-sm font-bold">週別</p>

                                    <p className="mt-2 text-2xl font-bold">
                                        {formatMinutes(dashboardWeeklyTime)}
                                    </p>
                                </div>

                                <div className="w-full rounded-lg border p-3">
                                    <p className="text-sm font-bold">月別</p>

                                    <p className="mt-2 text-2xl font-bold">
                                        {formatMinutes(dashboardMonthlyTime)}
                                    </p>
                                </div>
                            </div>

                            <div className="grid w-full grid-cols-2 gap-3">
                                <div className="w-full rounded-lg border p-3">
                                    <p className="text-sm font-bold">年別</p>

                                    <p className="mt-2 text-2xl font-bold">
                                        {formatMinutes(dashboardYearlyTime)}
                                    </p>
                                </div>

                                <div className="w-full rounded-lg border p-3">
                                    <p className="text-sm font-bold">総合計</p>

                                    <p className="mt-2 text-2xl font-bold">
                                        {formatMinutes(dashboardTotalTime)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 rounded-xl border p-3">
                            <h2 className="mb-2 text-base font-bold text-blue-600">
                                🖊 時間記録
                            </h2>

                            <form
                                onSubmit={submit}
                                noValidate
                                className="space-y-2"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <div className="mb-1 flex h-7 items-center">
                                            <label className="text-xs font-bold">
                                                日付
                                            </label>
                                        </div>

                                        <input
                                            type="date"
                                            value={data.study_date}
                                            onChange={(e) =>
                                                setData(
                                                    "study_date",
                                                    e.target.value,
                                                )
                                            }
                                            className="h-9 w-full rounded border px-2 py-1"
                                        />
                                    </div>

                                    <div>
                                        <div className="mb-1 flex h-7 items-center justify-between">
                                            <label className="text-xs font-bold">
                                                カテゴリー
                                            </label>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsCategoryModalOpen(true)
                                                }
                                                className="rounded border px-2 py-1 text-xs hover:bg-blue-500 hover:text-white"
                                            >
                                                編集
                                            </button>
                                        </div>

                                        <select
                                            value={data.category_id}
                                            onChange={(e) =>
                                                setData(
                                                    "category_id",
                                                    e.target.value,
                                                )
                                            }
                                            className="h-9 w-full rounded border px-2 py-1"
                                        >
                                            <option value="">
                                                選択してください
                                            </option>

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

                                <div>
                                    <TimeInput
                                        value={data.study_time}
                                        onChange={(value) =>
                                            setData("study_time", value)
                                        }
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
                        </div>
                    </section>

                    {/* ========================= */}
                    {/* 右列 */}
                    {/* ========================= */}

                    <section className="col-span-5 h-full min-h-0 overflow-hidden rounded-xl border p-2 flex flex-col">
                        <h2 className="mb-1 text-base font-bold text-blue-600 shrink-0">
                            学習時間のグラフ
                        </h2>

                        {/* 条件 */}
                        <div className="grid grid-cols-3 gap-2 mb-2 shrink-0">
                            <div>
                                <label className="mb-1 block text-xs">
                                    日付
                                </label>

                                <input
                                    type="date"
                                    value={chartDate}
                                    onChange={(e) =>
                                        setChartDate(e.target.value)
                                    }
                                    className="h-8 w-full rounded border px-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs">
                                    期間
                                </label>

                                <div className="flex h-8">
                                    <button
                                        type="button"
                                        onClick={() => setChartPeriod("daily")}
                                        className={`flex-1 text-sm ${
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
                                        className={`flex-1 text-sm ${
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
                                        className={`flex-1 text-sm ${
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
                                <label className="mb-1 block text-xs">
                                    カテゴリー
                                </label>

                                <select
                                    value={chartCategoryId}
                                    onChange={(e) =>
                                        setChartCategoryId(e.target.value)
                                    }
                                    className="h-8 w-full rounded border px-2 text-sm"
                                >
                                    <option value="">すべて</option>

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
                        <div className="rounded-xl border p-2 mb-2 flex-[0.9] min-h-0 flex flex-col">
                            <h3 className="mb-1 text-xs font-bold">
                                カテゴリー別割合（
                                {getPieChartRangeLabel()}）
                            </h3>

                            <div className="flex flex-1 min-h-0 items-center">
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
                                                innerRadius={32}
                                                outerRadius={55}
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

                                <div className="w-1/2 pl-2">
                                    <table className="w-full text-[10px]">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="py-1 text-left">
                                                    カテゴリ
                                                </th>

                                                <th className="py-1 text-right">
                                                    時間
                                                </th>

                                                <th className="py-1 text-right">
                                                    %
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
                                                            <div className="flex items-center gap-1">
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
                        <div className="rounded-xl border p-2 flex-1 min-h-0 flex flex-col">
                            <h3 className="mb-1 text-xs font-bold">
                                学習時間推移
                            </h3>

                            <div className="flex-1 min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={barChartData}
                                        margin={{
                                            top: 4,
                                            right: 8,
                                            left: 0,
                                            bottom: 20,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis
                                            dataKey="label"
                                            interval={0}
                                            height={32}
                                            fontSize={12}
                                            tickMargin={4}
                                            tickFormatter={formatChartLabel}
                                        />

                                        <YAxis
                                            domain={yAxisConfig.domain}
                                            ticks={yAxisConfig.ticks}
                                            width={45}
                                            fontSize={10}
                                            tickFormatter={(value) =>
                                                formatMinutes(value)
                                            }
                                        />

                                        <Tooltip
                                            formatter={(value) =>
                                                formatMinutes(value)
                                            }
                                            labelFormatter={formatChartLabel}
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
                                        editForm.setData(
                                            "study_date",
                                            e.target.value,
                                        )
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
                                        editForm.setData(
                                            "category_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border px-2 py-1"
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
            )}
            {/* カテゴリー管理モーダル */}
            {isCategoryModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setIsCategoryModalOpen(false)}
                >
                    <div
                        className="w-[500px] rounded-xl bg-white p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="mb-4 text-xl font-bold">
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
                            className="mb-4 flex gap-2"
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
                                className="flex-1 rounded border px-2 py-1"
                                placeholder="カテゴリー名"
                            />

                            <button
                                type="submit"
                                disabled={categoryForm.processing}
                                className="rounded bg-blue-500 px-4 py-1 text-white"
                            >
                                追加
                            </button>
                        </form>

                        {categoryForm.errors.category_name && (
                            <p className="mb-2 text-red-500">
                                {categoryForm.errors.category_name}
                            </p>
                        )}

                        <div className="max-h-64 overflow-y-auto">
                            <table className="w-full border-separate border-spacing-y-2 text-center">
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
                                                    className="rounded border px-3 py-1 text-sm hover:bg-red-500 hover:text-white"
                                                >
                                                    削除
                                                </button>
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingCategory(
                                                            category,
                                                        );
                                                        categoryForm.setData(
                                                            "category_name",
                                                            category.category_name,
                                                        );
                                                    }}
                                                    className="rounded border px-3 py-1 text-sm hover:bg-blue-500 hover:text-white"
                                                >
                                                    編集
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsCategoryModalOpen(false)}
                                className="rounded border px-4 py-2"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* カテゴリー編集モーダル */}
            {editingCategory && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
                    onClick={() => setEditingCategory(null)}
                >
                    <div
                        className="w-[400px] rounded-xl bg-white p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="mb-4 text-xl font-bold">
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
                                className="mb-4 w-full rounded border px-2 py-1"
                            />

                            {categoryForm.errors.category_name && (
                                <p className="mb-2 text-red-500">
                                    {categoryForm.errors.category_name}
                                </p>
                            )}

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingCategory(null)}
                                    className="rounded border px-4 py-2"
                                >
                                    キャンセル
                                </button>

                                <button
                                    type="submit"
                                    disabled={categoryForm.processing}
                                    className="rounded bg-blue-500 px-4 py-2 text-white"
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
