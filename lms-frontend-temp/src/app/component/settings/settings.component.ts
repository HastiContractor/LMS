import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  userName: string = '';
  imageURL: string = '';
  user: any = {}; // Store user data
  selectedFile: File | null = null;
  imageUrl: string = 'assets/profile.png';
  isDarkMode: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.getUserSettings();
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

  // Fetch user settings
  getUserSettings() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    this.http
      .get('http://localhost:3000/api/users/profile', {
        headers: { Authorization: token },
      })
      .subscribe(
        (response: any) => {
          this.user = response;
          this.imageUrl = response.profilePicture
            ? `http://localhost:3000${response.profilePicture}`
            : 'assets/profile.png';
        },
        (error) => console.error('Error fetching user settings:', error)
      );
  }

  // Handle file selection
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imageUrl = e.target.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Upload Profile Picture
  uploadProfilePicture() {
    if (!this.selectedFile) {
      alert('Please select an image first!');
      return;
    }

    const userId = localStorage.getItem('userId');
    const formData = new FormData();
    formData.append('profilePicture', this.selectedFile);

    this.http
      .put(
        `http://localhost:3000/api/users/${userId}/profile-picture`,
        formData
      )
      .subscribe(
        (response: any) => {
          alert('Profile picture updated successfully!');
          this.imageUrl = `http://localhost:3000${response.profilePicture}`;
        },
        (error) => console.error('Error uploading profile picture:', error)
      );
  }

  // Update user settings
  updateSettings() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found!');
      return;
    }

    this.http
      .put('http://localhost:3000/api/users/profile', this.user, {
        headers: { Authorization: token },
      })
      .subscribe(
        (response) => {
          alert('Settings updated successfully!');
        },
        (error) => {
          console.error('Error updating settings:', error);
          alert('Failed to update settings. Please try again.');
        }
      );
  }

  // Toggle dark mode
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.user.theme = this.isDarkMode ? 'dark' : 'light';
    this.updateSettings();
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
