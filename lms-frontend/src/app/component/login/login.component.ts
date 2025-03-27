import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http
      .post('http://localhost:3000/api/auth/login', {
        email: this.email,
        password: this.password,
      })
      .subscribe(
        (res: any) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('userId', res.user._id);
          this.router.navigate(['/dashboard']);
        },
        (err) => alert('Login failed!')
      );
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
