/**
 * LMS preference: courses 18, 15, 1 can be watched on CP (locked) or on courses repo (unlocked).
 * Used for modal, Nav/course-details, and all redirect/take-action points.
 */
export const LMS_PREFERENCE_COURSE_IDS = ['18', '15', '1'] as const;
export type LmsPreferenceCourseId = (typeof LMS_PREFERENCE_COURSE_IDS)[number];

export const COURSES_BASE_URL = 'https://courses.codervai.com';

export function isLmsPreferenceCourse(courseId: string | number): boolean {
  const id = typeof courseId === 'number' ? String(courseId) : courseId;
  return (LMS_PREFERENCE_COURSE_IDS as readonly string[]).includes(id);
}

/** Courses repo dashboard URL for a course when preference is "unlocked". */
export function getCoursesDashboardUrl(courseId: string | number): string {
  const id = typeof courseId === 'number' ? String(courseId) : courseId;
  return `${COURSES_BASE_URL}/dashboard/${id}`;
}

/** Courses repo LMS deep link (course player) when preference is "unlocked". */
export function getCoursesLmsUrl(courseId: string | number, chapterId?: number, moduleId?: number): string {
  const id = typeof courseId === 'number' ? String(courseId) : courseId;
  if (chapterId != null && moduleId != null) {
    return `${COURSES_BASE_URL}/course/${id}/${chapterId}/${moduleId}`;
  }
  return `${COURSES_BASE_URL}/dashboard/${id}`;
}

export type LmsPreference = 'locked' | 'unlocked';
