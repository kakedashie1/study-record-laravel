import { formatMinutes } from "../../utils/format";
import { CalendarDays, CalendarRange, Calendar } from "lucide-react";

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

export default function ChartPanel({
    activePanel,
    categories,
    chartDate,
    setChartDate,
    chartCategoryId,
    setChartCategoryId,
    chartPeriod,
    setChartPeriod,
    pieChartData,
    barChartData,
    chartCategories,
    getPieChartRangeLabel,
    formatChartLabel,
    yAxisConfig,
}) {
    return (
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
                    <label className="mb-1 block text-xs">日付</label>

                    <input
                        type="date"
                        value={chartDate}
                        onChange={(e) => setChartDate(e.target.value)}
                        className="h-8 w-full max-w-full min-w-0 rounded border px-1 text-[10px] sm:text-sm"
                    />
                </div>

                {/* カテゴリー */}
                <div className="min-w-0">
                    <label className="mb-1 block text-xs">カテゴリー</label>

                    <select
                        value={chartCategoryId}
                        onChange={(e) => setChartCategoryId(e.target.value)}
                        className="h-8 w-full max-w-full min-w-0 rounded border px-1 text-xs sm:px-2 sm:text-sm"
                    >
                        <option value="">すべて</option>

                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-span-2 min-w-0">
                    <label className="mb-1 block text-xs">期間</label>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setChartPeriod("daily")}
                            className={`flex h-8 flex-1 items-center justify-center gap-1 rounded border text-xs font-bold transition ${
                                chartPeriod === "daily"
                                    ? "border-blue-600 bg-blue-600 text-white shadow-md"
                                    : "border-blue-200 bg-blue-50 text-blue-700"
                            }`}
                        >
                            <CalendarDays size={14} />
                            日別
                        </button>

                        <button
                            type="button"
                            onClick={() => setChartPeriod("weekly")}
                            className={`flex h-8 flex-1 items-center justify-center gap-1 rounded border text-xs font-bold transition ${
                                chartPeriod === "weekly"
                                    ? "border-green-600 bg-green-600 text-white shadow-md"
                                    : "border-green-200 bg-green-50 text-green-700"
                            }`}
                        >
                            <CalendarRange size={14} />
                            週別
                        </button>

                        <button
                            type="button"
                            onClick={() => setChartPeriod("monthly")}
                            className={`flex h-8 flex-1 items-center justify-center gap-1 rounded border text-xs font-bold transition ${
                                chartPeriod === "monthly"
                                    ? "border-purple-600 bg-purple-600 text-white shadow-md"
                                    : "border-purple-200 bg-purple-50 text-purple-700"
                            }`}
                        >
                            <Calendar size={14} />
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
                        <ResponsiveContainer width="100%" height="100%">
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
                                    {pieChartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color ?? "#2563eb"}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    formatter={(value) => formatMinutes(value)}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-1/2 pl-2">
                        <table className="w-full text-[10px]">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-1 text-left">カテゴリ</th>

                                    <th className="py-1 text-right">時間</th>

                                    <th className="py-1 text-right">%</th>
                                </tr>
                            </thead>

                            <tbody>
                                {pieChartData.map((item, index) => {
                                    const total = pieChartData.reduce(
                                        (sum, data) => sum + Number(data.total),
                                        0,
                                    );

                                    const percent =
                                        total > 0
                                            ? (
                                                  (Number(item.total) / total) *
                                                  100
                                              ).toFixed(1)
                                            : 0;

                                    return (
                                        <tr key={index} className="border-b">
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

                                                    {item.category_name}
                                                </div>
                                            </td>

                                            <td className="py-1 text-right">
                                                {formatMinutes(item.total)}
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
                <h3 className="mb-1 text-xs font-bold">学習時間推移</h3>

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
                                    const isMobile = window.innerWidth < 640;

                                    if (chartPeriod === "daily" && isMobile) {
                                        const date = new Date(value);

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
                                allowEscapeViewBox={{ x: false, y: false }}
                                wrapperStyle={{
                                    zIndex: 50,
                                    maxWidth: "92vw",
                                    maxHeight: "55vh",
                                    overflow: "hidden",
                                    pointerEvents: "none",
                                }}
                                content={({ active, payload, label }) => {
                                    if (
                                        !active ||
                                        !payload ||
                                        payload.length === 0
                                    ) {
                                        return null;
                                    }

                                    const filteredPayload = payload.filter(
                                        (item) => Number(item.value) > 0,
                                    );

                                    const total = filteredPayload.reduce(
                                        (sum, item) => sum + Number(item.value),
                                        0,
                                    );

                                    return (
                                        <div className="max-h-[55vh] w-[260px] max-w-[92vw] overflow-y-auto rounded-xl border border-gray-200 bg-white/80 p-3 text-xs shadow-lg backdrop-blur-sm sm:w-[320px] sm:text-sm">
                                            <p className="mb-2 font-bold text-gray-800">
                                                {formatChartLabel(label)}
                                            </p>

                                            {filteredPayload.map(
                                                (entry, index) => (
                                                    <div
                                                        key={index}
                                                        className="mb-1 flex items-center justify-between gap-3"
                                                    >
                                                        <div className="flex min-w-0 items-center gap-2">
                                                            <div
                                                                className="h-3 w-3 shrink-0 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        entry.color,
                                                                }}
                                                            />

                                                            <span className="truncate">
                                                                {entry.name}
                                                            </span>
                                                        </div>

                                                        <span className="shrink-0 font-bold">
                                                            {formatMinutes(
                                                                entry.value,
                                                            )}
                                                        </span>
                                                    </div>
                                                ),
                                            )}

                                            <div className="mt-2 flex justify-between border-t pt-2 font-bold">
                                                <span>合計</span>
                                                <span>
                                                    {formatMinutes(total)}
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
                                    fill={category.color ?? "#2563eb"}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}
