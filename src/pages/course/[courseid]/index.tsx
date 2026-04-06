import { BACKEND_URL, COURSE_ID, COURSE_ID_2 } from "@/api.config";
import { UserContext } from "@/Contexts/UserContext";
import { decryptString } from "@/helpers";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import LMSSkeleton from "@/components/LMSSkeleton";
import { useLmsPreference } from "@/hooks/useLmsPreference";
import { getCoursesDashboardUrl } from "@/constants/lmsPreference";

function findObjectById(data: any, targetId: any) {
  const chapters = data?.chapters || [];
  for (const chapter of chapters) {
    const modules = chapter?.modules || [];
    for (let result of modules) {
      if (result.id === targetId) {
        return result;
      }
    }
  }
  return undefined;
}

export default function CourseRedirect(): JSX.Element {
  const [user, setUser] = useContext<any>(UserContext);
  const router = useRouter();
  const courseid = router.query.courseid as string;
  const { lmsPreference, loading: lmsLoading } = useLmsPreference();
  let activeModule: any = null;
  let courseData: any = {};

  const redirectHome = () => {
    router.replace("/");
  };

  const checkCourseAccess = async () => {
    if (!courseid) return;

    if (courseid !== COURSE_ID && courseid !== COURSE_ID_2) {
      redirectHome();
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      redirectHome();
      return;
    }

    try {
      const enrolledRes = await axios.get(
        `${BACKEND_URL}/user/course/getEnrolledCoursesByUserId`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const enrolledCourses = enrolledRes.data?.data ?? [];
      const hasAccess = enrolledCourses.some(
        (course: any) => String(course.id) === courseid,
      );

      if (!hasAccess) {
        redirectHome();
        return;
      }

      if (lmsPreference === "unlocked") {
        window.location.href = getCoursesDashboardUrl(courseid);
        return;
      }

      fetchCourse();
    } catch (err) {
      redirectHome();
    }
  };

  const fetchCourse = () => {
    if (!courseid) return;
    setUser({ ...user, loading: true });
    const token = localStorage.getItem("token");
    axios
      .get(BACKEND_URL + "/user/course/getfull/" + courseid, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        courseData = res.data;

        if (res.data.maxModuleSerialProgress === 0) {
          submitProgress(
            res.data.chapters[0].modules[0].id,
            res.data.chapters[0].modules[0].score,
          );
        }

        res.data.chapters.forEach((chapter: any) => {
          chapter.modules.forEach((module: any) => {
            if (module.serial === res.data.maxModuleSerialProgress + 1) {
              activeModule = module;
            }
          });
        });

        setUser({ ...user, loading: false });

        if (activeModule === null) {
          const chapters: Array<any> = res.data.chapters;
          const chapter = chapters[chapters.length - 1];
          const modules: Array<any> = chapter.modules;
          activeModule = modules[modules.length - 1];
        }

        router.replace(`/course/${courseid}/${activeModule.chapter_id}/${activeModule.id}`);
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
      });
  };

  const submitProgress = (module_id: any, score: any) => {
    const token = localStorage.getItem("token");
    const module_search = findObjectById(courseData, module_id);
    if (module_search && module_search.is_live) {
      axios
        .post(
          `${BACKEND_URL}/user/module/addProgress/${module_id}?points=${score}&type=${module_search.data.category}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then(() => {})
        .catch((err) => setUser({ ...user, loading: false }));
    }
  };

  useEffect(() => {
    if (lmsLoading) return;
    if (router.isReady && courseid) checkCourseAccess();
  }, [router.isReady, courseid, lmsLoading, lmsPreference]);

  return <LMSSkeleton />;
}
