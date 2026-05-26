import { useForm, Link } from "@inertiajs/react";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <div className="flex items-center flex-col justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Login</h1>

            <form onSubmit={submit}>
                {errors.login && (
                    <p className="text-red-500">{errors.login}</p>
                )}

                <div className="mb-4">
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="w-full border px-2 py-1"
                    />
                    {errors.email && (
                        <div className="text-red-500">
                            {errors.email}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className="w-full border px-2 py-1"
                    />
                    {errors.password && (
                        <div className="text-red-500">
                            {errors.password}
                        </div>
                    )}
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition duration-200"
                    >
                        Login
                    </button>
                </div>

                {/* 新規登録リンク */}
                <div className="mt-4 text-center">
                    <Link
                        href="/register"
                        className="text-blue-500 underline hover:text-blue-700"
                    >
                        新規登録はこちら
                    </Link>
                </div>
            </form>
        </div>
    );
}
