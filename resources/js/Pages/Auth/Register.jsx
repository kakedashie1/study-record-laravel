// resources/js/Pages/Auth/Register.jsx

import { useForm, Link } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form onSubmit={submit} className="w-full max-w-md rounded-lg bg-white p-6 shadow">
                <h1 className="mb-6 text-2xl font-bold">ユーザー登録</h1>

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-bold">名前</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full rounded border px-3 py-2"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-bold">メールアドレス</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded border px-3 py-2"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-bold">パスワード</label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full rounded border px-3 py-2"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="mb-6">
                    <label className="mb-1 block text-sm font-bold">パスワード確認</label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded bg-blue-600 py-2 font-bold text-white disabled:opacity-50"
                >
                    登録する
                </button>

                <div className="mt-4 text-center text-sm">
                    <Link href="/login" className="text-blue-600 underline">
                        ログイン画面に戻る
                    </Link>
                </div>
            </form>
        </div>
    );
}
