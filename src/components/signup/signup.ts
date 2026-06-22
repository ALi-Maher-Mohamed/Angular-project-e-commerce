import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUp {
  signupForm: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  readonly errorMessage = this.messageService.message;
  readonly errorType = this.messageService.type;

  constructor() {
    this.signupForm = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(3)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: confirmPasswordValidator },
    );
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;

    const { username, password } = this.signupForm.value;
    this.authService.signup({ username, password, role: 'Customer' }).subscribe({
      next: () => {
        this.messageService.clear();
        this.router.navigate(['/login']);
      },
      error: () => this.messageService.show('Signup failed. Make sure JSON Server is running on port 3000.'),
    });
  }

  clearMessage(): void {
    this.messageService.clear();
  }
}
