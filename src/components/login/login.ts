import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { UserRole } from '../../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['Customer', Validators.required],
    });
  }

  clearError(): void {
    if (this.errorMessage) {
      this.errorMessage = '';
      this.cdr.detectChanges();
    }
  }

  get selectedRole(): UserRole {
    return this.loginForm.get('role')?.value;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { username, password, role } = this.loginForm.value;
    this.errorMessage = '';

    this.authService.login(username, password, role).subscribe({
      next: (response) => {
        if (response && response.user) {
          this.messageService.show(`Welcome back, ${response.user.username}!`, 'success');
          if (response.user.role === 'Admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/products']);
          }
        } else {
          this.errorMessage =
            role === 'Admin'
              ? 'Invalid admin credentials. Please check username and password.'
              : 'Invalid credentials. Please check your username and password.';
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.errorMessage = 'Login failed. Make sure the server is running on port 3000.';
        this.cdr.detectChanges();
      },
    });
  }
}
