import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function BottomNavigation({ activePanel, setActivePanel }) {
    const [isPwa, setIsPwa] = useState(false);

    useEffect(() => {
        const standalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true;

        setIsPwa(standalone);
    }, []);

    return (
        <div
            className={`fixed bottom-0 left-0 z-40 w-full lg:hidden ${
                isPwa ? "pb-6" : "pb-[max(env(safe-area-inset-bottom),8px)]"
            }`}
        >
            <div
                className={`grid w-full grid-cols-3 border-t bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)] ${
                    isPwa ? "h-16" : "h-14"
                }`}
            >
                {/* 一覧 */}
                <button
                    type="button"
                    onClick={() => setActivePanel("left")}
                    className={`flex flex-col items-center justify-center gap-0.5 text-xs font-bold transition ${
                        activePanel === "left"
                            ? "border-t-4 border-green-600 bg-green-600 text-white shadow-md"
                            : "bg-green-50 text-gray-900"
                    }`}
                >
                    <Icon icon="twemoji:clipboard" width={isPwa ? 26 : 22} />

                    <span
                        className={
                            activePanel === "left"
                                ? "text-white"
                                : "text-gray-900"
                        }
                    >
                        一覧
                    </span>
                </button>

                {/* 記録 */}
                <button
                    type="button"
                    onClick={() => setActivePanel("center")}
                    className={`flex flex-col items-center justify-center gap-0.5 text-xs font-bold transition ${
                        activePanel === "center"
                            ? "border-t-4 border-blue-600 bg-blue-600 text-white shadow-md"
                            : "bg-blue-50 text-gray-900"
                    }`}
                >
                    <Icon icon="twemoji:pencil" width={isPwa ? 26 : 22} />

                    <span
                        className={
                            activePanel === "center"
                                ? "text-white"
                                : "text-gray-900"
                        }
                    >
                        記録
                    </span>
                </button>

                {/* グラフ */}
                <button
                    type="button"
                    onClick={() => setActivePanel("right")}
                    className={`flex flex-col items-center justify-center gap-0.5 text-xs font-bold transition ${
                        activePanel === "right"
                            ? "border-t-4 border-purple-600 bg-purple-600 text-white shadow-md"
                            : "bg-purple-50 text-gray-900"
                    }`}
                >
                    <Icon icon="twemoji:bar-chart" width={isPwa ? 26 : 22} />

                    <span
                        className={
                            activePanel === "right"
                                ? "text-white"
                                : "text-gray-900"
                        }
                    >
                        グラフ
                    </span>
                </button>
            </div>
        </div>
    );
}
