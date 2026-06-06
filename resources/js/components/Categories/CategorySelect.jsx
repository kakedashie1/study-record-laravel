import { useEffect, useRef, useState } from "react";

export default function CategorySelect({
    categories,
    value,
    onChange,
    placeholder = "選択してください",
    allLabel = null,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const selectedCategory = categories.find(
        (category) => String(category.id) === String(value),
    );

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (selectRef.current && !selectRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (selectedValue) => {
        onChange(selectedValue);
        setIsOpen(false);
    };

    const getSoftColor = (color) => {
        if (!color) {
            return "#f3f4f6";
        }

        return `${color}22`;
    };

    return (
        <div ref={selectRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-full items-center justify-between rounded border border-slate-300 bg-white px-2 text-left text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 sm:text-sm"
            >
                <span className="flex min-w-0 items-center gap-2">
                    <span
                        className="h-3 w-3 shrink-0 rounded-full border border-slate-300 dark:border-slate-500"
                        style={{
                            backgroundColor: selectedCategory
                                ? selectedCategory.color ?? "#9ca3af"
                                : "#d1d5db",
                        }}
                    />

                    <span
                        className={`truncate ${
                            selectedCategory
                                ? "text-slate-900 dark:text-slate-100"
                                : "text-slate-400 dark:text-slate-500"
                        }`}
                    >
                        {selectedCategory
                            ? selectedCategory.category_name
                            : allLabel ?? placeholder}
                    </span>
                </span>

                <span className="ml-2 text-slate-400 dark:text-slate-300">
                    ▼
                </span>
            </button>

            {isOpen && (
                <div className="absolute left-0 top-11 z-50 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-300 bg-white p-1 pb-2 shadow-lg dark:border-slate-600 dark:bg-slate-900">
                    {allLabel !== null && (
                        <button
                            type="button"
                            onClick={() => handleSelect("")}
                            className={`mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-slate-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800 sm:text-sm ${
                                value === ""
                                    ? "bg-slate-100 font-bold dark:bg-slate-800"
                                    : ""
                            }`}
                        >
                            <span className="h-3 w-3 rounded-full border border-slate-300 bg-slate-300 dark:border-slate-500 dark:bg-slate-500" />
                            <span>{allLabel}</span>
                        </button>
                    )}

                    {allLabel === null && (
                        <button
                            type="button"
                            onClick={() => handleSelect("")}
                            className={`mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-slate-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800 sm:text-sm ${
                                value === ""
                                    ? "bg-slate-100 font-bold dark:bg-slate-800"
                                    : ""
                            }`}
                        >
                            <span className="h-3 w-3 rounded-full border border-slate-300 bg-slate-300 dark:border-slate-500 dark:bg-slate-500" />
                            <span>{placeholder}</span>
                        </button>
                    )}

                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => handleSelect(category.id)}
                            className={`mb-1 flex w-full items-center gap-2 rounded-lg border px-2 py-2 text-left text-xs text-slate-900 hover:brightness-95 dark:text-slate-100 sm:text-sm ${
                                String(value) === String(category.id)
                                    ? "font-bold ring-2 ring-blue-300 dark:ring-blue-500"
                                    : ""
                            }`}
                            style={{
                                backgroundColor: getSoftColor(category.color),
                                borderColor: category.color ?? "#e5e7eb",
                            }}
                        >
                            <span
                                className="h-3 w-3 shrink-0 rounded-full border border-slate-300 dark:border-slate-500"
                                style={{
                                    backgroundColor:
                                        category.color ?? "#9ca3af",
                                }}
                            />

                            <span className="truncate">
                                {category.category_name}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
