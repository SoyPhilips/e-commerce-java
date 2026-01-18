import { ApplicationConfig, provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LucideAngularModule, ShoppingCart, Heart, Sun, Moon, LogOut, User, LayoutDashboard, Search, Trash2, Plus, Minus, ArrowRight, CheckCircle, Package, ShieldCheck, Truck, SearchX, Edit2, Star, ArrowLeft, Mail, Eye, EyeOff } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    importProvidersFrom(
      LucideAngularModule.pick({ 
        ShoppingCart, Heart, Sun, Moon, LogOut, User, 
        LayoutDashboard, Search, Trash2, Plus, Minus, 
        ArrowRight, CheckCircle, Package, ShieldCheck, Truck,
        SearchX, Edit2, Star, ArrowLeft, Mail, Eye, EyeOff
      })
    )
  ]
};
