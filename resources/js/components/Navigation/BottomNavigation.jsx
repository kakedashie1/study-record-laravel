import { Icon } from "@iconify/react";

export default function BottomNavigation({ activePanel, setActivePanel }) {
    return (
        <div className="fixed bottom-0 left-0 z-40 grid h-14 w-full grid-cols-3 border-t bg-white lg:hidden">
            <button
                type="button"
                onClick={() => setActivePanel("left")}
                className={`flex flex-col items-center justify-center gap-0.5 text-xs font-bold transition ${
                    activePanel === "left"
                        ? "bg-green-50 text-green-600"
                        : "text-gray-400"
                }`}
            >
                <Icon icon="twemoji:clipboard" width="22" />
                一覧
            </button>

            <button
                type="button"
                onClick={() => setActivePanel("center")}
                className={`flex flex-col items-center justify-center gap-0.5 text-xs font-bold transition ${
                    activePanel === "center"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-400"
                }`}
            >
                <Icon icon="twemoji:pencil" width="22" />
                記録
            </button>

            <button
                type="button"
                onClick={() => setActivePanel("right")}
                className={`flex flex-col items-center justify-center gap-0.5 text-xs font-bold transition ${
                    activePanel === "right"
                        ? "bg-purple-50 text-purple-600"
                        : "text-gray-400"
                }`}
            >
                <Icon icon="twemoji:bar-chart" width="22" />
                グラフ
            </button>
        </div>
    );
}
