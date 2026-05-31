import { formatMinutes } from "../../utils/format";

export default function DashboardCards({
    dashboardTodayTime,
    dashboardWeeklyTime,
    dashboardMonthlyTime,
    dashboardYearlyTime,
    dashboardTotalTime,
}) {
    const today = new Date();

    const formatDate = (date) => {
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    const getWeekRange = () => {
        const date = new Date(today);

        const day = date.getDay();
        const diff = day === 0 ? -6 : 1 - day;

        const start = new Date(date);
        start.setDate(date.getDate() + diff);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        return `${formatDate(start)}〜${formatDate(end)}`;
    };

    const dailyLabel = formatDate(today);
    const weeklyLabel = getWeekRange();
    const monthlyLabel = `${today.getFullYear()}/${today.getMonth() + 1}`;
    const yearlyLabel = `${today.getFullYear()}年`;
    const totalLabel = "全期間";

    return (
        <div className="relative mx-auto h-56 w-full max-w-sm">
            {/* 左上：週別 */}
            <div className="absolute left-0 top-0 w-[42%] rounded-xl border-2 border-green-300 bg-green-50 p-3 shadow-sm">
                <p className="text-xs font-bold text-green-700">
                    📈 週別
                    <span className="ml-1 text-[10px] font-normal text-green-600">
                        {weeklyLabel}
                    </span>
                </p>

                <p className="mt-1 break-words text-sm font-bold text-green-800 sm:text-base">
                    {formatMinutes(dashboardWeeklyTime)}
                </p>
            </div>

            {/* 右上：月別 */}
            <div className="absolute right-0 top-0 w-[42%] rounded-xl border-2 border-purple-300 bg-purple-50 p-3 shadow-sm">
                <p className="text-xs font-bold text-purple-700">
                    🗓️ 月別
                    <span className="ml-1 text-[10px] font-normal text-purple-600">
                        {monthlyLabel}
                    </span>
                </p>

                <p className="mt-1 break-words text-sm font-bold text-purple-800 sm:text-base">
                    {formatMinutes(dashboardMonthlyTime)}
                </p>
            </div>

            {/* 左下：総合計 */}
            <div className="absolute bottom-0 left-0 w-[42%] rounded-xl border-2 border-gray-300 bg-gray-50 p-3 shadow-sm">
                <p className="text-xs font-bold text-gray-700">
                    🏆 総合計
                    <span className="ml-1 text-[10px] font-normal text-gray-600">
                        {totalLabel}
                    </span>
                </p>

                <p className="mt-1 break-words text-sm font-bold text-gray-800 sm:text-base">
                    {formatMinutes(dashboardTotalTime)}
                </p>
            </div>

            {/* 右下：年別 */}
            <div className="absolute bottom-0 right-0 w-[42%] rounded-xl border-2 border-orange-300 bg-orange-50 p-3 shadow-sm">
                <p className="text-xs font-bold text-orange-700">
                    🎯 年別
                    <span className="ml-1 text-[10px] font-normal text-orange-600">
                        {yearlyLabel}
                    </span>
                </p>

                <p className="mt-1 break-words text-sm font-bold text-orange-800 sm:text-base">
                    {formatMinutes(dashboardYearlyTime)}
                </p>
            </div>

            {/* 中央：日別 */}
            <div className="absolute left-1/2 top-1/2 z-10 w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-blue-500 bg-blue-50 p-4 text-center shadow-lg">
                <p className="text-sm font-bold text-blue-600">
                    📅 日別
                    <span className="ml-1 text-xs font-normal text-blue-500">
                        {dailyLabel}
                    </span>
                </p>

                <p className="mt-2 break-words text-xl font-bold text-blue-700 sm:text-2xl">
                    {formatMinutes(dashboardTodayTime)}
                </p>
            </div>
        </div>
    );
}
