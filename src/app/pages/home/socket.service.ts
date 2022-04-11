import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject, Subscription } from 'rxjs';
import { TokenService } from '../../auth/token.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: WebSocket;
  messageSubject = new Subject<String>();
  interval;

  constructor(private tokenService: TokenService,
              private httpService: HttpClient,
              private router: Router) {
  }

  createSocketConnection() {
    const accessToken = this.tokenService.getToken();
    if (accessToken) {
      this.socket = new WebSocket(`${environment.wsBase}/${accessToken}`);
      this.heartbeat();
      this.onOpen();
      this.onMessage();
      this.onClose();
      this.onError();
    }
  }

  heartbeat() {
    this.clearInterval();
    this.interval = setInterval(() => {
      const msg = {
        event: 'ping',
      };
      this.socket.send(JSON.stringify(msg));
    }, 10000);
  }

  onOpen() {
    this.socket.onopen = () => {
      console.log('socket connection opened!')
    }
  }

  onMessage() {
    this.socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      this.messageSubject.next(msg.event);
    }
  }

  onClose() {
    this.socket.onclose = () => {
      console.log('socket connection closed');
      this.createSocketConnection();
    }
  }

  onError() {
    this.socket.onerror = (err) => {
      console.log('socket connection closed due to err ' + err);
      this.socket.close();
      this.clearInterval();
    }
  }

  clearInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
