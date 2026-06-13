import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { Modal } from '../../../components/modal/modal';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Modal, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  formLogin: FormGroup;
  exibirModal = false;
  msgModal = '';
  carregando = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  fazerLogin() {
    if (this.formLogin.invalid || this.carregando) return;
    this.carregando = true;
    this.cdr.detectChanges();
    const { email, senha } = this.formLogin.value;
    this.authService.login(email, senha).subscribe({
      next: (usuario) => {
        this.carregando = false;
        if (usuario) {
          localStorage.setItem('admin_logado', 'true');
          localStorage.setItem('admin_email', usuario.email);
          localStorage.setItem('admin_id', String(usuario.id ?? ''));
          localStorage.setItem('admin_nome', usuario.nome ?? usuario.email);
          this.router.navigate(['/admin/home']);
        } else {
          this.msgModal = 'E-mail ou senha incorretos.';
          this.exibirModal = true;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregando = false;
        this.msgModal = 'Erro de conexão com o servidor.';
        this.exibirModal = true;
        this.cdr.detectChanges();
      }
    });
  }
}