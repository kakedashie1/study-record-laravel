import { formatMinutes } from "../../utils/format";
import { Icon } from "@iconify/react";

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
        <div className="relative mx-auto h-48 w-full max-w-sm sm:h-56">
            {/* 左上：週別 */}
            <div className="absolute left-0 top-0 w-[42%] rounded-xl border-2 border-green-300 bg-green-50 p-3 shadow-md ring-1 ring-white">
                <div className="flex items-center gap-1 text-xs font-bold text-gray-900">
                    <Icon icon="twemoji:chart-increasing" width="16" />

                    <span>週別</span>

                    <span className="text-[10px] font-normal text-gray-700">
                        {weeklyLabel}
                    </span>
                </div>

                <p className="mt-1 break-words text-sm font-bold text-gray-900 sm:text-base">
                    {formatMinutes(dashboardWeeklyTime)}
                </p>
            </div>

            {/* 右上：月別 */}
            <div className="absolute right-0 top-0 w-[42%] rounded-xl border-2 border-purple-300 bg-purple-50 p-3 shadow-md ring-1 ring-white">
                <div className="flex items-center gap-1 text-xs font-bold text-gray-900">
                    <Icon icon="twemoji:spiral-calendar" width="16" />

                    <span>月別</span>

                    <span className="text-[10px] font-normal text-gray-700">
                        {monthlyLabel}
                    </span>
                </div>

                <p className="mt-1 break-words text-sm font-bold text-gray-900 sm:text-base">
                    {formatMinutes(dashboardMonthlyTime)}
                </p>
            </div>

            {/* 左下：総合計 */}
            <div className="absolute bottom-0 left-0 w-[42%] rounded-xl border-2 border-gray-300 bg-gray-50 p-3 shadow-md ring-1 ring-white">
                <div className="flex items-center gap-1 text-xs font-bold text-gray-900">
                    <Icon icon="twemoji:trophy" width="16" />

                    <span>総合計</span>

                    <span className="text-[10px] font-normal text-gray-700">
                        {totalLabel}
                    </span>
                </div>

                <p className="mt-1 break-words text-sm font-bold text-gray-900 sm:text-base">
                    {formatMinutes(dashboardTotalTime)}
                </p>
            </div>

            {/* 右下：年別 */}
            <div className="absolute bottom-0 right-0 w-[42%] rounded-xl border-2 border-orange-300 bg-orange-50 p-3 shadow-md ring-1 ring-white">
                <div className="flex items-center gap-1 text-xs font-bold text-gray-900">
                    <Icon icon="twemoji:direct-hit" width="16" />

                    <span>年別</span>

                    <span className="text-[10px] font-normal text-gray-700">
                        {yearlyLabel}
                    </span>
                </div>

                <p className="mt-1 break-words text-sm font-bold text-gray-900 sm:text-base">
                    {formatMinutes(dashboardYearlyTime)}
                </p>
            </div>

            {/* 中央：日別 */}
           <div className="absolute left-1/2 top-1/2 z-10 w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-blue-500 bg-blue-50 p-2 text-center shadow-xl ring-2 ring-white sm:w-[52%] sm:p-4">
                <div className="flex items-center justify-center gap-1 text-sm font-bold text-gray-900">
                    <Icon icon="twemoji:calendar" width="18" />

                    <span>日別</span>

                    <span className="text-xs font-normal text-gray-700">
                        {dailyLabel}
                    </span>
                </div>

                <p className="mt-2 break-words text-xl font-bold text-gray-900 sm:text-2xl">
                    {formatMinutes(dashboardTodayTime)}
                </p>
            </div>
        </div>
    );
}
