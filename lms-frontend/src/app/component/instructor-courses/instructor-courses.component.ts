import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-instructor-courses',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './instructor-courses.component.html',
  styleUrl: './instructor-courses.component.scss',
})
export class InstructorCoursesComponent implements OnInit {
  userName: string = '';
  imageURL: string = '';
  courses: any[] = [];
  courseForm: FormGroup;
  isEditing: boolean = false;
  editingCourseId: string | null = null;
  showForm: boolean = false;
  searchQuery: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      //image: ['', Validators.required],
      label: ['New'],
      labelColor: ['green'],
    });
  }

  ngOnInit(): void {
    this.getUserProfile();
    this.loadCourses();
    this.createCourse();
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

  loadCourses() {
    const token = localStorage.getItem('token');
    const instructorId = localStorage.getItem('userId'); // Store user ID after login
    console.log('InstructorID: ', instructorId);

    if (!token || !instructorId) {
      alert('No token or user ID found. Please log in again.');
      return;
    }

    this.http
      .get(`http://localhost:3000/api/courses/instructor/${instructorId}`, {
        headers: { Authorization: token },
      })
      .subscribe(
        (courses: any) => {
          this.courses = courses;
          console.log('Instructor courses:', courses);
        },
        (error) => {
          console.error('Error fetching instructor courses:', error);
          alert(error.error.message || 'Failed to fetch courses');
        }
      );
  }

  createCourse() {
    if (this.courseForm.invalid) {
      console.log('Form is invalid:', this.courseForm.value);
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in again.');
      return;
    }
    console.log('Sending request with data:', this.courseForm.value);

    this.http
      .post('http://localhost:3000/api/courses/create', this.courseForm.value, {
        headers: { Authorization: token },
      })
      .subscribe((response) => {
        console.log('Response:', response);
        alert('Course created successfully!');
        this.loadCourses();
        this.toggleAddCourse();
      });
  }

  editCourse(course: any) {
    this.isEditing = true;
    this.editingCourseId = course._id;
    this.courseForm.patchValue(course);
    this.showForm = true;
  }

  updateCourse() {
    if (!this.editingCourseId) return;

    const token = localStorage.getItem('token');
    if (token) {
      this.http
        .put(
          `http://localhost:3000/api/courses/${this.editingCourseId}`,
          {
            headers: { Authorization: token },
          },
          this.courseForm.value
        )
        .subscribe(() => {
          alert('Course updated successfully!');
          this.loadCourses();
          this.toggleAddCourse();
        });
    }
  }

  deleteCourse(courseId: string) {
    if (!confirm('Are you sure you want to delete this course?')) return;

    const token = localStorage.getItem('token');
    if (token) {
      this.http
        .delete(`http://localhost:3000/api/courses/${courseId}`, {
          headers: { Authorization: token },
        })
        .subscribe(() => {
          alert('Course deleted successfully!');
          this.loadCourses();
        });
    }
  }

  toggleAddCourse() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.isEditing = false;
      this.courseForm.reset();
    }
  }

  filteredCourses() {
    return this.courses.filter((course) =>
      course.title.toLowerCase().includes(this.searchQuery.toLowerCase())
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
