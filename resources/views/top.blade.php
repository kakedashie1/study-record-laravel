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
    <label>今日の勉強時間:{{ $today_study_time_hour_min }}</label>
    <form action="/" method="POST">
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
</body>
</html>
