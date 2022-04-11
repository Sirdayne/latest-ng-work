import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


export interface LoginResponseI {
  accessToken: string;
}

export interface CurrentUserI {
  senderCompID: string;
  senderSubID: string;
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
    return this.httpService.post<LoginResponseI>('/login', body);
  }

  logout() {
    return this.httpService.post('/logout', null);
  }
}
