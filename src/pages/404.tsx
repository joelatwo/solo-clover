import { useEffect } from "react";
import { useRouter } from "next/router";
import puzzles from "@/data/puzzles";

// A custom Next.js 404 page that redirects users to the first puzzle
// instead of showing the standard "Page not found" message.
export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    if (puzzles && puzzles.length > 0) {
      const firstId = puzzles[0].id;
      router.replace(`/puzzle/${firstId}`);
    } else {
      // fallback to home if puzzles data is unexpectedly empty
      router.replace("/");
    }
  }, [router]);

  return <p>Loading...</p>;
}
