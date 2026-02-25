import { BACKEND_URL, COURSE_ID_2 } from "@/api.config";
import { UserContext } from "@/Contexts/UserContext";
import { decryptString } from "@/helpers";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useLmsPreference } from "@/hooks/useLmsPreference";
import { getCoursesDashboardUrl } from "@/constants/lmsPreference";

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
  const { lmsPreference, loading: lmsLoading } = useLmsPreference();
  let activeModule: any = null;
  let courseData: any = {};

  useEffect(() => {
    if (!lmsLoading && lmsPreference === "unlocked") {
      window.location.href = getCoursesDashboardUrl(COURSE_ID_2);
      return;
    }
  }, [lmsPreference, lmsLoading]);

  const fetchCourse = () => {
    setUser({ ...user, loading: true });
    const token = localStorage.getItem("token");
    axios
      .get(BACKEND_URL + "/user/course/getfull/" + COURSE_ID_2, {
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

        router.replace(`/course/${activeModule.chapter_id}/${activeModule.id}`);
      })
      .catch((err) => {
        setUser({ ...user, loading: false });
      });
  };

  const submitProgress = (module_id: any, score: any) => {
    const token = localStorage.getItem("token");
    const module_search = findObjectById(courseData, module_id);
    console.log("Module search result:", module_search);
    console.log("Is module live?", module_search?.is_live);
    
    if (module_search && module_search.is_live) {
      console.log("Attempting to submit progress for module:", module_id);
      
      const url = `${BACKEND_URL}/user/module/addProgress/${module_id}?points=${score}&type=${module_search.data.category}`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      
      console.log("POST request URL:", url);
      console.log("POST request headers:", headers);
      
      try {
        axios.post(url, {}, { headers })
          .then((res) => {
            console.log("Progress submission successful:", res.data);
            // ... rest of the code ...
          })
          .catch((err) => {
            console.error("Error submitting progress:", err);
            setUser({ ...user, loading: false });
          });
        
        console.log("axios.post call made");
      } catch (error) {
        console.error("Error calling axios.post:", error);
      }
    } else {
      console.log("Module is not live or not found. Skipping progress submission.");
    }
  };

  useEffect(() => {
    if (lmsLoading || lmsPreference === "unlocked") return;
    fetchCourse();
  }, [lmsLoading, lmsPreference]);

  return <></>;
}
