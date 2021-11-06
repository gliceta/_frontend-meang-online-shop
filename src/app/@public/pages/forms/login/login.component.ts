import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ILoginForm, IResultLogin } from '@core/interfaces/login.interface';
import { IMeData } from '@core/interfaces/session.interface';
import { AuthService } from '@core/services/auth.service';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  login: ILoginForm = {
    email: '',
    password: ''
  };

  constructor(private auth: AuthService, private router: Router) { }

  init() {
    console.log(this.login);
    this.auth.login(this.login.email, this.login.password).subscribe(
      (result: IResultLogin) => {
        console.log(result);
        if (result.status) {
            if (result.token !== null) {
                console.log('Inicio de sesion correcto');
                // Guardamos la sesion
                basicAlert(TYPE_ALERT.SUCCESS, result.message);
                this.auth.setSession(result.token);
                this.auth.updateSession(result);
                this.router.navigate(['/home']);
                return;
            }
            basicAlert(TYPE_ALERT.ERROR, result.message);
            return;
        }
        basicAlert(TYPE_ALERT.INFO, result.message);
        console.log('Inicio de sesion no correcto');
      }
    );
  }

}
