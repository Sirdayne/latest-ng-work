import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


export interface CurrentUserI {
  accessToken?: string;
  senderCompID: string;
  senderSubID: string;
  userRole: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpService: HttpClient) { }

  getCurrentUser() {
    return this.httpService.get<CurrentUserI>('/current_user');
  }

  login(body) {
    return this.httpService.post<CurrentUserI>('/login', body);
  }

  resetPassword(body) {
    return this.httpService.post<CurrentUserI>('/login', body);
  }

  logout() {
    return this.httpService.post('/logout', null);
  }
}
