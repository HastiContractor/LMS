import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { CoursesComponent } from './component/courses/courses.component';
import { CourseDetailComponent } from './component/course-detail/course-detail.component';
import { StudentsComponent } from './component/students/students.component';
import { ReportsComponent } from './component/reports/reports.component';
import { SettingsComponent } from './component/settings/settings.component';
import { InstructorCoursesComponent } from './component/instructor-courses/instructor-courses.component';
import { LessonComponent } from './component/lesson/lesson.component';
LessonComponent;

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect to login page by default
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'instructor-courses', component: InstructorCoursesComponent },
  { path: 'course/:id', component: CourseDetailComponent }, // Dynamic route for course details
  { path: 'students', component: StudentsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'lesson', component: LessonComponent },

  { path: '**', redirectTo: 'login' }, // Redirect unknown paths to login
];
