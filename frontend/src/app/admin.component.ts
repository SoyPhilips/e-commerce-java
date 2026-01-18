import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService } from './services/product.service';
import { NotificationService } from './services/notification.service';
import { Producto } from './models/producto.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule, MatInputModule, MatSelectModule, MatFormFieldModule, LucideAngularModule],
  animations: [
    trigger('adminEntrance', [
      transition(':enter', [
        query('.stat-card, .chart-card, .table-container', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('rowEntrance', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        query('.modal', [
          style({ transform: 'scale(0.9) translateY(20px)', opacity: 0 }),
          animate('300ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'scale(1) translateY(0)', opacity: 1 }))
        ])
      ]),
      transition(':leave', [
        query('.modal', [
          animate('200ms ease-in', style({ transform: 'scale(0.9) translateY(20px)', opacity: 0 }))
        ]),
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="admin-container" @adminEntrance>
      <div class="admin-header">
        <h1>Panel de Administración</h1>
        <button mat-raised-button color="primary" (click)="openModal()">
          <lucide-icon name="plus" class="icon-sm"></lucide-icon>
          Nuevo Producto
        </button>
      </div>

      <!-- Dashboard Stats -->
      <div class="dashboard-grid">
        <div class="stat-card">
          <lucide-icon name="package" class="stat-icon"></lucide-icon>
          <div class="stat-info">
            <span class="stat-label">Total Productos</span>
            <span class="stat-value">{{ products().length }}</span>
          </div>
        </div>
        <div class="stat-card">
          <lucide-icon name="shopping-cart" class="stat-icon"></lucide-icon>
          <div class="stat-info">
            <span class="stat-label">Valor de Inventario</span>
            <span class="stat-value">{{ inventoryValue() | currency }}</span>
          </div>
        </div>
        <div class="stat-card" [class.warning]="lowStockCount() > 0">
          <lucide-icon name="shield-check" class="stat-icon"></lucide-icon>
          <div class="stat-info">
            <span class="stat-label">Stock Bajo</span>
            <span class="stat-value">{{ lowStockCount() }}</span>
          </div>
        </div>
        <div class="stat-card">
          <lucide-icon name="user" class="stat-icon"></lucide-icon>
          <div class="stat-info">
            <span class="stat-label">Ventas Hoy (Simulado)</span>
            <span class="stat-value">{{ 12 | currency }}</span>
          </div>
        </div>
      </div>

      <div class="dashboard-charts">
        <div class="chart-card">
          <h3>Ventas Semanales</h3>
          <div class="bar-chart">
            @for (sale of weeklySales(); track sale.day) {
              <div class="bar-container">
                <div class="bar" [style.height.%]="sale.amount" [title]="sale.day + ': $' + sale.amount"></div>
                <span class="bar-label">{{ sale.day }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (product of products(); track product.id) {
              <tr @rowEntrance>
                <td>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <img [src]="product.imagenUrl" class="thumb">
                    <span>{{ product.nombre }}</span>
                  </div>
                </td>
                <td>{{ product.categoria }}</td>
                <td>{{ product.precio | currency }}</td>
                <td>
                  <span [class.warning]="product.stock < 10">{{ product.stock }}</span>
                </td>
                <td>
                  <div class="actions">
                    <button mat-icon-button color="primary" (click)="openModal(product)">
                      <lucide-icon name="edit-2" class="icon-sm"></lucide-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteProduct(product.id)">
                      <lucide-icon name="trash-2" class="icon-sm"></lucide-icon>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Modal para Crear/Editar -->
      @if (isModalOpen()) {
        <div class="modal-overlay" @modalAnimation>
          <div class="modal">
            <h2>{{ editingProduct() ? 'Editar' : 'Nuevo' }} Producto</h2>
            <form (submit)="saveProduct($event)">
              <div style="display: flex; flex-direction: column; gap: 16px;">
                <mat-form-field appearance="outline" style="width: 100%;">
                  <mat-label>Nombre</mat-label>
                  <input matInput name="nombre" [(ngModel)]="formModel.nombre" required>
                </mat-form-field>

                <mat-form-field appearance="outline" style="width: 100%;">
                  <mat-label>Descripción</mat-label>
                  <textarea matInput name="descripcion" [(ngModel)]="formModel.descripcion" required></textarea>
                </mat-form-field>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                  <mat-form-field appearance="outline">
                    <mat-label>Precio</mat-label>
                    <input matInput name="precio" type="number" [(ngModel)]="formModel.precio" required>
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Stock</mat-label>
                    <input matInput name="stock" type="number" [(ngModel)]="formModel.stock" required>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" style="width: 100%;">
                  <mat-label>URL de Imagen</mat-label>
                  <input matInput name="imagenUrl" [(ngModel)]="formModel.imagenUrl" required>
                </mat-form-field>

                <mat-form-field appearance="outline" style="width: 100%;">
                  <mat-label>Categoría</mat-label>
                  <mat-select name="categoria" [(ngModel)]="formModel.categoria" required>
                    <mat-option value="Electrónica">Electrónica</mat-option>
                    <mat-option value="Hogar">Hogar</mat-option>
                    <mat-option value="Moda">Moda</mat-option>
                    <mat-option value="Deportes">Deportes</mat-option>
                    <mat-option value="Accesorios">Accesorios</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="modal-actions">
                <button type="button" mat-button (click)="closeModal()">Cancelar</button>
                <button type="submit" mat-raised-button color="primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-container { padding: 40px 20px; max-width: 1200px; margin: 0 auto; }
    .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
    .admin-header h1 { font-size: 2.2rem; font-weight: 800; color: #1e293b; margin: 0; }
    
    /* Dashboard Stats */
    .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 32px; }
    .stat-card { background: white; padding: 24px; border-radius: 24px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
    .stat-card.warning { border-left: 4px solid #ef4444; }
    .stat-icon { background: #f8fafc; width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #6366f1; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-label { font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-value { font-size: 1.5rem; font-weight: 800; color: #1e293b; }

    /* Charts */
    .dashboard-charts { margin-bottom: 32px; }
    .chart-card { background: white; padding: 28px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
    .chart-card h3 { margin: 0 0 28px; font-size: 1.1rem; font-weight: 700; color: #1e293b; }
    .bar-chart { display: flex; align-items: flex-end; justify-content: space-around; height: 180px; padding-top: 20px; }
    .bar-container { display: flex; flex-direction: column; align-items: center; gap: 12px; flex: 1; }
    .bar { width: 36px; background: #6366f1; border-radius: 8px 8px 4px 4px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; min-height: 4px; }
    .bar:hover { background: #4f46e5; transform: scaleY(1.05); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
    .bar-label { font-size: 0.75rem; color: #64748b; font-weight: 700; }
    
    .table-container { background: white; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); overflow: hidden; border: 1px solid #e2e8f0; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8fafc; text-align: left; padding: 20px; color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #e2e8f0; }
    td { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; color: #475569; font-weight: 500; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #f8fafc; }
    
    .thumb { width: 48px; height: 48px; object-fit: cover; border-radius: 12px; border: 1px solid #e2e8f0; }
    
    .actions { display: flex; gap: 4px; }
    .warning { color: #ef4444; font-weight: 700; }

    /* Modal Styles */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10000; }
    .modal { background: white; padding: 40px; border-radius: 32px; width: 550px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); max-height: 90vh; overflow-y: auto; }
    .modal h2 { margin-top: 0; font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 32px; }
    
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; }
    
    .icon-sm { width: 18px; height: 18px; }

    @media (max-width: 600px) {
      .modal { width: 95%; padding: 24px; }
      .admin-header h1 { font-size: 1.5rem; }
    }
  `]
})
export class AdminComponent implements OnInit {
  private productService = inject(ProductService);
  private notificationService = inject(NotificationService);

  products = signal<Producto[]>([]);
  isModalOpen = signal(false);
  editingProduct = signal<Producto | null>(null);

  // Stats computed
  inventoryValue = computed(() => 
    this.products().reduce((acc, p) => acc + (p.precio * p.stock), 0)
  );

  lowStockCount = computed(() => 
    this.products().filter(p => p.stock < 10).length
  );

  weeklySales = signal([
    { day: 'Lun', amount: 45 },
    { day: 'Mar', amount: 70 },
    { day: 'Mié', amount: 30 },
    { day: 'Jue', amount: 85 },
    { day: 'Vie', amount: 60 },
    { day: 'Sáb', amount: 95 },
    { day: 'Dom', amount: 50 },
  ]);

  formModel: any = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagenUrl: '',
    categoria: ''
  };

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data: Producto[]) => this.products.set(data));
  }

  openModal(product?: Producto) {
    if (product) {
      this.editingProduct.set(product);
      this.formModel = { ...product };
    } else {
      this.editingProduct.set(null);
      this.formModel = { nombre: '', descripcion: '', precio: 0, stock: 0, imagenUrl: '', categoria: '' };
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  saveProduct(event: Event) {
    event.preventDefault();
    const operation = this.editingProduct() 
      ? this.productService.updateProduct(this.editingProduct()!.id, this.formModel)
      : this.productService.createProduct(this.formModel);

    operation.subscribe({
      next: () => {
        this.loadProducts();
        this.closeModal();
        this.notificationService.showNotification(
          this.editingProduct() ? 'Producto actualizado' : 'Producto creado con éxito'
        );
      },
      error: (err) => console.error('Error guardando producto:', err)
    });
  }

  deleteProduct(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
          this.notificationService.showNotification('Producto eliminado');
        },
        error: (err) => console.error('Error eliminando producto:', err)
      });
    }
  }
}
