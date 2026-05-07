---
title: サーバーについて - Nercone
title_prefix: About
title_suffix: "'s Web Server"
title_suffix_separator: ""
header_desc: このサーバーの詳細情報
description: nercone.devのサーバーの詳細情報
---

# nercone.dev ({{ server_version }}+{{ contents_version }})
nercone.devへのHTTP(S)リクエストは、Python+(Uvicorn+)FastAPIスタックで構築されたWebサーバーによって処理されています。

TLS対応などの理由で間に噛ませているNginxに関するものや、機密情報などを除いて、全ての箇所がGitHubで公開されています。

## TLS対応
前述した通り、Nginxをリバースプロキシとして使用し、TLSに対応しています。
証明書はCertbotを使用してLet's Encrypt様に発行してもらっています。証明書のプロファイルはclassicです。

### HTTPバージョン
HTTP/1.1/2/3(QUIC)に対応しています。

### SSLについて
SSLの全バージョンを含む、TLS 1.1以前のSSL/TLSは無効化しています。TLS 1.2/1.3でのみアクセス可能です。

## リポジトリ

### サーバーリポジトリ ([github.com:nercone-dev/website](https://github.com/nercone-dev/website/)@[{{ server_version }}]({{ "https://github.com/nercone-dev/website/commit/" + server_version }}))
途中でGiteaに移動したり戻したりなどしましたが、現時点でサーバーのソースコードはここで管理しています。
やっぱりGitHubが一番落ち着くんです。

### コンテンツリポジトリ ([github.com:nercone-dev/website-contents](https://github.com/nercone-dev/website-contents/)@[{{ contents_version }}]({{ "https://github.com/nercone-dev/website-contents/commit/" + contents_version }}))
`2026-05-07T11:20:07Z`に作成したコミット`5d34750f671af4a2e2682d20affa0e94af8b664e`から、このWebサイトのページやアセットなどのほとんどのコンテンツはこちらで管理しています。
以前はコンテンツをサーバーリポジトリの`/public`にそのまま配置していましたが、現在は`git submodule`を使用してリポジトリを分離しています。

## その他の情報

### レジストラ
以前までお名前.comを使用していましたが、Cloudflareに移管しました。

### DNSサーバー
ドメイン移管前から、ずっとCloudflareを使用しています。

### サーバー(物理)
GCPのCompute Engineを使用しています。マシンタイプはe2-mediumです。

リージョンはasia-northeast2 (大阪)です。
日本なのでレイテンシが低く、かつ東京より安いためです。

LinuxディストリビューションはAlmaLinux 10を使用しています。
AlmaLinux 9.7からELevateでアップグレードしました。

アップグレード後にいくつか問題は発生しましたが、いろいろ試していたら直りました。
とりあえず問題はなさそうですが、不安定になったらすぐ作り直そうと思います。
<s>本当は気持ち悪いのですぐにでも作り直したいけれどいろいろと面倒なので後回しにしているだけです</s>

### メールサーバー
GCPだと上りの25/tcpポートがスパム対策かなんかでブロックされるので、XServerのVPSを別で用意して、メールだけそちらで処理させています。

ソフトウェアはPostfix+Dovecotの設定が面倒なのでPoste.ioに任せています。いつか移行予定です。

### 今年
今年は西暦で{{ this_year() }}年、つまり平成{{ this_year_in_heisei() }}年です。時の流れは速いですねぇ。

えっ？何？令和？なんですかそれ。聞いたことありませんね。ネーミングセンスの良い和菓子でしょうか...？今度1つ買ってきてくださいよ。
