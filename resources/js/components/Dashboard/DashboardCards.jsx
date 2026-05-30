import { formatMinutes } from "../../utils/format";

export default function DashboardCards({
    dashboardTodayTime,
    dashboardWeeklyTime,
    dashboardMonthlyTime,
    dashboardYearlyTime,
    dashboardTotalTime,
}) {
    return (
        <div className="w-full flex flex-col gap-3">
            <div className="w-full grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
                <div className="w-full rounded-lg border p-2 sm:p-3">
                    <p className="text-xs font-bold sm:text-sm">日別</p>
                    <p className="mt-1 text-sm font-bold tracking-tight break-words sm:mt-2 sm:text-lg">
                        {formatMinutes(dashboardTodayTime)}
                    </p>
                </div>

                <div className="w-full rounded-lg border p-2 sm:p-3">
                    <p className="text-xs font-bold sm:text-sm">週別</p>
                    <p className="mt-1 text-sm font-bold tracking-tight break-words sm:mt-2 sm:text-lg">
                        {formatMinutes(dashboardWeeklyTime)}
                    </p>
                </div>

                <div className="w-full rounded-lg border p-2 sm:p-3">
                    <p className="text-xs font-bold sm:text-sm">月別</p>
                    <p className="mt-1 text-sm font-bold tracking-tight break-words sm:mt-2 sm:text-lg">
                        {formatMinutes(dashboardMonthlyTime)}
                    </p>
                </div>

                <div className="w-full rounded-lg border p-2 sm:p-3">
                    <p className="text-xs font-bold sm:text-sm">年別</p>
                    <p className="mt-1 text-sm font-bold tracking-tight break-words sm:mt-2 sm:text-lg">
                        {formatMinutes(dashboardYearlyTime)}
                    </p>
                </div>

                <div className="w-full rounded-lg border p-2 sm:p-3">
                    <p className="text-xs font-bold sm:text-sm">総合計</p>
                    <p className="mt-1 text-sm font-bold tracking-tight break-words sm:mt-2 sm:text-lg">
                        {formatMinutes(dashboardTotalTime)}
                    </p>
                </div>
            </div>
        </div>
    );
}
