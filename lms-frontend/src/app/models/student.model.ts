import { Course } from './course.model';

export interface Student {
  _id: string;
  name: string;
  email: string;
  enrolledCourses: Course[];
  createdAt: Date;
}
