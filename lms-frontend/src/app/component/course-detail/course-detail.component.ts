import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  course!: Course;
  lessonIndex: number = 0;
  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  ngOnInit(): void {
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
}
