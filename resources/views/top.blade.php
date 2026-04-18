<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>トップページ</h1>
    <div>{{ Auth::user()->name }}さん、こんにちは！</div>
    <form action="/logout" method="POST">
        @csrf
        <button type="submit">ログアウト</button>
    </form>
    <label>今日の勉強時間:{{ $today_study_time_hour_min }}</label>
    <form action="/store" method="POST">
        <input type="hidden" name="user_id" value="{{ Auth::id() }}">
        @csrf
        <div>
            <select name="category_id">
            @foreach($categories as $category)
            <option value="{{ $category->id }}">{{ $category->name }}</option>
            @endforeach
            </select>
        </div>
        <div>
            @error('study_time')
                <div>{{ $message }}</div>
            @enderror
        <input type="text" name="study_time" id="study_time" placeholder="勉強時間を入力">
        </div>
        <button type="submit">送信</button>
    </form>
    <div>
        <table class="table table-striped">
        <thead>
            <tr>
            <th>カテゴリー</th>
            <th>勉強時間</th>
            <th>編集/削除</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($records as $record)
            <tr>
            <td>{{ $record->category->name }}</td>
            <td>{{ $record->study_time }}</td>
            <td>
                <a href="/records/{{ $record->id }}/edit">編集</a>
                <form action="/destroy/{{ $record->id }}" method="POST" style="display: inline;">
                    @csrf
                    @method('DELETE')
                    <button type="submit">削除</button>
                </form>
            </td>
            </tr>
            @endforeach
        </tbody>
        </table>
    </div>
</body>
</html>
