import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from './services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatProgressBarModule, LucideAngularModule],
  animations: [
    trigger('cardEntrance', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95) translateY(20px)' }),
        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="login-page">
      <div class="login-card" @cardEntrance>
        <div class="card-header">
          <div class="logo-circle" routerLink="/tienda">N</div>
          <h1>Bienvenido de nuevo</h1>
          <p>Ingresa a tu cuenta de NovaMarket</p>
        </div>

        <form (ngSubmit)="handleSubmit()" #loginForm="ngForm">
          @if (error()) {
            <div class="error-alert">
              <lucide-icon name="search-x" class="icon-sm"></lucide-icon>
              {{ error() }}
            </div>
          }

          <mat-form-field appearance="outline">
            <mat-label>Email*</mat-label>
            <input matInput type="email" name="email" [(ngModel)]="email" required placeholder="tu@email.com">
            <lucide-icon name="mail" matSuffix class="icon-suffix"></lucide-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Contraseña*</mat-label>
            <input matInput [type]="showPassword() ? 'text' : 'password'" name="password" [(ngModel)]="password" required>
            <button type="button" mat-icon-button matSuffix (click)="showPassword.set(!showPassword())">
              <lucide-icon [name]="showPassword() ? 'eye' : 'eye-off'" class="icon-suffix"></lucide-icon>
            </button>
          </mat-form-field>

          <div class="form-options">
            <button type="button" mat-button color="primary">¿Olvidaste tu contraseña?</button>
          </div>

          <button type="submit" mat-flat-button color="primary" class="submit-btn" [disabled]="isLoading()">
            @if (isLoading()) {
              <span>Iniciando sesión...</span>
            } @else {
              <span>Entrar</span>
              <lucide-icon name="arrow-right" class="icon-sm"></lucide-icon>
            }
          </button>

          <button type="button" mat-stroked-button class="admin-btn" (click)="loginAsAdmin()" [disabled]="isLoading()">
            <lucide-icon name="shield-check" class="icon-sm"></lucide-icon>
            Entrar como Administrador
          </button>
          
          @if (isLoading()) {
            <mat-progress-bar mode="indeterminate" class="loader"></mat-progress-bar>
          }
        </form>

        <div class="card-footer">
          <p>¿No tienes cuenta? <button mat-button color="primary">Regístrate</button></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 20px; }
    
    .login-card { background: white; width: 100%; max-width: 440px; padding: 48px; border-radius: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; }
    
    .card-header { text-align: center; margin-bottom: 32px; }
    .logo-circle { width: 64px; height: 64px; background: #6366f1; color: white; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; margin: 0 auto 24px; cursor: pointer; box-shadow: 0 8px 16px rgba(99, 102, 241, 0.25); }
    .card-header h1 { font-size: 1.85rem; font-weight: 800; color: #0f172a; margin: 0 0 8px; letter-spacing: -0.02em; }
    .card-header p { color: #64748b; font-weight: 500; font-size: 0.95rem; }

    form { display: flex; flex-direction: column; gap: 4px; }
    
    .error-alert { background: #fff1f2; color: #e11d48; padding: 12px 16px; border-radius: 14px; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 10px; margin-bottom: 16px; border: 1px solid #ffe4e6; }

    .form-options { display: flex; justify-content: flex-end; margin-bottom: 12px; }
    .form-options button { font-size: 0.8rem !important; font-weight: 700 !important; color: #4338ca !important; }

    .submit-btn { 
      height: 54px !important; 
      border-radius: 14px !important; 
      font-size: 1.05rem !important; 
      font-weight: 700 !important; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      gap: 10px; 
      margin-top: 12px; 
      background-color: #6366f1 !important;
      color: white !important;
      cursor: pointer !important;
      transition: all 0.2s ease;
    }
    .submit-btn:hover {
      background-color: #4f46e5 !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3) !important;
    }
    .submit-btn:disabled { 
      background-color: #94a3b8 !important; 
      color: #e2e8f0 !important; 
      cursor: not-allowed !important;
      transform: none !important;
      box-shadow: none !important;
    }
    
    .admin-btn { height: 50px !important; border-radius: 14px !important; font-size: 0.95rem !important; font-weight: 600 !important; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 12px; border: 1px solid #e2e8f0 !important; color: #475569 !important; }
    .admin-btn:hover { background: #f8fafc !important; border-color: #cbd5e1 !important; }
    
    .loader { margin-top: 12px; border-radius: 4px; }

    .card-footer { text-align: center; margin-top: 32px; }
    .card-footer p { color: #64748b; font-size: 0.9rem; font-weight: 600; }
    .card-footer button { font-weight: 800 !important; color: #4338ca !important; padding: 0 4px !important; min-width: auto !important; }

    .icon-sm { width: 18px; height: 18px; }
    .icon-suffix { width: 20px; height: 20px; color: #64748b; }
    
    mat-form-field { width: 100%; }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    ::ng-deep .mat-mdc-text-field-wrapper { background-color: transparent !important; }
    ::ng-deep .mdc-notched-outline__leading, 
    ::ng-deep .mdc-notched-outline__notch, 
    ::ng-deep .mdc-notched-outline__trailing { border-color: #e2e8f0 !important; }
    ::ng-deep .mat-focused .mdc-notched-outline__leading, 
    ::ng-deep .mat-focused .mdc-notched-outline__notch, 
    ::ng-deep .mat-focused .mdc-notched-outline__trailing { border-color: #6366f1 !important; border-width: 2px !important; }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  showPassword = signal(false);
  isLoading = signal(false);
  error = signal('');
  name = '';

  loginAsAdmin() {
    this.email = 'admin@novamarket.com';
    this.password = 'admin123';
    this.handleSubmit();
  }

  handleSubmit() {
    this.isLoading.set(true);
    this.error.set('');

    this.authService.login(this.email, this.password).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.router.navigate(['/tienda']);
        } else {
          this.error.set('Credenciales inválidas');
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Error en el servidor');
        this.isLoading.set(false);
      }
    });
  }
}
