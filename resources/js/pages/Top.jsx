import { useForm } from '@inertiajs/react';
import { formatMinutes } from '../utils/format';

export default function Top({ categories, records, todayStudyTime }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        study_time: '',
        category_id: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post('/store', {
            onSuccess: () => reset(),
        });
    };

    return (
        <div style={{ padding: '24px' }}>
            <h1>学習時間記録アプリ</h1>

            <section style={{ marginBottom: '24px' }}>
                <h2>今日の合計勉強時間</h2>
                <p>{formatMinutes(todayStudyTime)}</p>
            </section>

            <section style={{ marginBottom: '24px' }}>
                <h2>勉強記録登録</h2>

                <form onSubmit={submit}>
                     <input type="hidden" name="user_id" value="{{ Auth::id() }}"></input>
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

            <section>
                <h2>今日の勉強記録一覧</h2>

                {records.length === 0 ? (
                    <p>今日はまだ記録がありません。</p>
                ) : (
                    <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>日付</th>
                                <th>カテゴリー</th>
                                <th>勉強時間</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record) => (
                                <tr key={record.id}>
                                    <td>{record.id}</td>
                                    <td>{record.study_date}</td>
                                    <td>{record.category?.name ?? '未設定'}</td>
                                    <td>{formatMinutes(record.study_time)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}
