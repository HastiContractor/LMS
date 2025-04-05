import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import confetti from 'canvas-confetti';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent implements OnInit {
  userName: string = '';
  imageURL: string = '';

  progressPercentage: number = 0;

  courseStatus: string = '';
  showModal: boolean = false;
  progress: number = 0;

  course!: Course;
  lessonIndex: number = 0;

  userAnswers: string[] = [];
  feedback: string[] = [];
  correctCount: number = 0;
  totalScore: number = 0;
  checkedQuestions: Set<number> = new Set(); //prevent double scoring

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getUserProfile();
    this.getProgress();
    this.checkCourseStatusFromBackend();

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

  checkAnswer(index: number) {
    const selected = this.userAnswers[index];
    const correct =
      this.course.lessons[this.lessonIndex].quizzes[index].correctAnswer;

    if (!selected) {
      this.feedback[index] = 'Please select an answer.';
      return;
    }

    // Check if already answered
    if (this.checkedQuestions.has(index)) {
      return;
    }

    if (selected === correct) {
      this.feedback[index] = 'Correct!';
      this.correctCount++;
      this.totalScore += 1; // Each question is 1 point
    } else {
      this.feedback[index] = `Incorrect. Correct answer: ${correct}`;
    }

    this.checkedQuestions.add(index);
  }

  getOptionClass(index: number, option: string): string {
    const selected = this.userAnswers[index];
    const correct =
      this.course.lessons[this.lessonIndex].quizzes[index].correctAnswer;

    if (selected === option) {
      return selected === correct ? 'correct-radio' : 'incorrect-radio';
    }
    return '';
  }

  resetQuizState() {
    const quizLength =
      this.course.lessons[this.lessonIndex]?.quizzes?.length || 0;
    this.userAnswers = new Array(quizLength).fill('');
    this.feedback = new Array(quizLength).fill('');
    this.correctCount = 0;
    this.totalScore = 0;
    this.checkedQuestions = new Set();
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

  getProgress() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (!courseId) return;
    this.http
      .get(`http://localhost:3000/api/progress/summary?courseId=${courseId}`, {
        headers: { Authorization: localStorage.getItem('token') || '' },
      })
      .subscribe(
        (res: any) => {
          this.progressPercentage = res.percentage;
        },
        (error) => {
          console.error('Error getting progress: ', error);
        }
      );
  }

  get currentLessonQuizzes() {
    return this.course?.lessons?.[this.lessonIndex]?.quizzes ?? [];
  }

  //navigate to the previous lesson
  prevLesson(): void {
    if (this.lessonIndex > 0) {
      this.lessonIndex--;
      this.resetQuizState();
    }
  }

  loadProgress() {
    this.http
      .get('http://localhost:3000/api/progress/summary', {
        headers: { Authorization: localStorage.getItem('token') || '' },
      })
      .subscribe(
        (res: any) => {
          this.progressPercentage = res.percentage;
        },
        (error) => {
          console.error('Error getting progress: ', error);
        }
      );
  }

  //navigate to the next lesson
  nextLesson(): void {
    const currentLessonId = this.course.lessons[this.lessonIndex]._id;
    this.http
      .post<any>(
        'http://localhost:3000/api/progress/complete',
        { lessonId: currentLessonId },
        {
          headers: { Authorization: localStorage.getItem('token') || '' },
        }
      )
      .subscribe(
        () => {
          this.getProgress();
          if (this.lessonIndex < this.course.lessons.length - 1) {
            this.lessonIndex++;
            this.resetQuizState();
          } else {
            console.log("You've completed last lesson!");
          }
        },
        (error) => {
          console.error('Error marking lesson complete:', error);
        }
      );
  }

  completeLastLesson(): void {
    const lessonId = this.course.lessons[this.lessonIndex]._id;
    this.courseStatus = 'Completed';
    this.progress = 100;
    this.progressPercentage = 100;
    this.showModal = true;

    this.http
      .post<any>(
        'http://localhost:3000/api/progress/complete',
        { lessonId },
        {
          headers: {
            Authorization: localStorage.getItem('token') || '',
          },
        }
      )
      .subscribe(
        () => {
          this.getProgress();
          console.log('Course completed!');
        },
        (error) => {
          console.error('Error marking last lesson complete:', error);
        }
      );
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  checkCourseStatusFromBackend() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (!courseId) return;

    this.http
      .get<{ status: string }>(
        `http://localhost:3000/api/progress/status?courseId=${courseId}`,
        {
          headers: { Authorization: localStorage.getItem('token') || '' },
        }
      )
      .subscribe(
        (res) => {
          this.courseStatus = res.status;
          if (this.courseStatus === 'Completed') {
            this.progress = 100;
            this.progressPercentage = 100;
            this.triggerCelebration();
          }
        },
        (error) => {
          console.error('Error fetching course status:', error);
        }
      );
  }

  onCompleteClick(): void {
    this.completeLastLesson();
  }

  triggerCelebration() {
    this.showModal = true;
    this.progress = 100;
    this.launchConfetti();
  }

  launchConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  closeModal() {
    this.showModal = false;
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
