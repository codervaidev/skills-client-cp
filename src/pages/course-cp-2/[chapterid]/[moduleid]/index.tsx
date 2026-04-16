import { useRouter } from "next/router";
import { useEffect } from "react";
import LMSSkeleton from "@/components/LMSSkeleton";

const CP2_COURSE_ID = "1";

export default function CourseCp2Redirect(): JSX.Element {
  const router = useRouter();
  const chapterid = router.query.chapterid as string;
  const moduleid = router.query.moduleid as string;

  useEffect(() => {
    if (router.isReady && chapterid && moduleid) {
      router.replace(`/course/${CP2_COURSE_ID}/${chapterid}/${moduleid}`);
    }
  }, [router.isReady, chapterid, moduleid]);

  return <LMSSkeleton />;
}
