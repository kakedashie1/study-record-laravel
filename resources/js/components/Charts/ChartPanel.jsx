import { formatMinutes } from "../../utils/format";
import { Icon } from "@iconify/react";
import CategorySelect from "../Categories/CategorySelect";

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
    Label,
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
    const pieTotal = pieChartData.reduce(
        (sum, item) => sum + Number(item.total),
        0,
    );

    return (
        <section
            className={`${
                activePanel === "right" ? "flex" : "hidden"
            } h-full min-h-0 overflow-hidden rounded-xl border p-2 flex-col lg:col-span-5 lg:flex`}
        >
            <h2 className="mb-1 shrink-0 text-base font-bold text-blue-600">
                学習時間のグラフ
            </h2>

            <div className="mb-2 grid w-full shrink-0 grid-cols-[40%_1fr] gap-x-3 gap-y-2">
                <div className="min-w-0">
                    <label className="mb-1 block text-xs">日付</label>
                    <input
                        type="date"
                        value={chartDate}
                        onChange={(e) => setChartDate(e.target.value)}
                        className="h-8 w-full max-w-full min-w-0 rounded border px-1 text-[10px] sm:text-sm"
                    />
                </div>

                <div className="min-w-0">
                    <label className="mb-1 block text-xs">カテゴリー</label>
                    <CategorySelect
                        categories={categories}
                        value={chartCategoryId}
                        onChange={(value) => setChartCategoryId(value)}
                        allLabel="すべて"
                    />
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
                                    : "border-blue-200 bg-blue-50 text-gray-900"
                            }`}
                        >
                            <Icon icon="twemoji:calendar" width="16" />
                            <span>日別</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setChartPeriod("weekly")}
                            className={`flex h-8 flex-1 items-center justify-center gap-1 rounded border text-xs font-bold transition ${
                                chartPeriod === "weekly"
                                    ? "border-green-600 bg-green-600 text-white shadow-md"
                                    : "border-green-200 bg-green-50 text-gray-900"
                            }`}
                        >
                            <Icon icon="twemoji:chart-increasing" width="16" />
                            <span>週別</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setChartPeriod("monthly")}
                            className={`flex h-8 flex-1 items-center justify-center gap-1 rounded border text-xs font-bold transition ${
                                chartPeriod === "monthly"
                                    ? "border-purple-600 bg-purple-600 text-white shadow-md"
                                    : "border-purple-200 bg-purple-50 text-gray-900"
                            }`}
                        >
                            <Icon icon="twemoji:spiral-calendar" width="16" />
                            <span>月別</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-2 flex min-h-0 flex-[0.9] flex-col rounded-xl border p-2">
                <h3 className="mb-1 text-xs font-bold">
                    カテゴリー別割合（{getPieChartRangeLabel()}）
                </h3>

                <div className="flex min-h-0 flex-1 items-center">
                    <div className="h-full w-1/2">
                        {pieChartData.length === 0 ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="text-center">
                                    <Icon
                                        icon="twemoji:bar-chart"
                                        width="40"
                                        className="mx-auto mb-2 opacity-40"
                                    />
                                    <p className="text-xl font-bold text-gray-400">
                                        NO DATA
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        データがありません
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        dataKey="total"
                                        nameKey="category_name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={38}
                                        outerRadius={58}
                                        stroke="none"
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color ?? "#2563eb"}
                                            />
                                        ))}

                                        <Label
                                            position="center"
                                            content={() => (
                                                <text
                                                    x="50%"
                                                    y="50%"
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x="50%"
                                                        dy="-0.4em"
                                                        fontSize="10"
                                                        fill="#6b7280"
                                                    >
                                                        合計
                                                    </tspan>
                                                    <tspan
                                                        x="50%"
                                                        dy="1.4em"
                                                        fontSize="12"
                                                        fontWeight="bold"
                                                        fill="#111827"
                                                    >
                                                        {formatMinutes(
                                                            pieTotal,
                                                        )}
                                                    </tspan>
                                                </text>
                                            )}
                                        />
                                    </Pie>

                                    <Tooltip
                                        formatter={(value) =>
                                            formatMinutes(value)
                                        }
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
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
                                    const percent =
                                        pieTotal > 0
                                            ? (
                                                  (Number(item.total) /
                                                      pieTotal) *
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

            <div className="flex min-h-0 flex-1 flex-col rounded-xl border p-2">
                <h3 className="mb-1 text-xs font-bold">学習時間推移</h3>

                <div className="min-h-0 flex-1">
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
