import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Console } from 'node:console';

const jwtDecode = require('jwt-decode');

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivateChild {
  constructor (private auth: AuthService, private router: Router) {
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // 1. Comprobar q existe sesion
    if (this.auth.getSession() !== null) {
        console.log('Estamos logueados');
        const dataDecode = this.decodeToken();
        console.log(dataDecode);
        // 2. Comprobar q no esta caducado el token
        if (dataDecode.exp < new Date().getTime() / 1000) {
            console.log('Sesion caducada');
            this.redirect();
        }
        // 3. El rol de usuario es ADMIN
        if (dataDecode.user.role === 'ADMIN') {
          console.log('Somos administradores');
          return true;
        }
        console.log('No somos administradores');
    }
    console.log('Sesion no iniciada');
    this.redirect();
  }

  redirect() {
    this.router.navigate(['/login']);
    return false;
  }

  decodeToken() {
    return jwtDecode(this.auth.getSession().token);
  }
  
}
