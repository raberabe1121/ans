# ANS — Agent Name Server

> The DNS of the agent era.  
> バイブコーディング産プロダクトとAIエージェントのための発見インフラ。

---

## What is ANS?

AIアプリが乱立する時代、プロダクトを「作る」ことより「見つけてもらう」ことが難しくなっています。

ANSは、バイブコーダーが **`#ANS` をつけてXにポストするだけで** プロダクトが自動登録される発見プラットフォームです。

フォームの入力も、アカウント登録も、追加作業も不要。  
あなたがBuild in Publicしている間に、ANSがあなたのプロダクトを世界に紹介します。

---

## How it works

```
XでBuild in Publicのポストに #ANS をつける
        ↓
ANSが自動収集
        ↓
Claudeがポスト群を解析してプロダクトページを生成
        ↓
ANS.devで発見・投票される
        ↓
（将来）SMTPブロードキャストで購読者・エージェントに配信
```

---

## Features

### MVP v1（現在）
- **自動収集** — `#ANS` タグ付きXポストを1時間ごとに収集
- **AI解析** — Claude APIがポスト群からプロダクト名・説明・カテゴリを自動生成
- **Build in Publicタイムライン** — Xのポスト群をオーセンティックなストーリーとして表示
- **発見・検索・投票** — カテゴリ・タグで絞り込み、upvoteで注目度を可視化

### MVP v2（予定）
- AI動画CM自動生成（Claude + Runway + FFmpeg）
- SNS用フォーマット自動書き出し

### MVP v3（予定）
- SMTPブロードキャスト配信
- `subscribe@ans.dev` にメールを送るだけで購読開始
- AI Agent Hub連携によるエージェント間配信

### MVP v4（予定）
- MCPサーバー — IDE/CLIからエージェントを発見・接続
- エージェント登録（SMTPアドレス + ケイパビリティ）

---

## Who is ANS for?

| ユーザー | 使い方 |
|----------|--------|
| バイブコーダー | `#ANS` をつけてXにポストするだけ。追加作業ゼロ。 |
| プロダクト発見者 | ANS.devで最新のバイブコーディング産プロダクトを発見・投票 |
| 技術ユーザー | SMTPで購読、MCPでIDE/CLIから発見（v3以降） |
| AIエージェント | 自律的に他エージェントを発見・接続（v4以降） |

---

## Why ANS?

| 既存の手段 | 問題 |
|------------|------|
| Product Hunt | 一発ネタ化。翌月以降は静寂。 |
| X（Twitter） | アルゴリズムに流される。コンバージョンに繋がりにくい。 |
| Reddit | 効果はあるが、毎回手動投稿が必要。 |
| AIディレクトリ | 乱立しすぎて発見されない。 |

ANSは**継続的な発見チャネル**として機能します。  
一度 `#ANS` をつけてポストすれば、その後のポストも自動的に蓄積され、プロダクトのストーリーとして可視化されます。

---

## Tech Stack

| レイヤー | 技術 |
|----------|------|
| フロントエンド | Next.js 15 (App Router) + TypeScript |
| スタイリング | Tailwind CSS |
| DB | Supabase (PostgreSQL) |
| 認証 | Supabase Auth (X OAuth) |
| X収集 | X API v2 |
| AI解析 | Claude API (claude-sonnet-4-20250514) |
| スケジューラ | Vercel Cron Jobs |
| デプロイ | Vercel |
| 配信エンジン | AI Agent Hub (v3以降) |

---

## Getting Started

### 前提条件

- Node.js 20+
- Supabaseアカウント
- X Developer Accountと Bearer Token
- Anthropic API Key

### セットアップ

```bash
git clone https://github.com/yourname/ans.git
cd ans
npm install
```

### 環境変数

`.env.local` を作成：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
X_BEARER_TOKEN=
X_CLIENT_ID=
X_CLIENT_SECRET=
CRON_SECRET=
```

### DBセットアップ

Supabaseのダッシュボードで `schema.sql` を実行してください。

### 開発サーバー起動

```bash
npm run dev
```

### 収集テスト

```bash
curl -X POST http://localhost:3000/api/collect \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## Monetization

| 対象 | 内容 |
|------|------|
| 個人・OSS | **永久無料** |
| スタートアップ・企業 | スポンサード表示（Web UI + SMTPブロードキャスト + MCP全レイヤー） |
| 認定バッジ | 検証済みプロダクト・エージェント |
| 企業向けAPI | MCPアクセス有料プラン（v4以降） |
| エージェント接続 | マイクロトランザクション（v4以降） |

個人とOSSは永久無料。収益は企業から取る。  
民主化というミッションと矛盾しない設計にしています。

---

## The Name

**ANS = Agent Name Server**

DNSがドメイン名をIPアドレスに解決するように、  
ANSはエージェント名を「SMTPアドレス + ケイパビリティ」に解決します。

| DNS | ANS |
|-----|-----|
| ドメイン → IPアドレス | エージェント名 → SMTPアドレス + ケイパビリティ |
| ゾーンファイル | プロダクト・エージェントレジストリ |
| 再帰クエリ | エージェントチェーン |
| スパムフィルタ | AI Agent Hub ガバナンス |

---

## Relationship with AI Agent Hub

ANSは [AI Agent Hub](https://github.com/yourname/ai-agent-os) のキラーユースケースとして設計されています。

- SMTPブロードキャスト配信エンジンとしてAI Agent Hubを流用
- ANS自体がAI Agent Hubの「エージェント間メッセージング」のデモになる
- ANSの成長がAI Agent Hubの採用理由になる

---

## License

MIT

---

## Author

[@raberabe1121](https://x.com/raberabe1121)  
Built with Claude + vibe coding.  
`#ANS` をつけてポストして、このREADMEに載りましょう。
