export interface Lesson {
  _id?: string;
  title: string;
  type: 'lesson' | 'quiz' | 'assignment';
  content: string;
  courseId: string;
  createdAt: string;
  course: { title: string };
}
