import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  TOKEN_LOCAL_STORAGE = 'wt_access_token';

  constructor() { }

  setToken(token) {
    localStorage.setItem(this.TOKEN_LOCAL_STORAGE, token)
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_LOCAL_STORAGE);
  }

  removeToken() {
    localStorage.removeItem(this.TOKEN_LOCAL_STORAGE);
  }
}
