import { useState, useEffect } from "react";
import { useForm, router, usePage } from "@inertiajs/react";

import RecordList from "../components/Records/RecordList";
import RecordCreateForm from "../components/Records/RecordCreateForm";
import RecordEditModal from "../components/Records/RecordEditModal";
import DashboardCards from "../components/Dashboard/DashboardCards";
import BottomNavigation from "../components/Navigation/BottomNavigation";
import ChartPanel from "../components/Charts/ChartPanel";
import CategoryManageModal from "../components/Categories/CategoryManageModal";
import XShareModal from "@/Components/Records/XShareModal";
import { formatMinutes } from "../utils/format";

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

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | その他
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(false);

    const [todayTimeText, setTodayTimeText] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const [activePanel, setActivePanel] = useState("center");

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        const root = document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    const [isPwa, setIsPwa] = useState(false);

    useEffect(() => {
        const standalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true;

        setIsPwa(standalone);
    }, []);

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

        const registeredStudyTime = data.study_time;

        post("/store", {
            onSuccess: () => {
                reset();

                fetchListRecordsByDate(listDate);

                fetchDashboardData();

                fetchChartData();

                setTodayTimeText(formatMinutes(registeredStudyTime));
                setIsShareModalOpen(true);
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
            const date = new Date(chartDate);

            const day = date.getDay();
            const diff = day === 0 ? -6 : 1 - day;

            const start = new Date(date);
            start.setDate(date.getDate() + diff);

            const end = new Date(start);
            end.setDate(start.getDate() + 6);

            return `${start.getMonth() + 1}/${start.getDate()} ～ ${
                end.getMonth() + 1
            }/${end.getDate()} の割合`;
        }

        if (chartPeriod === "monthly") {
            return `${date.getFullYear()}年${date.getMonth() + 1}月 の割合`;
        }

        return "カテゴリー別割合";
    };

    return (
        <>
            <div className="flex h-screen flex-col overflow-hidden bg-slate-100 p-3 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
                {/* ヘッダー */}
                <div
                    className={`mb-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900 lg:px-4 ${
                        isPwa ? "py-6" : "py-2"
                    }`}
                >
                    {/* 左：ロゴ */}
                    <div className="flex items-center">
                        {/* ライトモード */}
                        <img
                            src="/StudyRecord_logo_header.png"
                            alt="Study Record"
                            className={`w-auto dark:hidden lg:h-16 ${
                                isPwa ? "h-15" : "h-10"
                            } sm:h-12`}
                        />

                        {/* ダークモード */}
                        <img
                            src="/StudyRecord_logo_header_dark.png"
                            alt="Study Record"
                            className={`hidden w-auto dark:block lg:h-16 ${
                                isPwa ? "h-15" : "h-10"
                            } sm:h-12`}
                        />
                    </div>

                    {/* 右：ユーザー名 + ログアウト */}
                    <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-3">
                        <label className="hidden text-sm text-gray-600 dark:text-slate-300 sm:block">
                            {auth.user?.name}
                        </label>

                        <form method="POST" action="/logout" className="inline">
                            <button className="rounded-xl border border-slate-300 px-2 py-1 text-xs hover:bg-gray-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 sm:px-3 sm:text-sm">
                                ログアウト
                            </button>
                        </form>

                        <button
                            type="button"
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                            className="rounded-xl border border-slate-300 px-2 py-1 text-xs hover:bg-gray-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 sm:px-3 sm:text-sm"
                        >
                            {theme === "dark" ? "☀️" : "🌙"}
                        </button>
                    </div>
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-12">
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
                        } h-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900 sm:p-4 lg:col-span-4 lg:block lg:pb-4 ${
                            isPwa ? "pb-0" : "pb-28 sm:pb-32"
                        }`}
                    >
                        <h2
                            className={`text-base font-bold text-slate-700 dark:text-slate-100 ${
                                isPwa ? "mb-6" : "mb-3"
                            }`}
                        >
                            学習時間ダッシュボード
                        </h2>
                        <DashboardCards
                            dashboardTodayTime={dashboardTodayTime}
                            dashboardWeeklyTime={dashboardWeeklyTime}
                            dashboardMonthlyTime={dashboardMonthlyTime}
                            dashboardYearlyTime={dashboardYearlyTime}
                            dashboardTotalTime={dashboardTotalTime}
                        />

                        <div className="mt-2 rounded-2xl border border-slate-300 bg-white p-3 shadow-md transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800 sm:mt-4 sm:p-4">
                            <h2 className="mb-3 text-base font-bold text-slate-700 dark:text-slate-100">
                                学習時間記録
                            </h2>
                            <RecordCreateForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                submit={submit}
                                categories={categories}
                                setIsCategoryModalOpen={setIsCategoryModalOpen}
                                onCreated={(studyTimeText) => {
                                    setTodayTimeText(studyTimeText);
                                    setIsShareModalOpen(true);
                                }}
                            />
                        </div>
                    </section>

                    {/* ========================= */}
                    {/* 右列 */}
                    {/* ========================= */}
                    <ChartPanel
                        activePanel={activePanel}
                        categories={categories}
                        chartDate={chartDate}
                        setChartDate={setChartDate}
                        chartCategoryId={chartCategoryId}
                        setChartCategoryId={setChartCategoryId}
                        chartPeriod={chartPeriod}
                        setChartPeriod={setChartPeriod}
                        pieChartData={pieChartData}
                        barChartData={barChartData}
                        chartCategories={chartCategories}
                        getPieChartRangeLabel={getPieChartRangeLabel}
                        formatChartLabel={formatChartLabel}
                        yAxisConfig={yAxisConfig}
                    />
                </div>
            </div>
            {/* Navigation */}
            <BottomNavigation
                activePanel={activePanel}
                setActivePanel={setActivePanel}
            />

            {/* 学習記録編集モーダル */}
            <RecordEditModal
                editingRecord={editingRecord}
                setEditingRecord={setEditingRecord}
                editForm={editForm}
                categories={categories}
                listDate={listDate}
                fetchListRecordsByDate={fetchListRecordsByDate}
                fetchDashboardData={fetchDashboardData}
                fetchChartData={fetchChartData}
            />

            {/* カテゴリー管理モーダル */}
            <CategoryManageModal
                isCategoryModalOpen={isCategoryModalOpen}
                setIsCategoryModalOpen={setIsCategoryModalOpen}
                editingCategory={editingCategory}
                setEditingCategory={setEditingCategory}
                categoryForm={categoryForm}
                categories={categories}
            />

            {/* 共有モーダル */}
            <XShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                todayTimeText={todayTimeText}
            />
        </>
    );
}
