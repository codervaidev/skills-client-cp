import { BACKEND_URL, COURSE_ID } from "@/api.config";
import { UserContext } from "@/Contexts/UserContext";
import { decryptString } from "@/helpers";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

function findObjectById(data: any, targetId: any) {
  // Check if chapters exist in the data
  const chapters = data?.chapters || [];

  // Iterate through chapters
  for (const chapter of chapters) {
    // Check if modules exist in the current chapter
    const modules = chapter?.modules || [];

    // Iterate through modules searching for matching serial key
    for (let result of modules) {
      if (result.id === targetId) {
        return result;
      }
    }
  }

  // If no match is found, return undefined
  return undefined;
}

export default function CourseRedirect(): JSX.Element {
  const [user, setUser] = useContext<any>(UserContext);
  const router = useRouter();
  let activeModule: any = null;
  let lastValidModule: any = null;
  let courseData: any = {};

  const fetchCourse = () => {
    setUser({ ...user, loading: true });
    const token = localStorage.getItem("token");
    axios
      .get(BACKEND_URL + "/user/course/getfull-v2/" + COURSE_ID, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const courseResponse = res.data?.data ?? res.data;
        courseData = courseResponse;

        if (courseResponse.maxModuleSerialProgress === 0) {
          submitProgress(
            courseResponse.chapters[0].modules[0].id,
            courseResponse.chapters[0].modules[0].score,
          );
        }

        courseResponse.chapters.forEach((chapter: any) => {
          chapter.modules.forEach((module: any) => {
            if (
              module.chapter_id === parseInt(router.query.chapterid as string) &&
              module.serial <= courseResponse.maxModuleSerialProgress + 1
            ) {
              activeModule = module;
            }

            if(module.serial === courseResponse.maxModuleSerialProgress + 1) {
              lastValidModule = module;
            }
          });
        });

        setUser({ ...user, loading: false });

        if(activeModule !== null) {
          router.replace(`/course-cp-2/${activeModule.chapter_id}/${activeModule.id}`);
        } else if(lastValidModule !== null) {
          router.replace(`/course-cp-2/${lastValidModule.chapter_id}/${lastValidModule.id}`);
        } else {
          const chapters: Array<any> = courseResponse.chapters;
          const chapter = chapters[chapters.length - 1]; 
          const modules: Array<any> = chapter.modules; 
          const validModule = modules[modules.length - 1];

          router.replace(`/course-cp-2/${validModule.chapter_id}/${validModule.id}`);
        }
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
      });
  };

  const submitProgress = (module_id: any, score: any) => {
    const token = localStorage.getItem("token");
    const module_search = findObjectById(courseData, module_id);
    if (module_search.is_live) {
      axios
        .post(
          `${BACKEND_URL}/user/module/addProgress/${module_id}?points=${score}&type=${activeModule.data.category}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          axios
            .get(BACKEND_URL + "/user/course/getfull-v2/" + COURSE_ID, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              const courseResponse = res.data?.data ?? res.data;
              courseData = courseResponse;

              if (courseResponse.maxModuleSerialProgress === 0) {
                submitProgress(
                  courseResponse.chapters[0].modules[0].id,
                  courseResponse.chapters[0].modules[0].score,
                );
              }

              setUser({
                ...user,
                loading: false,
                scoreTrigger: !user.scoreTrigger,
              });
            })
            .catch((err) => {
              setUser({ ...user, loading: false });
            });
        })
        .catch((err) => {
          setUser({ ...user, loading: false });
        });
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [router]);

  return (
    <></>
  );
}