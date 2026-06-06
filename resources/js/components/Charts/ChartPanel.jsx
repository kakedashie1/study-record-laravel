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

    const barChartDataWithTotal = barChartData.map((item) => {
        const total = chartCategories.reduce(
            (sum, category) => sum + Number(item[category.category_name] ?? 0),
            0,
        );

        return {
            ...item,
            total,
        };
    });

    const PeriodButtons = () => (
        <div className="grid grid-cols-3 gap-2">
            <button
                type="button"
                onClick={() => setChartPeriod("daily")}
                className={`rounded-xl border-2 p-2 text-center shadow-md ring-1 ring-white transition dark:ring-slate-800 ${
                    chartPeriod === "daily"
                        ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950"
                        : "border-slate-300 bg-white hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-blue-950"
                }`}
            >
                <div className="flex items-center justify-center gap-1 text-xs font-bold text-gray-900 dark:text-slate-100">
                    <Icon icon="twemoji:calendar" width="16" />
                    <span>日別</span>
                </div>
            </button>

            <button
                type="button"
                onClick={() => setChartPeriod("weekly")}
                className={`rounded-xl border-2 p-2 text-center shadow-md ring-1 ring-white transition dark:ring-slate-800 ${
                    chartPeriod === "weekly"
                        ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950"
                        : "border-slate-300 bg-white hover:bg-green-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-green-950"
                }`}
            >
                <div className="flex items-center justify-center gap-1 text-xs font-bold text-gray-900 dark:text-slate-100">
                    <Icon icon="twemoji:chart-increasing" width="16" />
                    <span>週別</span>
                </div>
            </button>

            <button
                type="button"
                onClick={() => setChartPeriod("monthly")}
                className={`rounded-xl border-2 p-2 text-center shadow-md ring-1 ring-white transition dark:ring-slate-800 ${
                    chartPeriod === "monthly"
                        ? "border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-950"
                        : "border-slate-300 bg-white hover:bg-purple-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-purple-950"
                }`}
            >
                <div className="flex items-center justify-center gap-1 text-xs font-bold text-gray-900 dark:text-slate-100">
                    <Icon icon="twemoji:spiral-calendar" width="16" />
                    <span>月別</span>
                </div>
            </button>
        </div>
    );

    return (
        <section
            className={`${
                activePanel === "right" ? "flex" : "hidden"
            } h-full min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm flex-col transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900 lg:col-span-5 lg:flex`}
        >
            <div className="flex h-[111%] w-[100%] origin-top-left scale-90 flex-col lg:h-full lg:w-full lg:scale-100">
                <h2 className="mb-3 shrink-0 text-base font-bold text-slate-700 dark:text-slate-100">
                    学習時間のグラフ
                </h2>

                <div className="mb-2 grid w-full shrink-0 grid-cols-[40%_1fr] gap-x-3 gap-y-2">
                    <div className="min-w-0">
                        <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">
                            日付
                        </label>
                        <input
                            type="date"
                            value={chartDate}
                            onChange={(e) => setChartDate(e.target.value)}
                            className="h-8 w-full max-w-full min-w-0 rounded border border-slate-300 bg-white px-1 text-[10px] text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 sm:text-sm"
                        />
                    </div>

                    <div className="min-w-0">
                        <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">
                            カテゴリー
                        </label>
                        <CategorySelect
                            categories={categories}
                            value={chartCategoryId}
                            onChange={(value) => setChartCategoryId(value)}
                            allLabel="すべて"
                        />
                    </div>

                    {/* PCだけ上部に表示 */}
                    <div className="col-span-2 hidden min-w-0 lg:block">
                        <label className="mb-1 block text-xs text-slate-700 dark:text-slate-300">
                            期間
                        </label>
                        <PeriodButtons />
                    </div>
                </div>

                <div className="mb-2 flex min-h-0 flex-[0.9] flex-col rounded-2xl border border-slate-300 bg-white p-3 shadow-md transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800">
                    <h3 className="mb-1 text-xs font-bold text-slate-800 dark:text-slate-100">
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
                                                            fill={
                                                                document.documentElement.classList.contains(
                                                                    "dark",
                                                                )
                                                                    ? "#cbd5e1"
                                                                    : "#6b7280"
                                                            }
                                                        >
                                                            合計
                                                        </tspan>
                                                        <tspan
                                                            x="50%"
                                                            dy="1.4em"
                                                            fontSize="12"
                                                            fontWeight="bold"
                                                            fill={
                                                                document.documentElement.classList.contains(
                                                                    "dark",
                                                                )
                                                                    ? "#f8fafc"
                                                                    : "#111827"
                                                            }
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
                                        <th className="py-1 text-left">
                                            カテゴリ
                                        </th>
                                        <th className="py-1 text-right">
                                            時間
                                        </th>
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

                {/* スマホだけ円グラフと棒グラフの間に表示 */}
                <div className="mb-2 shrink-0 lg:hidden">
                    <PeriodButtons />
                </div>

                <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-slate-300 bg-white p-3 shadow-md transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800">
                    <h3 className="mb-1 text-xs font-bold text-slate-800 dark:text-slate-100">
                        学習時間推移
                    </h3>

                    <div className="min-h-0 flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barChartDataWithTotal}
                                margin={{
                                    top: 28,
                                    right: 4,
                                    left: -10,
                                    bottom: 4,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={
                                        document.documentElement.classList.contains(
                                            "dark",
                                        )
                                            ? "#334155"
                                            : "#d1d5db"
                                    }
                                />

                                <XAxis
                                    dataKey="label"
                                    interval={0}
                                    height={40}
                                    tickMargin={2}
                                    tick={(props) => {
                                        const { x, y, payload } = props;

                                        const isMobile =
                                            window.innerWidth < 640;

                                        if (
                                            chartPeriod === "daily" &&
                                            isMobile
                                        ) {
                                            const date = new Date(
                                                payload.value,
                                            );

                                            const weekDays = [
                                                "日",
                                                "月",
                                                "火",
                                                "水",
                                                "木",
                                                "金",
                                                "土",
                                            ];

                                            return (
                                                <g
                                                    transform={`translate(${x},${y})`}
                                                >
                                                    <text
                                                        x={0}
                                                        y={0}
                                                        dy={10}
                                                        textAnchor="middle"
                                                        fontSize={10}
                                                        fill={
                                                            document.documentElement.classList.contains(
                                                                "dark",
                                                            )
                                                                ? "#cbd5e1"
                                                                : "#374151"
                                                        }
                                                    >
                                                        {date.getMonth() + 1}/
                                                        {date.getDate()}
                                                    </text>

                                                    <text
                                                        x={0}
                                                        y={0}
                                                        dy={22}
                                                        textAnchor="middle"
                                                        fontSize={9}
                                                        fill={
                                                            document.documentElement.classList.contains(
                                                                "dark",
                                                            )
                                                                ? "#94a3b8"
                                                                : "#6B7280"
                                                        }
                                                    >
                                                        (
                                                        {
                                                            weekDays[
                                                                date.getDay()
                                                            ]
                                                        }
                                                        )
                                                    </text>
                                                </g>
                                            );
                                        }

                                        return (
                                            <text
                                                x={x}
                                                y={y + 12}
                                                textAnchor="middle"
                                                fontSize={12}
                                                fill={
                                                    document.documentElement.classList.contains(
                                                        "dark",
                                                    )
                                                        ? "#cbd5e1"
                                                        : "#374151"
                                                }
                                            >
                                                {formatChartLabel(
                                                    payload.value,
                                                )}
                                            </text>
                                        );
                                    }}
                                />

                                <YAxis
                                    domain={yAxisConfig.domain}
                                    ticks={yAxisConfig.ticks}
                                    width={60}
                                    fontSize={10}
                                    tick={{
                                        fill: document.documentElement.classList.contains(
                                            "dark",
                                        )
                                            ? "#cbd5e1"
                                            : "#374151",
                                        textAnchor: "end",
                                    }}
                                    tickMargin={4}
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
                                            (sum, item) =>
                                                sum + Number(item.value),
                                            0,
                                        );

                                        return (
                                            <div className="max-h-[55vh] w-[260px] max-w-[92vw] overflow-y-auto rounded-xl border border-gray-200 bg-white/80 p-3 text-xs shadow-lg backdrop-blur-sm dark:border-slate-600 dark:bg-slate-900/90 dark:text-slate-100 sm:w-[320px] sm:text-sm">
                                                <p className="mb-2 font-bold text-gray-800 dark:text-slate-100">
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

                                                <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 font-bold dark:border-slate-700">
                                                    <span>合計</span>
                                                    <span>
                                                        {formatMinutes(total)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />

                                {chartCategories.map(
                                    (category, categoryIndex) => (
                                        <Bar
                                            key={category.id}
                                            dataKey={category.category_name}
                                            stackId="study"
                                            fill={category.color ?? "#2563eb"}
                                            shape={(props) => {
                                                const {
                                                    x,
                                                    y,
                                                    width,
                                                    height,
                                                    fill,
                                                    payload,
                                                } = props;

                                                if (!payload) {
                                                    return null;
                                                }

                                                const currentValue = Number(
                                                    payload[
                                                        category.category_name
                                                    ] ?? 0,
                                                );

                                                if (currentValue <= 0) {
                                                    return null;
                                                }

                                                const total = Number(
                                                    payload.total ?? 0,
                                                );

                                                const lastVisibleCategoryIndex =
                                                    chartCategories
                                                        .map((cat, index) =>
                                                            Number(
                                                                payload[
                                                                    cat
                                                                        .category_name
                                                                ] ?? 0,
                                                            ) > 0
                                                                ? index
                                                                : -1,
                                                        )
                                                        .filter(
                                                            (index) =>
                                                                index !== -1,
                                                        )
                                                        .at(-1);

                                                const isTopBar =
                                                    categoryIndex ===
                                                    lastVisibleCategoryIndex;

                                                const hours = Math.floor(
                                                    total / 60,
                                                );
                                                const minutes = total % 60;
                                                const centerX =
                                                    Number(x) +
                                                    Number(width) / 2;

                                                const isMobile =
                                                    window.innerWidth < 640;

                                                const shouldBreakLine =
                                                    isMobile ||
                                                    chartPeriod === "monthly";

                                                return (
                                                    <g>
                                                        <rect
                                                            x={x}
                                                            y={y}
                                                            width={width}
                                                            height={height}
                                                            fill={fill}
                                                        />

                                                        {isTopBar &&
                                                            total > 0 && (
                                                                <text
                                                                    x={centerX}
                                                                    y={
                                                                        shouldBreakLine
                                                                            ? Number(
                                                                                  y,
                                                                              ) -
                                                                              22
                                                                            : Number(
                                                                                  y,
                                                                              ) -
                                                                              6
                                                                    }
                                                                    textAnchor="middle"
                                                                    fontSize={
                                                                        isMobile &&
                                                                        chartPeriod ===
                                                                            "monthly"
                                                                            ? 7
                                                                            : 10
                                                                    }
                                                                    fontWeight="bold"
                                                                    fill={
                                                                        document.documentElement.classList.contains(
                                                                            "dark",
                                                                        )
                                                                            ? "#f8fafc"
                                                                            : "#111827"
                                                                    }
                                                                >
                                                                    {shouldBreakLine &&
                                                                    hours > 0 &&
                                                                    minutes >
                                                                        0 ? (
                                                                        <>
                                                                            <tspan
                                                                                x={
                                                                                    centerX
                                                                                }
                                                                                dy="0"
                                                                            >
                                                                                {
                                                                                    hours
                                                                                }
                                                                                時間
                                                                            </tspan>
                                                                            <tspan
                                                                                x={
                                                                                    centerX
                                                                                }
                                                                                dy="1.2em"
                                                                            >
                                                                                {
                                                                                    minutes
                                                                                }

                                                                                分
                                                                            </tspan>
                                                                        </>
                                                                    ) : (
                                                                        formatMinutes(
                                                                            total,
                                                                        )
                                                                    )}
                                                                </text>
                                                            )}
                                                    </g>
                                                );
                                            }}
                                        />
                                    ),
                                )}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
    );
}
