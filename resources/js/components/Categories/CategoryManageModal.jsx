import { router } from "@inertiajs/react";

export default function CategoryManageModal({
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    editingCategory,
    setEditingCategory,
    categoryForm,
    categories,
}) {
    return (
        <>
            {isCategoryModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setIsCategoryModalOpen(false)}
                >
                    <div
                        className="w-[92vw] max-w-[500px] rounded-xl bg-white p-4 text-gray-900 sm:p-6 dark:bg-gray-800 dark:text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="mb-4 text-xl font-bold">
                            カテゴリー管理
                        </h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                categoryForm.post("/categories/store", {
                                    onSuccess: () => {
                                        categoryForm.reset();
                                        categoryForm.setData(
                                            "color",
                                            "#2563eb",
                                        );
                                    },
                                });
                            }}
                            className="mb-4 flex gap-2"
                        >
                            <input
                                type="text"
                                value={categoryForm.data.category_name}
                                onChange={(e) =>
                                    categoryForm.setData(
                                        "category_name",
                                        e.target.value,
                                    )
                                }
                                className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="カテゴリー名"
                            />

                            <input
                                type="color"
                                value={categoryForm.data.color}
                                onChange={(e) =>
                                    categoryForm.setData(
                                        "color",
                                        e.target.value,
                                    )
                                }
                                className="h-9 w-12"
                            />

                            <button
                                type="submit"
                                disabled={categoryForm.processing}
                                className="whitespace-nowrap rounded bg-blue-500 px-2 py-1 text-xs text-white sm:px-4 sm:text-sm"
                            >
                                追加
                            </button>
                        </form>

                        {categoryForm.errors.category_name && (
                            <p className="mb-2 text-red-500">
                                {categoryForm.errors.category_name}
                            </p>
                        )}

                        <div className="max-h-64 overflow-y-auto">
                            <div className="space-y-3 md:hidden">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-700"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-4 w-4 rounded-full border"
                                                    style={{
                                                        backgroundColor:
                                                            category.color ??
                                                            "#2563eb",
                                                    }}
                                                />

                                                <span className="font-bold">
                                                    {category.category_name}
                                                </span>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingCategory(
                                                            category,
                                                        );

                                                        categoryForm.setData({
                                                            category_name:
                                                                category.category_name,
                                                            color:
                                                                category.color ??
                                                                "#2563eb",
                                                        });
                                                    }}
                                                    className="rounded border px-3 py-1 text-sm hover:bg-blue-500 hover:text-white"
                                                >
                                                    編集
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                "本当に削除しますか？",
                                                            )
                                                        ) {
                                                            router.delete(
                                                                `/categories/${category.id}`,
                                                            );
                                                        }
                                                    }}
                                                    className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <table className="hidden w-full table-fixed border-separate border-spacing-y-2 text-center md:table">
                                <thead>
                                    <tr>
                                        <th className="w-2/5 px-2 py-2">
                                            カテゴリー名
                                        </th>
                                        <th className="w-1/5 px-2 py-2">色</th>
                                        <th className="w-1/5 px-2 py-2">
                                            削除
                                        </th>
                                        <th className="w-1/5 px-2 py-2">
                                            編集
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {categories.map((category) => (
                                        <tr key={category.id}>
                                            <td className="px-2 py-2">
                                                {category.category_name}
                                            </td>

                                            <td className="px-2 py-2">
                                                <div
                                                    className="mx-auto h-5 w-5 rounded-full border"
                                                    style={{
                                                        backgroundColor:
                                                            category.color ??
                                                            "#2563eb",
                                                    }}
                                                />
                                            </td>

                                            {/* 編集 */}
                                            <td className="px-2 py-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingCategory(
                                                            category,
                                                        );

                                                        categoryForm.setData({
                                                            category_name:
                                                                category.category_name,
                                                            color:
                                                                category.color ??
                                                                "#2563eb",
                                                        });
                                                    }}
                                                    className="rounded border px-3 py-1 text-sm hover:bg-blue-500 hover:text-white"
                                                >
                                                    編集
                                                </button>
                                            </td>

                                            {/* 削除 */}
                                            <td className="px-2 py-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                "本当に削除しますか？",
                                                            )
                                                        ) {
                                                            router.delete(
                                                                `/categories/destroy/${category.id}`,
                                                            );
                                                        }
                                                    }}
                                                    className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                                                >
                                                    削除
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsCategoryModalOpen(false)}
                                className="rounded border px-4 py-2"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editingCategory && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
                    onClick={() => setEditingCategory(null)}
                >
                    <div
                        className="w-[400px] rounded-xl bg-white p-6 text-gray-900 dark:bg-gray-800 dark:text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="mb-4 text-xl font-bold">
                            カテゴリー編集
                        </h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                categoryForm.put(
                                    `/categories/update/${editingCategory.id}`,
                                    {
                                        onSuccess: () => {
                                            setEditingCategory(null);
                                            categoryForm.reset();
                                        },
                                    },
                                );
                            }}
                        >
                            <input
                                type="text"
                                value={categoryForm.data.category_name}
                                onChange={(e) =>
                                    categoryForm.setData(
                                        "category_name",
                                        e.target.value,
                                    )
                                }
                                className="mb-4 w-full rounded border border-gray-300 bg-white px-2 py-1 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />

                            {categoryForm.errors.category_name && (
                                <p className="mb-2 text-red-500">
                                    {categoryForm.errors.category_name}
                                </p>
                            )}

                            <input
                                type="color"
                                value={categoryForm.data.color}
                                onChange={(e) =>
                                    categoryForm.setData(
                                        "color",
                                        e.target.value,
                                    )
                                }
                                className="mb-4 h-10 w-full"
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingCategory(null)}
                                    className="rounded border px-4 py-2"
                                >
                                    キャンセル
                                </button>

                                <button
                                    type="submit"
                                    disabled={categoryForm.processing}
                                    className="rounded bg-blue-500 px-4 py-2 text-white"
                                >
                                    更新
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
