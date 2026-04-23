import { useForm } from '@inertiajs/react';
import { formatMinutes } from '../utils/format';
import { router } from '@inertiajs/react';

export default function CategoryEdit({ categories, record }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        study_time: record.study_time,
        category_id: record.category_id || '',
    });

    const submit = (e) => {
        e.preventDefault();

        put(`/update/${record.id}`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <div style={{ padding: '24px' }}>
            <h1>学習時間記録アプリ</h1>
            <section style={{ marginBottom: '24px' }}>
                <h2>勉強記録登録</h2>
                <form onSubmit={submit}>
                    <div style={{ marginBottom: '12px' }}>
                        <label>カテゴリー</label>
                        <br />
                        <select
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                        >
                            <option value="">選択してください</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <div style={{ color: 'red' }}>{errors.category_id}</div>
                        )}
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label>勉強時間（分）</label>
                        <br />
                        <input
                            type="number"
                            value={data.study_time}
                            step="30"
                            onChange={(e) => setData('study_time', e.target.value)}
                        />
                        {errors.study_time && (
                            <div style={{ color: 'red' }}>{errors.study_time}</div>
                        )}
                    </div>

                    <button type="submit" disabled={processing}>
                        登録
                    </button>
                </form>
            </section>
        </div>
    );
}
