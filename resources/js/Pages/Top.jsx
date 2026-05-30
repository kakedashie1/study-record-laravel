import { useState, useEffect } from "react";
import { useForm, router, usePage } from "@inertiajs/react";

import { formatMinutes } from "../utils/format";
import TimeInput from "../components/Records/TimeInput";
import RecordList from "../components/Records/RecordList";
import RecordCreateForm from "../components/Records/RecordCreateForm";
import DashboardCards from "../components/Dashboard/DashboardCards";
import BottomNavigation from "../components/Navigation/BottomNavigation";

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

    const [chartCategories, setChartCategories] = useState([]);

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

    const [activePanel, setActivePanel] = useState("center");

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
        color: "#2563eb",
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

            setChartCategories(result.categories);
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
                <div className="mb-3 flex items-center justify-between rounded-xl border bg-white px-3 py-2 lg:ml-0 lg:mr-0 lg:border-0 lg:px-4">
                    {/* 左：タイトル */}
                    <h1 className="truncate text-base font-bold sm:text-lg md:text-xl lg:text-2xl">
                        学習時間記録アプリ
                    </h1>

                    {/* 右：ユーザー名 + ログアウト */}
                    <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-3">
                        <label className="hidden text-sm text-gray-600 sm:block">
                            {auth.user?.name}
                        </label>

                        <form method="POST" action="/logout" className="inline">
                            <button className="rounded-xl border px-2 py-1 text-xs hover:bg-gray-100 sm:px-3 sm:text-sm">
                                ログアウト
                            </button>
                        </form>
                    </div>
                </div>

                <div className="grid h-[calc(100vh-80px)] grid-cols-1 gap-3 overflow-hidden lg:h-[calc(100vh-24px)] lg:grid-cols-12">
                    {/* ========================= */}
                    {/* 左列 */}
                    {/* ========================= */}

                    <RecordList
                        activePanel={activePanel}
                        listDate={listDate}
                        listRecords={listRecords}
                        listStudyTime={listStudyTime}
                        loading={loading}
                        handleListDateChange={handleListDateChange}
                        setEditingRecord={setEditingRecord}
                        editForm={editForm}
                        fetchListRecordsByDate={fetchListRecordsByDate}
                        fetchDashboardData={fetchDashboardData}
                        fetchChartData={fetchChartData}
                    />
                    {/* ========================= */}
                    {/* 中央列 */}
                    {/* ========================= */}

                    <section
                        className={`${
                            activePanel === "center" ? "block" : "hidden"
                        } h-full overflow-y-auto rounded-xl border p-4 lg:col-span-4 lg:block`}
                    >
                        <h2 className="mb-3 text-lg font-bold text-blue-600">
                            学習時間
                        </h2>
                        <DashboardCards
                            dashboardTodayTime={dashboardTodayTime}
                            dashboardWeeklyTime={dashboardWeeklyTime}
                            dashboardMonthlyTime={dashboardMonthlyTime}
                            dashboardYearlyTime={dashboardYearlyTime}
                            dashboardTotalTime={dashboardTotalTime}
                        />

                        <div className="mt-4 rounded-xl border p-3">
                            <h2 className="mb-2 text-base font-bold text-blue-600">
                                🖊 学習時間記録
                            </h2>
                            <RecordCreateForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                submit={submit}
                                categories={categories}
                                setIsCategoryModalOpen={setIsCategoryModalOpen}
                            />
                        </div>
                    </section>

                    {/* ========================= */}
                    {/* 右列 */}
                    {/* ========================= */}

                    <section
                        className={`${
                            activePanel === "right" ? "flex" : "hidden"
                        } h-full min-h-0 overflow-hidden rounded-xl border p-2 flex-col lg:col-span-5 lg:flex`}
                    >
                        <h2 className="mb-1 text-base font-bold text-blue-600 shrink-0">
                            学習時間のグラフ
                        </h2>

                        {/* 条件 */}
                        <div className="mb-2 grid w-full grid-cols-[40%_1fr] gap-x-3 gap-y-2 shrink-0">
                            {/* 日付 */}
                            <div className="min-w-0">
                                <label className="mb-1 block text-xs">
                                    日付
                                </label>

                                <input
                                    type="date"
                                    value={chartDate}
                                    onChange={(e) =>
                                        setChartDate(e.target.value)
                                    }
                                    className="h-8 w-full max-w-full min-w-0 rounded border px-1 text-[10px] sm:text-sm"
                                />
                            </div>

                            {/* カテゴリー */}
                            <div className="min-w-0">
                                <label className="mb-1 block text-xs">
                                    カテゴリー
                                </label>

                                <select
                                    value={chartCategoryId}
                                    onChange={(e) =>
                                        setChartCategoryId(e.target.value)
                                    }
                                    className="h-8 w-full max-w-full min-w-0 rounded border px-1 text-xs sm:px-2 sm:text-sm"
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

                            {/* 期間 */}
                            <div className="col-span-2 min-w-0">
                                <label className="mb-1 block text-xs">
                                    期間
                                </label>

                                {/* スマホ */}
                                <div className="block md:hidden">
                                    <select
                                        value={chartPeriod}
                                        onChange={(e) =>
                                            setChartPeriod(e.target.value)
                                        }
                                        className="h-8 w-full max-w-full min-w-0 rounded border px-1 text-xs sm:px-2 sm:text-sm"
                                    >
                                        <option value="daily">日別</option>
                                        <option value="weekly">週別</option>
                                        <option value="monthly">月別</option>
                                    </select>
                                </div>

                                {/* PC */}
                                <div className="hidden md:flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setChartPeriod("daily")}
                                        className={`rounded border px-4 py-2 text-sm transition ${
                                            chartPeriod === "daily"
                                                ? "bg-blue-500 text-white"
                                                : "bg-white hover:bg-gray-100"
                                        }`}
                                    >
                                        日別
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setChartPeriod("weekly")}
                                        className={`rounded border px-4 py-2 text-sm transition ${
                                            chartPeriod === "weekly"
                                                ? "bg-blue-500 text-white"
                                                : "bg-white hover:bg-gray-100"
                                        }`}
                                    >
                                        週別
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setChartPeriod("monthly")
                                        }
                                        className={`rounded border px-4 py-2 text-sm transition ${
                                            chartPeriod === "monthly"
                                                ? "bg-blue-500 text-white"
                                                : "bg-white hover:bg-gray-100"
                                        }`}
                                    >
                                        月別
                                    </button>
                                </div>
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
                                                stroke="none"
                                            >
                                                {pieChartData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                entry.color ??
                                                                "#2563eb"
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
                                                                            item.color ??
                                                                            "#2563eb",
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
                                            tickFormatter={(value) => {
                                                const isMobile =
                                                    window.innerWidth < 640;

                                                if (
                                                    chartPeriod === "daily" &&
                                                    isMobile
                                                ) {
                                                    const date = new Date(
                                                        value,
                                                    );

                                                    return `${date.getMonth() + 1}/${date.getDate()}`;
                                                }

                                                return formatChartLabel(value);
                                            }}
                                        />

                                        <YAxis
                                            domain={yAxisConfig.domain}
                                            ticks={yAxisConfig.ticks}
                                            width={45}
                                            fontSize={10}
                                            tickFormatter={(value) =>
                                                Number(value) === 0
                                                    ? ""
                                                    : formatMinutes(value)
                                            }
                                        />

                                        <Tooltip
                                            content={({
                                                active,
                                                payload,
                                                label,
                                            }) => {
                                                if (
                                                    !active ||
                                                    !payload ||
                                                    payload.length === 0
                                                ) {
                                                    return null;
                                                }

                                                const filteredPayload =
                                                    payload.filter(
                                                        (item) =>
                                                            Number(item.value) >
                                                            0,
                                                    );

                                                const total =
                                                    filteredPayload.reduce(
                                                        (sum, item) =>
                                                            sum +
                                                            Number(item.value),
                                                        0,
                                                    );

                                                return (
                                                    <div className="rounded border bg-white p-3 shadow-md text-sm">
                                                        {/* 日付 */}
                                                        <p className="mb-2 font-bold">
                                                            {formatChartLabel(
                                                                label,
                                                            )}
                                                        </p>

                                                        {/* カテゴリー別 */}
                                                        {filteredPayload.map(
                                                            (entry, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center justify-between gap-4"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <div
                                                                            className="h-3 w-3 rounded-full"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    entry.color,
                                                                            }}
                                                                        />
                                                                        <span>
                                                                            {
                                                                                entry.name
                                                                            }
                                                                        </span>
                                                                    </div>

                                                                    <span>
                                                                        {formatMinutes(
                                                                            entry.value,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            ),
                                                        )}

                                                        {/* 合計 */}
                                                        <div className="mt-2 border-t pt-2 flex justify-between font-bold">
                                                            <span>合計</span>
                                                            <span>
                                                                {formatMinutes(
                                                                    total,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        />

                                        {chartCategories.map((category) => (
                                            <Bar
                                                key={category.id}
                                                dataKey={category.category_name}
                                                stackId="study"
                                                fill={
                                                    category.color ?? "#2563eb"
                                                }
                                            />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            {/* Navigation */}
            <BottomNavigation
                activePanel={activePanel}
                setActivePanel={setActivePanel}
            />

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
                        className="w-[92vw] max-w-[500px] rounded-xl bg-white p-4 sm:p-6"
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
                                        categoryForm.setData(
                                            "color",
                                            "#2563eb",
                                        );
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

                            <input
                                type="color"
                                value={categoryForm.data.color}
                                onChange={(e) =>
                                    categoryForm.setData(
                                        "color",
                                        e.target.value,
                                    )
                                }
                                className="h-9 w-12"
                            />

                            <button
                                type="submit"
                                disabled={categoryForm.processing}
                                className="whitespace-nowrap rounded bg-blue-500 px-2 py-1 text-xs text-white sm:px-4 sm:text-sm"
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
                            {/* スマホ用：カード表示 */}
                            <div className="space-y-3 md:hidden">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="rounded-xl border bg-white p-3 shadow-sm"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-4 w-4 rounded-full border"
                                                    style={{
                                                        backgroundColor:
                                                            category.color ??
                                                            "#2563eb",
                                                    }}
                                                />

                                                <span className="font-bold">
                                                    {category.category_name}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2">
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

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingCategory(
                                                        category,
                                                    );
                                                    categoryForm.setData({
                                                        category_name:
                                                            category.category_name,
                                                        color:
                                                            category.color ??
                                                            "#2563eb",
                                                    });
                                                }}
                                                className="rounded border px-3 py-1 text-sm hover:bg-blue-500 hover:text-white"
                                            >
                                                編集
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* PC・タブレット用：テーブル表示 */}
                            <table className="hidden w-full table-fixed border-separate border-spacing-y-2 text-center md:table">
                                <thead>
                                    <tr>
                                        <th className="w-2/5 px-2 py-2 text-center">
                                            カテゴリー名
                                        </th>
                                        <th className="w-1/5 px-2 py-2 text-center">
                                            色
                                        </th>
                                        <th className="w-1/5 px-2 py-2 text-center">
                                            削除
                                        </th>
                                        <th className="w-1/5 px-2 py-2 text-center">
                                            編集
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {categories.map((category) => (
                                        <tr key={category.id}>
                                            <td className="px-2 py-2 text-center align-middle">
                                                {category.category_name}
                                            </td>

                                            <td className="px-2 py-2 text-center align-middle">
                                                <div
                                                    className="mx-auto h-5 w-5 rounded-full border"
                                                    style={{
                                                        backgroundColor:
                                                            category.color ??
                                                            "#2563eb",
                                                    }}
                                                />
                                            </td>

                                            <td className="px-2 py-2 text-center align-middle">
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

                                            <td className="px-2 py-2 text-center align-middle">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingCategory(
                                                            category,
                                                        );
                                                        categoryForm.setData({
                                                            category_name:
                                                                category.category_name,
                                                            color:
                                                                category.color ??
                                                                "#2563eb",
                                                        });
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
                            <input
                                type="color"
                                value={categoryForm.data.color}
                                onChange={(e) =>
                                    categoryForm.setData(
                                        "color",
                                        e.target.value,
                                    )
                                }
                                className="mb-4 h-10 w-full"
                            />

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
