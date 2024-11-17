// app/auth/error/page.tsx (Next.js 13+ with App Router)
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();
  return (
    <div>
      <h1>Authentication Error</h1>
      <p>Something went wrong during authentication.</p>
      <button onClick={() => router.push("/")}>Go to Home</button>
    </div>
  );
}
