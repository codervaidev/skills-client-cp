import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const SkeletonLine = ({
  className = "",
  width = "100%",
}: {
  className?: string;
  width?: string;
}) => (
  <div
    className={`rounded-lg bg-gray-300/25 dark:bg-gray-600/25 animate-pulse ${className}`}
    style={{ width }}
  />
);

const SkeletonBlock = ({
  className = "",
  height = "1rem",
}: {
  className?: string;
  height?: string;
}) => (
  <div
    className={`rounded-xl bg-gray-300/25 dark:bg-gray-600/25 animate-pulse ${className}`}
    style={{ height }}
  />
);

export default function CourseDetailsSkeleton() {
  return (
    <div className="overflow-x-hidden min-h-screen bg-white dark:bg-[#0B060D]">
      <Nav />
      <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
        <div className="course-details-shimmer absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 dark:via-white/[0.02] to-transparent" />
      </div>

      <div className="pt-20 bg-white dark:bg-[#0B060D] overflow-x-hidden relative z-10">
        <div className="w-[90%] lg:w-[90%] mx-auto py-12 z-20">
          <div className="flex flex-col-reverse lg:flex-row gap-24 justify-between relative">
            {/* Left column - main content */}
            <div style={{ flex: 2 }} className="z-10 space-y-6">
              <div className="space-y-3">
                <SkeletonLine width="70%" className="h-9 rounded-xl" />
                <SkeletonLine width="45%" className="h-4" />
              </div>
              <div className="h-px bg-gray-200/40 dark:bg-gray-600/30" />
              <div className="space-y-2">
                <SkeletonLine width="100%" className="h-4" />
                <SkeletonLine width="95%" className="h-4" />
                <SkeletonLine width="60%" className="h-4" />
              </div>

              {/* Stat cards grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:w-[80%]">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-6 p-4 rounded-xl bg-black/10 dark:bg-white/5 border border-gray-200/20 dark:border-gray-600/20"
                  >
                    <SkeletonBlock height="2.5rem" className="w-12 shrink-0 rounded-lg" />
                    <div className="flex-1 space-y-1">
                      <SkeletonLine width="50%" className="h-3" />
                      <SkeletonLine width="35%" className="h-5 rounded" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Tab pills */}
              <div className="flex flex-wrap gap-2 pt-4 pb-6 border-b border-gray-200/30 dark:border-gray-600/20">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonBlock key={i} height="2.75rem" className="w-28 rounded-full" />
                ))}
              </div>

              {/* Study plan / content blocks */}
              <div className="space-y-4 pt-2">
                <SkeletonLine width="40%" className="h-7 rounded-lg" />
                <div className="flex gap-3 flex-wrap">
                  <SkeletonBlock height="2.5rem" className="w-32 rounded-lg" />
                  <SkeletonBlock height="2.5rem" className="w-24 rounded-lg" />
                  <SkeletonBlock height="2.5rem" className="w-28 rounded-lg" />
                </div>
                <div className="space-y-3 pt-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-gray-200/30 dark:border-gray-600/20 overflow-hidden bg-gray-100/30 dark:bg-gray-800/20"
                    >
                      <div className="p-4 flex items-center gap-3">
                        <SkeletonBlock height="2rem" className="w-10 shrink-0 rounded-full" />
                        <div className="flex-1 space-y-1">
                          <SkeletonLine width={i % 2 === 0 ? "75%" : "90%"} className="h-4" />
                          <SkeletonLine width="40%" className="h-3" />
                        </div>
                      </div>
                      <div className="px-4 pb-3 space-y-2">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="flex gap-2 items-center">
                            <SkeletonBlock height="1rem" className="w-8 shrink-0 rounded" />
                            <SkeletonLine width={`${60 + j * 10}%`} className="h-3" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - pricing card */}
            <div style={{ flex: 1 }} className="z-10">
              <div className="sticky top-24 rounded-xl overflow-hidden bg-gray-200/20 dark:bg-gray-800/30 backdrop-blur-xl border border-gray-200/30 dark:border-gray-600/30 shadow-xl">
                <div
                  className="w-full bg-gray-300/30 dark:bg-gray-600/20 animate-pulse"
                  style={{ aspectRatio: "16/9", minHeight: "200px" }}
                />
                <div className="p-5 space-y-5">
                  <div className="flex flex-col gap-3 pb-4 border-b border-gray-200/30 dark:border-gray-600/20">
                    <SkeletonLine width="40%" className="h-3" />
                    <div className="flex items-baseline gap-3">
                      <SkeletonLine width="5rem" className="h-8 rounded-lg" />
                      <SkeletonLine width="4rem" className="h-5 rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pb-5 border-b border-gray-200/30 dark:border-gray-600/20">
                    <div className="space-y-1">
                      <SkeletonLine width="70%" className="h-3" />
                      <SkeletonLine width="50%" className="h-4 rounded" />
                    </div>
                    <div className="space-y-1">
                      <SkeletonLine width="70%" className="h-3" />
                      <SkeletonLine width="50%" className="h-4 rounded" />
                    </div>
                  </div>
                  <SkeletonBlock height="3.25rem" className="w-full rounded-xl" />
                  <SkeletonLine width="80%" className="h-3 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        @keyframes course-details-shimmer-keyframes {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .course-details-shimmer {
          animation: course-details-shimmer-keyframes 2.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
