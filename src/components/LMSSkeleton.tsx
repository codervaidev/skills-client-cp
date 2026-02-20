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
    className={`h-4 rounded-lg bg-gray-300/20 dark:bg-gray-600/30 animate-pulse ${className}`}
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
    className={`rounded-xl bg-gray-300/20 dark:bg-gray-600/30 animate-pulse ${className}`}
    style={{ height }}
  />
);

export default function LMSSkeleton() {
  return (
    <div className="overflow-x-hidden min-h-screen bg-white dark:bg-[#0B060D]">
      <Nav />
      {/* Shimmer overlay for premium feel */}
      <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
        <div className="lms-skeleton-shimmer absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 dark:via-white/[0.02] to-transparent" />
      </div>

      <div className="py-16 bg-white dark:bg-[#0B060D] overflow-x-hidden relative z-10">
        <div className="w-[90%] lgXl:w-[80%] mx-auto py-12 z-20">
          <div className="flex flex-col lg:flex-row gap-24 justify-between relative">
            {/* Left column - main content */}
            <div style={{ flex: 2 }} className="z-10 space-y-8">
              {/* Course title */}
              <div className="space-y-2">
                <SkeletonLine width="75%" className="h-8 rounded-lg" />
                <SkeletonLine width="40%" className="h-4" />
              </div>

              {/* Video / content area */}
              <div className="rounded-xl overflow-hidden bg-gray-200/30 dark:bg-gray-700/20 border border-gray-200/30 dark:border-gray-600/30">
                <div
                  className="w-full bg-gray-300/30 dark:bg-gray-600/20 animate-pulse"
                  style={{ aspectRatio: "16/9", minHeight: "280px" }}
                />
                <div className="p-4 flex gap-3">
                  <SkeletonBlock height="2rem" className="w-24" />
                  <SkeletonBlock height="2rem" className="w-24" />
                </div>
              </div>

              {/* Description block */}
              <div className="space-y-3 pt-4 border-t border-gray-200/30 dark:border-gray-600/20">
                <SkeletonLine width="30%" className="h-5" />
                <SkeletonLine />
                <SkeletonLine />
                <SkeletonLine width="85%" />
                <SkeletonLine width="60%" />
              </div>

              {/* Prev / Next buttons */}
              <div className="flex justify-between items-center gap-4 pt-6">
                <SkeletonBlock height="3rem" className="w-32 flex-1 max-w-[140px]" />
                <SkeletonBlock height="3rem" className="w-32 flex-1 max-w-[140px]" />
              </div>

              {/* Discussions section */}
              <div className="mt-10 space-y-4">
                <SkeletonLine width="25%" className="h-6" />
                <div className="rounded-xl bg-gray-200/20 dark:bg-gray-700/20 border border-gray-200/30 dark:border-gray-600/20 p-4 space-y-3">
                  <SkeletonBlock height="4rem" className="w-full rounded-lg" />
                  <div className="flex justify-end">
                    <SkeletonBlock height="2.5rem" className="w-28" />
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <SkeletonBlock height="2.5rem" className="w-10 shrink-0 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <SkeletonLine width="40%" />
                        <SkeletonLine width="90%" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - sidebar */}
            <div style={{ flex: 1 }} className="z-10">
              <div className="text-heading dark:text-darkHeading">
                <div className="h-[100vh] overflow-hidden py-6 px-4 border rounded-lg border-gray-300/20 dark:border-gray-600/30 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-600">
                  {/* Progress dashboard */}
                  <div className="mb-6 p-4 bg-gray-200/20 dark:bg-gray-800/40 rounded-lg border border-gray-200/30 dark:border-gray-700/50 space-y-4">
                    <SkeletonLine width="55%" className="h-4" />
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between">
                          <SkeletonLine width="4rem" className="h-3" />
                          <SkeletonLine width="3rem" className="h-3" />
                        </div>
                        <SkeletonBlock height="0.75rem" className="w-full rounded-full" />
                      </div>
                    ))}
                  </div>

                  {/* Phase / chapter accordions */}
                  {[1, 2, 3].map((phase) => (
                    <div
                      key={phase}
                      className="mb-6 rounded-lg border border-gray-200/30 dark:border-gray-600/20 overflow-hidden bg-gray-200/10 dark:bg-gray-800/20"
                    >
                      <div className="p-4 border-b border-gray-200/20 dark:border-gray-600/20">
                        <div className="flex items-center gap-3">
                          <SkeletonBlock height="2rem" className="w-10 rounded-full shrink-0" />
                          <div className="flex-1 space-y-1">
                            <SkeletonLine width="70%" className="h-4" />
                            <SkeletonLine width="45%" className="h-3" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        {[1, 2, 3, 4].map((mod) => (
                          <div
                            key={mod}
                            className="flex gap-3 items-center py-2 px-2 rounded-lg bg-gray-200/20 dark:bg-gray-700/10"
                          >
                            <SkeletonBlock height="1.25rem" className="w-8 shrink-0 rounded" />
                            <SkeletonLine width={mod === 2 ? "90%" : "75%"} className="h-4" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        @keyframes lms-shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .lms-skeleton-shimmer {
          animation: lms-shimmer 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
