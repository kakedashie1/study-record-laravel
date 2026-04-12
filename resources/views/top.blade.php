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
    <form action="/" method="POST">
        @csrf
        <div>
            <select name="category_id" id="category_id">
                <option value="1">プログラミング</option>
                <option value="2">英語</option>
                <option value="3">理科</option>
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
