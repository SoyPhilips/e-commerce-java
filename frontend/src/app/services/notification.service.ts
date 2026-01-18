import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  show = signal(false);
  message = signal('');

  showNotification(msg: string) {
    this.message.set(msg);
    this.show.set(true);
    setTimeout(() => {
      this.show.set(false);
    }, 3000);
  }
}
