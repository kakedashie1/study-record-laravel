import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function BottomNavigation({
    activePanel,
    setActivePanel,
    reminderNoticeCount = 0,
}) {
    const [isPwa, setIsPwa] = useState(false);

    useEffect(() => {
        const standalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true;

        setIsPwa(standalone);
    }, []);

    const itemClass = "min-w-0 flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition";

    return (
        <div
            className={`fixed bottom-0 left-0 z-50 w-full lg:hidden ${
                isPwa ? "pb-6" : "pb-[max(env(safe-area-inset-bottom),8px)]"
            }`}
        >
            <div
                className={`grid w-full grid-cols-4 overflow-hidden border-t bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)] dark:border-slate-700 dark:bg-slate-900 ${
                    isPwa ? "h-16" : "h-14"
                }`}
            >
                <button
                    type="button"
                    onClick={() => setActivePanel("left")}
                    className={`${itemClass} ${
                        activePanel === "left"
                            ? "border-t-4 border-green-600 bg-green-600 text-white"
                            : "bg-green-50 text-gray-900"
                    }`}
                >
                    <Icon icon="twemoji:clipboard" width={20} />
                    <span>一覧</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActivePanel("center")}
                    className={`${itemClass} ${
                        activePanel === "center"
                            ? "border-t-4 border-blue-600 bg-blue-600 text-white"
                            : "bg-blue-50 text-gray-900"
                    }`}
                >
                    <Icon icon="twemoji:pencil" width={20} />
                    <span>記録</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActivePanel("reminder")}
                    className={`${itemClass} relative ${
                        activePanel === "reminder"
                            ? "border-t-4 border-purple-600 bg-purple-600 text-white"
                            : "bg-purple-50 text-gray-900"
                    }`}
                >
                    <span className="text-base leading-none">🔔</span>
                    <span>リマインド</span>

                    {reminderNoticeCount > 0 && (
                        <span className="absolute right-2 top-1 rounded-full bg-red-600 px-1.5 text-[10px] text-white">
                            {reminderNoticeCount}
                        </span>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => setActivePanel("right")}
                    className={`${itemClass} ${
                        activePanel === "right"
                            ? "border-t-4 border-pink-600 bg-pink-600 text-white"
                            : "bg-pink-50 text-gray-900"
                    }`}
                >
                    <Icon icon="twemoji:bar-chart" width={20} />
                    <span>グラフ</span>
                </button>
            </div>
        </div>
    );
}
