import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1 gap-4">
      <h1 className="text-4xl font-bold">X Signal</h1>
      <p className="text-lg text-fd-muted-foreground">
        Xのトレンドツイートを毎日自動収集・要約
      </p>
      <div className="flex gap-4 justify-center mt-4">
        <Link
          href="/docs/claude-code"
          className="px-6 py-3 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium hover:opacity-90"
        >
          Claude Code
        </Link>
        <Link
          href="/docs/cursor"
          className="px-6 py-3 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium hover:opacity-90"
        >
          Cursor
        </Link>
      </div>
    </div>
  );
}
