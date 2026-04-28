import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import {
  isLoggedIn,
  createLoginRedirectUrl,
  getUserIdFromToken,
} from "@/helpers";
import { useRanking } from "@/hooks/useRanking";
import {
  useCoursesWithRanking,
  CourseWithRanking,
} from "@/hooks/useCoursesWithRanking";

// Import new components
import { RankingPageSkeleton } from "@/components/Skeletons/RankingSkeletons";
import PodiumCard from "@/components/Ranking/PodiumCard";
import MyRankBanner from "@/components/Ranking/MyRankBanner";
import RankingTable from "@/components/Ranking/RankingTable";
import CourseSelector from "@/components/Ranking/CourseSelector";

// This page is auth-gated and data-driven on the client. Explicitly opt into SSR
// so Next doesn't try to prerender/export it at build time.
export async function getServerSideProps() {
  return { props: {} };
}

export default function RankingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const itemsPerPage = 10;

  // Get userId from localStorage
  const [userId, setUserId] = useState<number | undefined>(undefined);

  // Fetch courses with ranking
  const {
    courses: coursesWithRanking,
    loading: coursesLoading,
    error: coursesError,
  } = useCoursesWithRanking();

  useEffect(() => {
    setMounted(true);

    // Check authentication
    if (typeof window !== "undefined" && !isLoggedIn()) {
      const loginUrl = createLoginRedirectUrl();
      router.replace(loginUrl);
      return;
    }

    // Get userId from JWT token using helper function
    const userIdFromToken = getUserIdFromToken();

    if (userIdFromToken) {
      setUserId(parseInt(userIdFromToken));
    } else {
      console.error("No userId found in JWT token");
    }

    // Get course ID from URL or use first available course
    const courseIdFromUrl = router.query.course;
    if (courseIdFromUrl && !isNaN(Number(courseIdFromUrl))) {
      setSelectedCourseId(Number(courseIdFromUrl));
    } else if (coursesWithRanking.length > 0 && !courseIdFromUrl) {
      setSelectedCourseId(coursesWithRanking[0].id);
    }
  }, [router, coursesWithRanking]);

  // Fetch ranking data
  const { rankingData, myData, top3, allRankings, loading, error, refetch } =
    useRanking({
      courseId: selectedCourseId,
      offset: currentPage * itemsPerPage,
      limit: itemsPerPage,
      userId,
    });


  const handleCourseChange = (courseId: number) => {
    setSelectedCourseId(courseId);
    setCurrentPage(0);
    setDropdownOpen(false);

    // Update URL
    router.push(`/ranking?course=${courseId}`, undefined, { shallow: true });
  };

  const selectedCourse = coursesWithRanking.find(
    (c: CourseWithRanking) => c.id === selectedCourseId,
  );

  if (!mounted) return null;

  // Show loading state for initial data fetch
  if (
    (loading && !rankingData) ||
    (coursesLoading && coursesWithRanking.length === 0)
  ) {
    return (
      <DashboardLayout>
        <RankingPageSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        {/* Background decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple/3 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/3 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple/2 to-pink-500/2 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="w-[90%] lg:w-[85%] max-w-[1440px] mx-auto py-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-10"
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl font-bold text-heading dark:text-darkHeading mb-2"
              >
                Course <span className="text-purple">Rankings</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-paragraph dark:text-darkParagraph max-w-2xl mx-auto"
              >
                Track your progress and compete with fellow learners in our
                global leaderboard
              </motion.p>
            </motion.div>

            {/* Course Selector */}
            <CourseSelector
              courses={coursesWithRanking}
              selectedCourse={selectedCourse}
              isOpen={dropdownOpen}
              onToggle={() => setDropdownOpen(!dropdownOpen)}
              onSelect={handleCourseChange}
              loading={coursesLoading}
            />

            {/* Error State */}
            {(error || coursesError) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto mb-8 bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center backdrop-blur-lg"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="bg-red-500/20 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                >
                  <svg
                    className="w-8 h-8 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
                <p className="text-red-400 font-medium mb-4">
                  {error || coursesError}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (error) refetch();
                    if (coursesError) window.location.reload();
                  }}
                  className="px-6 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
                >
                  Retry
                </motion.button>
              </motion.div>
            )}

            {/* Top 3 Podium */}
            {top3.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {/* 2nd Place */}
                  {top3[1] && (
                    <PodiumCard user={top3[1]} position={2} delay={0.1} />
                  )}

                  {/* 1st Place */}
                  {top3[0] && (
                    <PodiumCard user={top3[0]} position={1} delay={0} />
                  )}

                  {/* 3rd Place */}
                  {top3[2] && (
                    <PodiumCard user={top3[2]} position={3} delay={0.2} />
                  )}
                </div>
              </motion.div>
            )}

            {/* My Rank Banner */}
            {myData && <MyRankBanner myData={myData} />}

            {/* Full Rankings Table */}
            <RankingTable
              rankings={allRankings}
              currentUserId={userId}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              loading={loading}
            />

            {/* No Data State */}
            {!loading && !error && allRankings.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto mt-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="bg-gray-800/20 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center"
                >
                  <svg
                    className="w-12 h-12 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-heading dark:text-darkHeading mb-3">
                  No Rankings Yet
                </h3>
                <p className="text-paragraph dark:text-darkParagraph">
                  Be the first to complete modules and appear on the
                  leaderboard!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
