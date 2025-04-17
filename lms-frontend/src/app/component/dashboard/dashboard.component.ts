import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Lesson } from '../../models/lesson.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  imageURL: string = '';
  courseCount: number = 0;
  studentCount: number = 0;
  newestLessons: Lesson[] = []; // Initialize as an empty array

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.getCourseCount();
    this.getStudentCount();
    this.getNewestContent();
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
            this.getNewestContent();
          },
          (error) => {
            console.error('Error fetching user profile: ', error);
          }
        );
    }
  }
  getCourseCount() {
    const token = localStorage.getItem('token');
    const instructorId = localStorage.getItem('userId');
    if (!instructorId || !token) {
      console.error('No userID or token found');
      return;
    }

    this.http
      .get<{ totalCourses: number }>(
        `http://localhost:3000/api/courses/count/${instructorId}`,
        {
          headers: { Authorization: token },
        }
      )
      .subscribe(
        (response) => {
          this.courseCount = response.totalCourses; // Update course count
        },
        (error) => {
          console.error('Error fetching course count:', error);
        }
      );
  }
  getStudentCount() {
    const instructorId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!instructorId || !token) {
      console.error('No ID or token found');
      return;
    }
    this.http
      .get<{ totalStudents: number }>(
        'http://localhost:3000/api/courses/students/count/',
        { headers: { Authorization: token } }
      )
      .subscribe(
        (response) => {
          this.studentCount = response.totalStudents;
        },
        (error) => {
          console.error('Error fetching student count:', error);
        }
      );
  }
  getNewestContent() {
    const token = localStorage.getItem('token');
    if (!this.userName || !token) return;

    this.http
      .get<Lesson[]>('http://localhost:3000/api/lessons/newest', {
        headers: { Authorization: token },
      })
      .subscribe(
        (response) => {
          console.log('newestLesson: ', this.newestLessons);
          this.newestLessons = response;
        },
        (error) => {
          console.error('Error fetching newest lessons:', error);
        }
      );
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
