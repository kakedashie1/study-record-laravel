import { useForm } from "@inertiajs/react";
import { formatMinutes } from "../utils/format";
import { router } from "@inertiajs/react";

export default function CategoryEdit({ category }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        category_name: category.category_name,
    });

    const submit = (e) => {
        e.preventDefault();

        put(`/categories/update/${category.id}`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <div style={{ padding: "24px" }}>
            <h1>学習時間記録アプリ</h1>
            <section style={{ marginBottom: "24px" }}>
                <h2>カテゴリー編集</h2>
                <form onSubmit={submit}>
                    <div style={{ marginBottom: "12px" }}>
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
                    </div>

                    <button type="submit" disabled={processing}>
                        登録
                    </button>
                </form>
            </section>
            <button type="button" onClick={() => router.get("/categories")}>
                戻る
            </button>
        </div>
    );
}
