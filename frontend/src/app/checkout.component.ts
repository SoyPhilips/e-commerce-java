import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { LucideAngularModule } from 'lucide-angular';
import { CartService } from './services/cart.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatIconModule, LucideAngularModule],
  animations: [
    trigger('checkoutEntrance', [
      transition(':enter', [
        query('.checkout-header, .form-side, .summary-side', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('150ms', [
            animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('stepAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0, transform: 'translateX(-20px)' }))
      ])
    ])
  ],
  template: `
    <div class="checkout-container" @checkoutEntrance>
      <div class="checkout-header">
        <h1>Finalizar Compra</h1>
        <div class="steps-indicator">
          <div class="step" [class.active]="step() === 1" [class.completed]="step() > 1">
            <span class="step-num">
              @if (step() > 1) { <lucide-icon name="check-circle" class="icon-xs"></lucide-icon> } @else { 1 }
            </span>
            <span class="step-label">Envío</span>
          </div>
          <div class="step-line"></div>
          <div class="step" [class.active]="step() === 2" [class.completed]="step() > 2">
            <span class="step-num">
              @if (step() > 2) { <lucide-icon name="check-circle" class="icon-xs"></lucide-icon> } @else { 2 }
            </span>
            <span class="step-label">Pago</span>
          </div>
          <div class="step-line"></div>
          <div class="step" [class.active]="step() === 3" [class.completed]="step() > 3">
            <span class="step-num">3</span>
            <span class="step-label">Confirmación</span>
          </div>
        </div>
      </div>

      <div class="checkout-content">
        <div class="form-side">
          @if (step() === 1) {
            <div class="step-content" @stepAnimation>
              <h2>Información de Envío</h2>
              <form (ngSubmit)="nextStep()" #shippingForm="ngForm">
                <div class="form-grid">
                  <mat-form-field appearance="outline" class="full">
                    <mat-label>Nombre Completo</mat-label>
                    <input matInput type="text" [(ngModel)]="shipping.name" name="name" required placeholder="Ej. Juan Pérez">
                    <lucide-icon matPrefix name="user" class="icon-sm"></lucide-icon>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="full">
                    <mat-label>Dirección</mat-label>
                    <input matInput type="text" [(ngModel)]="shipping.address" name="address" required placeholder="Calle, número, depto">
                    <lucide-icon matPrefix name="truck" class="icon-sm"></lucide-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Ciudad</mat-label>
                    <input matInput type="text" [(ngModel)]="shipping.city" name="city" required placeholder="Ciudad">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Código Postal</mat-label>
                    <input matInput type="text" [(ngModel)]="shipping.zip" name="zip" required placeholder="CP">
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full">
                    <mat-label>Teléfono</mat-label>
                    <input matInput type="tel" [(ngModel)]="shipping.phone" name="phone" required placeholder="+54 11 ...">
                  </mat-form-field>
                </div>
                <div class="actions">
                  <button type="button" mat-button routerLink="/tienda">Cancelar</button>
                  <button type="submit" mat-raised-button color="primary" [disabled]="!shippingForm.valid">
                    Siguiente: Pago
                    <lucide-icon name="arrow-right" class="icon-sm"></lucide-icon>
                  </button>
                </div>
              </form>
            </div>
          }

          @if (step() === 2) {
            <div class="step-content" @stepAnimation>
              <h2>Método de Pago</h2>
              <form (ngSubmit)="nextStep()" #paymentForm="ngForm">
                <div class="payment-options">
                  <div class="payment-card" [class.selected]="payment.method === 'card'" (click)="payment.method = 'card'">
                    <lucide-icon name="shield-check" class="icon-md"></lucide-icon>
                    <div class="info">
                      <h4>Tarjeta de Crédito/Débito</h4>
                      <p>Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                  <div class="payment-card" [class.selected]="payment.method === 'transfer'" (click)="payment.method = 'transfer'">
                    <lucide-icon name="truck" class="icon-md"></lucide-icon>
                    <div class="info">
                      <h4>Transferencia Bancaria</h4>
                      <p>CBU / Alias</p>
                    </div>
                  </div>
                </div>

                @if (payment.method === 'card') {
                  <div class="form-grid">
                    <mat-form-field appearance="outline" class="full">
                      <mat-label>Número de Tarjeta</mat-label>
                      <input matInput type="text" [(ngModel)]="payment.cardNumber" name="cardNumber" required placeholder="0000 0000 0000 0000">
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline">
                      <mat-label>Vencimiento</mat-label>
                      <input matInput type="text" [(ngModel)]="payment.expiry" name="expiry" required placeholder="MM/YY">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>CVV</mat-label>
                      <input matInput type="text" [(ngModel)]="payment.cvv" name="cvv" required placeholder="123">
                    </mat-form-field>
                  </div>
                }

                <div class="actions">
                  <button type="button" mat-button (click)="prevStep()">Atrás</button>
                  <button type="submit" mat-raised-button color="primary" [disabled]="payment.method === 'card' && !paymentForm.valid">
                    Finalizar Pedido
                  </button>
                </div>
              </form>
            </div>
          }

          @if (step() === 3) {
            <div class="step-content success-step" @stepAnimation>
              <lucide-icon name="check-circle" class="success-icon"></lucide-icon>
              <h2>¡Pedido Confirmado!</h2>
              <p>Gracias por tu compra, <strong>{{ shipping.name }}</strong>.</p>
              <p>Hemos enviado un correo con los detalles de tu pedido.</p>
              <div class="order-id">Orden #{{ orderId() }}</div>
              <button mat-raised-button color="primary" routerLink="/tienda">Volver a la Tienda</button>
            </div>
          }
        </div>

        <div class="summary-side">
          <div class="summary-card">
            <h3>Resumen del Pedido</h3>
            <div class="summary-items">
              @for (item of cartService.items(); track item.id) {
                <div class="summary-item">
                  <span>{{ item.nombre }} x {{ item.quantity }}</span>
                  <span>{{ item.precio * item.quantity | currency }}</span>
                </div>
              }
            </div>
            <div class="summary-divider"></div>
            <div class="summary-totals">
              <div class="row">
                <span>Subtotal</span>
                <span>{{ cartService.totalPrice() | currency }}</span>
              </div>
              <div class="row">
                <span>Envío</span>
                <span class="free">Gratis</span>
              </div>
              <div class="row total">
                <span>Total</span>
                <span>{{ cartService.totalPrice() | currency }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container { max-width: 1000px; margin: 40px auto; padding: 0 20px; }
    
    .checkout-header { text-align: center; margin-bottom: 40px; }
    .checkout-header h1 { font-size: 2.2rem; font-weight: 800; margin-bottom: 32px; color: #1e293b; }

    .steps-indicator { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 20px; }
    .step { display: flex; flex-direction: column; align-items: center; gap: 8px; opacity: 0.4; transition: all 0.3s; }
    .step.active { opacity: 1; }
    .step.completed { opacity: 1; color: #10b981; }
    
    .step-num { width: 36px; height: 36px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; color: #64748b; }
    .step.active .step-num { background: #6366f1; color: white; box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3); }
    .step.completed .step-num { background: #10b981; color: white; }
    .step-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: inherit; }
    
    .step-line { height: 2px; width: 60px; background: #e2e8f0; margin-bottom: 24px; border-radius: 2px; }

    .checkout-content { display: grid; grid-template-columns: 1fr 360px; gap: 40px; }
    
    .step-content { background: white; padding: 32px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
    .step-content h2 { margin: 0 0 28px; font-size: 1.5rem; font-weight: 700; color: #1e293b; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .full { grid-column: span 2; }

    .actions { display: flex; justify-content: flex-end; gap: 16px; margin-top: 32px; }
    
    .payment-options { display: flex; flex-direction: column; gap: 16px; margin-bottom: 28px; }
    .payment-card { 
      display: flex; align-items: center; gap: 16px; padding: 20px; 
      border: 2px solid #e2e8f0; border-radius: 20px; cursor: pointer; 
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      background: white;
    }
    .payment-card:hover { border-color: #6366f1; background: #f5f3ff; }
    .payment-card.selected { border-color: #6366f1; background: #f5f3ff; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1); }
    .payment-card h4 { margin: 0; font-size: 1.05rem; font-weight: 700; color: #1e293b; }
    .payment-card p { margin: 4px 0 0; font-size: 0.85rem; color: #64748b; }
    .icon-md { width: 32px; height: 32px; color: #6366f1; }

    .success-step { text-align: center; padding: 60px 32px; }
    .success-icon { width: 80px; height: 80px; color: #10b981; margin: 0 auto 24px; }
    .order-id { font-size: 1.25rem; background: #f8fafc; padding: 12px 24px; border-radius: 12px; margin: 24px auto; color: #6366f1; font-weight: 800; width: fit-content; border: 1px dashed #6366f1; }

    .summary-card { background: white; padding: 28px; border-radius: 24px; border: 1px solid #e2e8f0; position: sticky; top: 100px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
    .summary-card h3 { margin: 0 0 24px; font-size: 1.25rem; font-weight: 700; color: #1e293b; }
    .summary-items { display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; }
    .summary-item { display: flex; justify-content: space-between; font-size: 0.95rem; color: #475569; font-weight: 500; }
    .summary-divider { height: 1px; background: #e2e8f0; margin-bottom: 24px; }
    .summary-totals { display: flex; flex-direction: column; gap: 12px; }
    .row { display: flex; justify-content: space-between; font-weight: 600; color: #1e293b; }
    .row.total { font-size: 1.4rem; font-weight: 800; color: #6366f1; margin-top: 12px; }
    .free { color: #10b981; font-weight: 700; }

    .icon-sm { width: 20px; height: 20px; }
    .icon-xs { width: 16px; height: 16px; }

    @media (max-width: 850px) {
      .checkout-content { grid-template-columns: 1fr; }
      .summary-side { order: -1; }
    }
  `]
})
export class CheckoutComponent {
  public cartService = inject(CartService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  step = signal(1);
  orderId = signal('');

  shipping = {
    name: '',
    address: '',
    city: '',
    zip: '',
    phone: ''
  };

  payment = {
    method: 'card',
    cardNumber: '',
    expiry: '',
    cvv: ''
  };

  nextStep() {
    if (this.step() === 2) {
      this.finishOrder();
    } else {
      this.step.update(s => s + 1);
      window.scrollTo(0, 0);
    }
  }

  prevStep() {
    this.step.update(s => s - 1);
    window.scrollTo(0, 0);
  }

  finishOrder() {
    // Simular creación de orden
    this.orderId.set('NV-' + Math.random().toString(36).substr(2, 9).toUpperCase());
    this.step.set(3);
    this.cartService.clearCart();
    this.notificationService.showNotification('¡Pedido realizado con éxito!');
  }
}
