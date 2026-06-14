import { Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Login() {
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        setProcessing(true);
        setErrors({});

        router.post(
            "/login",
            {
                email: formData.get("email"),
                password: formData.get("password"),
            },
            {
                onError: (errors) => {
                    setErrors(errors);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
            <div className="mb-6">
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

            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
                    Login
                </h1>

                <form onSubmit={submit}>
                    {errors.login && (
                        <p className="mb-4 text-center text-red-500">
                            {errors.login}
                        </p>
                    )}

                    <div className="mb-4">
                        <input
                            name="email"
                            type="email"
                            placeholder="メールアドレス"
                            autoComplete="email"
                            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />

                        {errors.email && (
                            <div className="mt-1 text-red-500">
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <input
                            name="password"
                            type="password"
                            placeholder="パスワード"
                            autoComplete="current-password"
                            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />

                        {errors.password && (
                            <div className="mt-1 text-red-500">
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600 disabled:opacity-60"
                    >
                        {processing ? "ログイン中..." : "Login"}
                    </button>

                    <div className="mt-4 text-center">
                        <Link
                            href="/register"
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            新規登録はこちら
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
