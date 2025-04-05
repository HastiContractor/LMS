import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Course {
  _id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  _id: string;
  title: string;
  sections: Section[];
  quizzes: Quiz[];
}

interface Section {
  heading: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
}

interface Quiz {
  question: string;
  options: string[];
  correctAnswer: string;
}

@Component({
  selector: 'app-course-detail',
  imports: [CommonModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent implements OnInit {
  userName: string = '';
  imageURL: string = '';

  course!: Course;
  lessonIndex: number = 0;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getUserProfile();
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.http
        .get<Course>(`http://localhost:3000/api/courses/${courseId}`)
        .subscribe(
          (data) => {
            this.course = data;
            this.getLessons(courseId);
          },
          (error) => {
            console.error('Error fetching course:', error);
          }
        );
    }
  }

  getUserProfile() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http
        .get<{ name: string; profilePicture: string }>(
          'http://localhost:3000/api/users/profile',
          {
            headers: { Authorization: token },
          }
        )
        .subscribe(
          (response) => {
            this.userName = response.name;
            this.imageURL = response.profilePicture || 'assets/profile.png';
            console.log('Profile Image URL:', this.imageURL); // Debugging
          },
          (error) => {
            console.error('Error fetching user profile: ', error);
          }
        );
    }
  }

  //fetch lessons separately
  getLessons(courseId: string) {
    this.http
      .get<Lesson[]>(`http://localhost:3000/api/lessons/${courseId}`, {
        headers: { Authorization: localStorage.getItem('token') || '' },
      })
      .subscribe(
        (lessons) => {
          this.course.lessons = lessons;
        },
        (error) => {
          console.error('Error fetching lessons: ', error);
        }
      );
  }

  formatSectionContent(content: string): string {
    const escaped = this.escapeHtml(content);

    // Convert code blocks ```...``` to <pre><b>...</b></pre>
    const formatted = escaped.replace(
      /```(?:\w+)?\n([\s\S]*?)```/g,
      (_match, code) => {
        return `<pre><b>${code}</b></pre>`;
      }
    );

    // Replace normal newlines with <br> (outside of code blocks)
    return formatted.replace(/\n/g, '<br>');
  }

  escapeHtml(text: string): string {
    const map: any = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  //navigate to the previous lesson
  prevLesson(): void {
    if (this.lessonIndex > 0) {
      this.lessonIndex--;
    }
  }

  //navigate to the next lesson
  nextLesson(): void {
    if (this.lessonIndex < this.course.lessons.length - 1) {
      this.lessonIndex++;
    }
  }

  dashboardIcon = 'fas fa-home';
  coursesIcon = 'fas fa-book';
  studentsIcon = 'fas fa-users';
  reportsIcon = 'fas fa-chart-bar';
  settingsIcon = 'fas fa-cog';
  logoutIcon = 'fas fa-sign-out-alt';

  changeIcon(section: string, hover: boolean) {
    switch (section) {
      case 'dashboard':
        this.dashboardIcon = hover ? 'fas fa-house-user' : 'fas fa-home';
        break;
      case 'courses':
        this.coursesIcon = hover ? 'fas fa-book-open' : 'fas fa-book';
        break;
      case 'students':
        this.studentsIcon = hover ? 'fas fa-user-graduate' : 'fas fa-users';
        break;
      case 'reports':
        this.reportsIcon = hover ? 'fas fa-chart-line' : 'fas fa-chart-bar';
        break;
      case 'settings':
        this.settingsIcon = hover ? 'fas fa-tools' : 'fas fa-cog';
        break;
      case 'logout':
        this.logoutIcon = hover ? 'fas fa-door-open' : 'fas fa-sign-out-alt';
        break;
    }
  }

  isSidebarCollapsed: boolean = true; // Initial state (expanded)

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToCourses() {
    this.router.navigate(['/instructor-courses']);
  }

  navigateToStudents() {
    this.router.navigate(['/students']);
  }

  navigateToReports() {
    this.router.navigate(['/reports']);
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
