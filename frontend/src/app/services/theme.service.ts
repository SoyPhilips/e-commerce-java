import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  darkMode = signal<boolean>(this.loadTheme());

  constructor() {
    effect(() => {
      const mode = this.darkMode();
      localStorage.setItem('nova_theme', JSON.stringify(mode));
      if (mode) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    });
  }

  private loadTheme(): boolean {
    const saved = localStorage.getItem('nova_theme');
    return saved ? JSON.parse(saved) : false;
  }

  toggleDarkMode() {
    this.darkMode.update(v => !v);
  }
}
