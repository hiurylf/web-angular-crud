import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AbstractControl, ValidatorFn} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private scnackBar: MatSnackBar) {
  }

  /**
   * Shows a simple message to the yser
   */
  showMessage(msg: string, action: string = 'X'): void {
    this.scnackBar.open(msg, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  /**
   * validates the user's CPF
   */
  cpfValidatetoForms(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value: string = control.value;
      return this.cpfValidate(value) ? null : {invalid: true};
    };
  }

  cpfValidate(cpf: string): boolean {
    cpf.replace(/[^\d]+/g, '');

    if (!cpf || cpf.length !== 11) {
      return false;
    }

    if (cpf === '00000000000' || cpf === '11111111111' || cpf === '22222222222' ||
      cpf === '33333333333' || cpf === '44444444444' || cpf === '55555555555' ||
      cpf === '66666666666' || cpf === '77777777777' || cpf === '88888888888' ||
      cpf === '99999999999') {
      return false;
    }

    let Soma = 0;
    let Resto;

    for (let i = 1; i <= 9; i++) {
      Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11)) {
      Resto = 0;
    }
    if (Resto !== parseInt(cpf.substring(9, 10))) {
      return false;
    }

    Soma = 0;
    for (let i = 1; i <= 10; i++) {
      Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11)) {
      Resto = 0;
    }
    return Resto === parseInt(cpf.substring(10, 11));
  }


}

