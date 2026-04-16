import { useRouter } from "next/router";
import { useEffect } from "react";
import LMSSkeleton from "@/components/LMSSkeleton";

const CP2_COURSE_ID = "1";

export default function CourseCp2Redirect(): JSX.Element {
  const router = useRouter();
  const chapterid = router.query.chapterid as string;

  useEffect(() => {
    if (router.isReady && chapterid) {
      router.replace(`/course/${CP2_COURSE_ID}/${chapterid}`);
    }
  }, [router.isReady, chapterid]);

  return <LMSSkeleton />;
}
