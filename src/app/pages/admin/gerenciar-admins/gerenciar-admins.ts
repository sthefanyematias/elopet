import { Component, OnInit, ChangeDetectorRef, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../shared/services/auth.service';
import { Usuario } from '../../../shared/models/usuario.model';
import { HeaderAdmin } from '../header-admin/header-admin';
import { FooterAdmin } from '../footer-admin/footer-admin';
import { Modal } from '../../../components/modal/modal';

@Component({
  selector: 'app-gerenciar-admins',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatTableModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    HeaderAdmin, FooterAdmin, Modal],
  templateUrl: './gerenciar-admins.html',
  styleUrl: './gerenciar-admins.css'
})
export class GerenciarAdmins implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  readonly ADMIN_PRINCIPAL = 'admin@elopet.com';
  usuarios: Usuario[] = [];
  colunas: string[] = ['id', 'email', 'acoes'];
  carregando = true;
  salvando = false;
  ocultarSenha = true;
  emailLogado = '';

  modalAberto = false;
  modalTitulo = '';
  modalMensagem = '';
  modalTipo: 'sucesso' | 'erro' | 'info' = 'sucesso';

  modalVerificacaoAberto = false;
  usuarioParaExcluir: Usuario | null = null;
  senhaConfirmacao = '';
  senhaErrada = false;
  verificandoSenha = false;

  formAdmin = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]]
  });

  @HostListener('document:keydown.enter')
  onEnterKey(): void {
    if (this.modalVerificacaoAberto) this.confirmarExclusaoComSenha();
  }

  ngOnInit(): void {
    this.emailLogado = this.authService.getEmailLogado();
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.carregando = true;
    this.authService.getUsuarios().subscribe({
      next: (dados) => { this.usuarios = dados ?? []; this.carregando = false; this.cdr.detectChanges(); },
      error: () => { this.carregando = false; this.cdr.detectChanges(); }
    });
  }

  adicionarAdmin(): void {
    this.formAdmin.markAllAsTouched();
    if (this.formAdmin.invalid) return;
    const emailDigitado = this.formAdmin.value.email!.toLowerCase().trim();
    if (this.usuarios.some(u => u.email.toLowerCase() === emailDigitado)) {
      this.abrirModal('Este e-mail já está cadastrado como administrador.', 'info');
      return;
    }
    this.salvando = true;
    this.cdr.detectChanges();
    this.authService.adicionarUsuario({
      nome: this.formAdmin.value.nome!,
      email: emailDigitado,
      senha: this.formAdmin.value.senha!
    }).subscribe({
      next: () => { this.salvando = false; this.formAdmin.reset(); this.abrirModal('Administrador adicionado com sucesso!', 'sucesso'); this.carregarUsuarios(); this.cdr.detectChanges(); },
      error: () => { this.salvando = false; this.abrirModal('Erro ao adicionar administrador.', 'erro'); this.cdr.detectChanges(); }
    });
  }

  solicitarExclusao(usuario: Usuario): void {
    if (usuario.email === this.ADMIN_PRINCIPAL) {
      this.abrirModal('O administrador principal não pode ser removido.', 'erro'); return;
    }
    if (usuario.email === this.emailLogado) {
      this.abrirModal('Você não pode excluir sua própria conta.', 'erro'); return;
    }
    this.usuarioParaExcluir = usuario;
    this.senhaConfirmacao = '';
    this.senhaErrada = false;
    this.modalVerificacaoAberto = true;
    this.cdr.detectChanges();
  }

  confirmarExclusaoComSenha(): void {
    if (this.verificandoSenha) return;

    if (!this.senhaConfirmacao.trim()) {
      this.senhaErrada = true;
      return;
    }

    this.verificandoSenha = true;
    this.senhaErrada = false;
    this.cdr.detectChanges();

    this.authService.verificarSenhaAdminPrincipal(this.senhaConfirmacao).subscribe({
      next: (ok) => {
        this.verificandoSenha = false;

        if (ok) {
          this.executarExclusao();
        } else {
          this.senhaErrada = true;
          this.senhaConfirmacao = '';
        }

        this.cdr.detectChanges();
      },

      error: () => {
        this.verificandoSenha = false;
        this.cancelarExclusao();
        this.abrirModal('Erro ao verificar senha.', 'erro');
        this.cdr.detectChanges();
      }
    });
  }

  private executarExclusao(): void {
    if (!this.usuarioParaExcluir?.id) return;
    this.authService.excluirUsuario(this.usuarioParaExcluir.id).subscribe({
      next: () => { this.modalVerificacaoAberto = false; this.usuarioParaExcluir = null; this.abrirModal('Administrador removido com sucesso.', 'sucesso'); this.carregarUsuarios(); this.cdr.detectChanges(); },
      error: () => { this.modalVerificacaoAberto = false; this.abrirModal('Erro ao remover administrador.', 'erro'); this.cdr.detectChanges(); }
    });
  }

  cancelarExclusao(): void {
    this.modalVerificacaoAberto = false;
    this.usuarioParaExcluir = null;
    this.senhaConfirmacao = '';
    this.senhaErrada = false;
  }

  abrirModal(msg: string, tipo: 'sucesso' | 'erro' | 'info'): void {
    this.modalTitulo = tipo === 'sucesso' ? 'Sucesso!' : tipo === 'erro' ? 'Erro' : 'Atenção';
    this.modalMensagem = msg;
    this.modalTipo = tipo;
    this.modalAberto = true;
    this.cdr.detectChanges();
  }
}