import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { TokenService } from '../../auth/token.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: WebSocket;
  messageSubject = new Subject<String>();
  interval;
  throttledMessages: String[] = [];

  constructor(private tokenService: TokenService) {
  }

  createSocketConnection() {
    const accessToken = this.tokenService.getToken();
    if (accessToken) {
      this.socket = new WebSocket(`${environment.wsBase}/${accessToken}`);
      this.onOpen();
      this.onClose();
      this.onError();
      this.onMessage();
      this.throttleMessages();
    }
  }

  onOpen() {
    this.socket.onopen = () => {
      console.log('socket connection opened!')
    }
  }

  onClose() {
    this.socket.onclose = () => {
      console.log('socket connection closed');
    }
  }

  onError() {
    this.socket.onerror = (err) => {
      console.log('socket connection closed due to err ' + err);
      this.socket.close();
      this.removeInterval();
    }
  }

  onMessage() {
    this.socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg && msg.event) {
        this.addToThrottledMessages(msg.event)
      }

    }
  }

  addToThrottledMessages(msg) {
    const found = this.throttledMessages.find(item => item === msg);
    if (!found) {
      this.throttledMessages.push(msg);
    }
  }

  throttleMessages() {
    this.removeInterval();
    this.interval = setInterval(() => {
      this.heartbeat();
      this.sendAndClearMessages();
    }, 1000);
  }

  heartbeat() {
    const msg = {
      event: 'ping',
    };
    this.socket.send(JSON.stringify(msg));
  }

  sendAndClearMessages() {
    this.throttledMessages.forEach(msg => {
      this.messageSubject.next(msg);
    });
    this.throttledMessages = [];
  }

  removeInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
