export default function BottomNavigation({ activePanel, setActivePanel }) {
    return (
        <div className="fixed bottom-0 left-0 z-40 grid h-14 w-full grid-cols-3 border-t bg-white lg:hidden">
            {[
                { key: "left", label: "一覧" },
                { key: "center", label: "記録" },
                { key: "right", label: "グラフ" },
            ].map((item) => (
                <button
                    key={item.key}
                    type="button"
                    onClick={() => setActivePanel(item.key)}
                    className={
                        activePanel === item.key
                            ? "font-bold text-blue-600"
                            : "text-gray-500"
                    }
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
