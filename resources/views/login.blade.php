<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>ログインページ</h1>
    @error('login')
                <div>{{ $message }}</div>
    @enderror
    <form action="/login" method="POST">
        @csrf
        @error('email')
                <div>{{ $message }}</div>
        @enderror
        <div>
            <input type="email" name="email" id="email" placeholder="メールアドレスを入力">
        </div>
        @error('password')
                <div>{{ $message }}</div>
        @enderror
        <div>
            <input type="password" name="password" id="password" placeholder="パスワードを入力">
        </div>
        <button type="submit">ログイン</button>
    </form>
</body>
</html>
