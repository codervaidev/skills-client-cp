import { useRouter } from "next/router";
import { useEffect } from "react";
import LMSSkeleton from "@/components/LMSSkeleton";

const DEFAULT_COURSE_ID = "15";

export default function CourseRedirect(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      router.replace("/course/" + DEFAULT_COURSE_ID);
    }
  }, [router.isReady]);

  return <LMSSkeleton />;
}
