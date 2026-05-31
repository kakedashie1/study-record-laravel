import { Icon } from "@iconify/react";

export default function BottomNavigation({
    activePanel,
    setActivePanel,
}) {
    return (
        <div className="fixed bottom-0 left-0 z-40 grid h-14 w-full grid-cols-3 border-t bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:hidden">
            {/* 一覧 */}
            <button
                type="button"
                onClick={() => setActivePanel("left")}
                className={`flex flex-col items-center justify-center gap-0.5 text-xs font-bold transition ${
                    activePanel === "left"
                        ? "border-t-4 border-green-600 bg-green-600 text-white shadow-md"
                        : "bg-green-50 text-green-700"
                }`}
            >
                <Icon
                    icon="twemoji:clipboard"
                    width="22"
                />

                一覧
            </button>

            {/* 記録 */}
            <button
                type="button"
                onClick={() => setActivePanel("center")}
                className={`flex flex-col items-center justify-center gap-0.5 text-xs font-bold transition ${
                    activePanel === "center"
                        ? "border-t-4 border-blue-600 bg-blue-600 text-white shadow-md"
                        : "bg-blue-50 text-blue-700"
                }`}
            >
                <Icon
                    icon="twemoji:pencil"
                    width="22"
                />

                記録
            </button>

            {/* グラフ */}
            <button
                type="button"
                onClick={() => setActivePanel("right")}
                className={`flex flex-col items-center justify-center gap-0.5 text-xs font-bold transition ${
                    activePanel === "right"
                        ? "border-t-4 border-purple-600 bg-purple-600 text-white shadow-md"
                        : "bg-purple-50 text-purple-700"
                }`}
            >
                <Icon
                    icon="twemoji:bar-chart"
                    width="22"
                />

                グラフ
            </button>
        </div>
    );
}
