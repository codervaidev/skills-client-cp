import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { LMS_PREFERENCE_COURSE_IDS } from "@/constants/lmsPreference";

/**
 * Returns whether the user has purchased/enrolled in at least one of the LMS
 * preference courses (18, 15, 1). Used to show the LMS preference modal only
 * to users who actually have access to those courses.
 */
export function useHasPurchasedLmsPreferenceCourses(): {
  hasPurchased: boolean;
  loading: boolean;
  refetch: () => Promise<void>;
} {
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setHasPurchased(false);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get<{ data?: { id: number }[] }>(
        BACKEND_URL + "/user/course/getEnrolledCoursesByUserId",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const courses = res.data?.data ?? [];
      const hasAny = courses.some((c) =>
        (LMS_PREFERENCE_COURSE_IDS as readonly string[]).includes(String(c.id))
      );
      setHasPurchased(hasAny);
    } catch {
      setHasPurchased(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { hasPurchased, loading, refetch: fetch };
}
