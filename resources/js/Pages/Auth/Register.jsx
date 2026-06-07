// resources/js/Pages/Auth/Register.jsx

import { useForm, Link } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/register");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
            <div className="w-full max-w-md">
                {/* ロゴ */}
                <div className="mb-6 flex justify-center">
                    <img
                        src="/StudyRecord_logo_header.png"
                        alt="Study Record"
                        className="block h-20 w-auto dark:hidden"
                    />

                    <img
                        src="/StudyRecord_logo_header_dark.png"
                        alt="Study Record"
                        className="hidden h-20 w-auto dark:block"
                    />
                </div>

                <form
                    onSubmit={submit}
                    className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800"
                >
                    <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
                        ユーザー登録
                    </h1>

                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-bold text-gray-700 dark:text-gray-300">
                            名前
                        </label>

                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) =>
                                setData("name", e.target.value)
                            }
                            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-bold text-gray-700 dark:text-gray-300">
                            メールアドレス
                        </label>

                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) =>
                                setData("email", e.target.value)
                            }
                            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-bold text-gray-700 dark:text-gray-300">
                            パスワード
                        </label>

                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="mb-1 block text-sm font-bold text-gray-700 dark:text-gray-300">
                            パスワード確認
                        </label>

                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData(
                                    "password_confirmation",
                                    e.target.value
                                )
                            }
                            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded bg-blue-600 py-2 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        登録する
                    </button>

                    <div className="mt-4 text-center text-sm">
                        <Link
                            href="/login"
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            ログイン画面に戻る
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
