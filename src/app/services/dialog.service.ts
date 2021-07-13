import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor() {}

  displaySuccess(successMessage: string = 'Todo correcto!') {
    Swal.fire({
      title: '¡Todo correcto!',
      text: successMessage,
      icon: 'success',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
    });
  }

  displayError(
    errorMessage: string = 'Ha sucedido un error, lamentamos las molestias'
  ) {
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
    });
  }
}
