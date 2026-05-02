import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";

export default function Category({ categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        category_name: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(`/categories/store`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <div style={{ padding: "24px" }}>
            <h1>学習時間記録アプリ</h1>

            <section>
                <h2>カテゴリー一覧</h2>
                <form onSubmit={submit} style={{ marginBottom: "16px" }}>
                    <label>カテゴリー名</label>
                    <br />
                    <input
                        type="text"
                        value={data.category_name}
                        onChange={(e) =>
                            setData("category_name", e.target.value)
                        }
                    />
                    {errors.category_name && (
                        <div style={{ color: "red" }}>
                            {errors.category_name}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={processing}
                        style={{ marginLeft: "8px" }}
                    >
                        登録
                    </button>
                </form>

                <table
                    border="1"
                    cellPadding="8"
                    style={{ borderCollapse: "collapse" }}
                >
                    <thead>
                        <tr>
                            <th>カテゴリー</th>
                            <th>削除</th>
                            <th>編集</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.category_name}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            if (
                                                confirm("本当に削除しますか？")
                                            ) {
                                                router.delete(
                                                    "/categories/destroy/" +
                                                        category.id,
                                                    {
                                                        onSuccess: () => {},
                                                    },
                                                );
                                            }
                                        }}
                                    >
                                        削除
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => {
                                            router.get(
                                                "/categories/edit/" +
                                                    category.id,
                                            );
                                        }}
                                    >
                                        編集
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <button type="button" onClick={() => router.get("/categories")}>
                戻る
            </button>
        </div>
    );
}
