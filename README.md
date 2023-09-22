This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## 最低機能要件のシーケンス図
```mermaid
sequenceDiagram
    User->>Application: スマートフォンのブラウザでアプリケーションを開く
    Application->>User: HTMLのcapture属性を使用してカメラを起動
    User->>Application: 写真を撮る
    Application->>mediapipe: 撮影した画像を解析して数値化
    mediapipe-->>Application: 顔検出の数値を返す
    Application->>User: 写真のプレビューを表示
    User->>Application: 必殺技の名前を入力
    Application->>ChatGPT API: 顔検出の数値、必殺技の名前、追加のプロンプトを送信
    ChatGPT API-->>Application: 笑顔度、必殺技の強さ、攻撃力を返す
    Application->>User: ユーザーの写真、特徴的な文章、攻撃力を含む完成したカードを表示
```
