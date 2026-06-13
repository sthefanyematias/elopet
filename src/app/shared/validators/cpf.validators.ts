
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function cpfValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value?.replace(/\D/g, '') ?? '';

  if (!valor) return null;

  if (valor.length !== 11) return { cpfInvalido: true };

  if (/^(\d)\1{10}$/.test(valor)) return { cpfInvalido: true };

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(valor[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(valor[9])) return { cpfInvalido: true };

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(valor[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(valor[10])) return { cpfInvalido: true };

  return null;
}
