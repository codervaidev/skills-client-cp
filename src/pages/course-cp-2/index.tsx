import { useRouter } from "next/router";
import { useEffect } from "react";
import LMSSkeleton from "@/components/LMSSkeleton";

const CP2_COURSE_ID = "1";

export default function CourseCp2Redirect(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      router.replace("/course/" + CP2_COURSE_ID);
    }
  }, [router.isReady]);

  return <LMSSkeleton />;
}
