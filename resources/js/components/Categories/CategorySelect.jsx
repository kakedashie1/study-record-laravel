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

    return (
        <div ref={selectRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-full items-center justify-between rounded border bg-white px-2 text-left text-xs sm:text-sm"
            >
                <span className="flex min-w-0 items-center gap-2">
                    <span
                        className="h-3 w-3 shrink-0 rounded-full border"
                        style={{
                            backgroundColor: selectedCategory
                                ? selectedCategory.color ?? "#9ca3af"
                                : "#d1d5db",
                        }}
                    />

                    <span className="truncate">
                        {selectedCategory
                            ? selectedCategory.category_name
                            : allLabel ?? placeholder}
                    </span>
                </span>

                <span className="ml-2 text-gray-400">▼</span>
            </button>

            {isOpen && (
                <div className="absolute left-0 top-11 z-50 max-h-56 w-full overflow-y-auto rounded-xl border bg-white p-1 shadow-lg">
                    {allLabel !== null && (
                        <button
                            type="button"
                            onClick={() => handleSelect("")}
                            className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs hover:bg-gray-100 sm:text-sm ${
                                value === "" ? "bg-gray-100 font-bold" : ""
                            }`}
                        >
                            <span className="h-3 w-3 rounded-full border bg-gray-300" />
                            <span>{allLabel}</span>
                        </button>
                    )}

                    {allLabel === null && (
                        <button
                            type="button"
                            onClick={() => handleSelect("")}
                            className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs hover:bg-gray-100 sm:text-sm ${
                                value === "" ? "bg-gray-100 font-bold" : ""
                            }`}
                        >
                            <span className="h-3 w-3 rounded-full border bg-gray-300" />
                            <span>{placeholder}</span>
                        </button>
                    )}

                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => handleSelect(category.id)}
                            className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs hover:bg-gray-100 sm:text-sm ${
                                String(value) === String(category.id)
                                    ? "bg-blue-50 font-bold text-blue-700"
                                    : ""
                            }`}
                        >
                            <span
                                className="h-3 w-3 shrink-0 rounded-full border"
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
