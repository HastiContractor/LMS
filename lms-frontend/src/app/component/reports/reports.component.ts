import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PieChartComponent } from './pie-chart.component';
import { LineChartComponent } from './line-chart.component';
import { BarChartComponent } from './bar-chart.component';

interface CourseReport {
  courseTitle: string;
  totalStudents: number;
  averageCompletionRate: string;
  certificateIssued: number;
}

@Component({
  selector: 'app-reports',
  imports: [
    CommonModule,
    PieChartComponent,
    LineChartComponent,
    BarChartComponent,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnInit {
  userName: string = '';
  imageURL: string = '';

  instructorId: string = 'YOUR_INSTRUCTOR_ID';
  courseReports: any[] = [];

  //separate data for each chart
  barChartData: any[] = [];
  lineChartData: any[] = [];
  pieChartData: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.instructorId = localStorage.getItem('userId') || '';
    const apiUrl = `http://localhost:3000/api/reports/instructor-dashboard/${this.instructorId}`;
    this.http.get<{ reports: CourseReport[] }>(apiUrl).subscribe({
      next: (res) => {
        this.courseReports = res.reports;

        // Prepare chart data from courseReports
        this.barChartData = res.reports.map((c: CourseReport) => ({
          label: c.courseTitle,
          value: c.totalStudents,
        }));

        this.lineChartData = res.reports.map((c: CourseReport) => ({
          label: c.courseTitle,
          value: parseFloat(c.averageCompletionRate),
        }));
        console.log(this.lineChartData);

        this.pieChartData = res.reports.map((c: CourseReport) => ({
          label: c.courseTitle,
          value: c.certificateIssued,
        }));
      },
      error: (err) => {
        console.error('Error fetching instructor report', err);
      },
    });
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
