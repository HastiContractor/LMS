import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http
      .post('http://localhost:3000/api/auth/register', {
        name: this.name,
        email: this.email,
        password: this.password,
      })
      .subscribe(
        () => {
          alert('Registration Successful!');
          this.router.navigate(['/login']);
        },
        (err) => alert('Registration failed!')
      );
  }
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
