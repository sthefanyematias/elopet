import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-admin.html',
  styleUrl: './header-admin.css',
})
export class HeaderAdmin implements OnInit {
  dropdownAberto = false;
  nomeAdmin = '';
  eAdminPrincipal = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.nomeAdmin = this.authService.getNomeLogado();
    this.eAdminPrincipal = this.authService.eAdminPrincipal();
  }

  isPetsRoute(): boolean {
    const url = this.router.url;
    return ['/admin/listar', '/admin/cadastrar', '/admin/editar', '/admin/excluir'].some(r => url.startsWith(r));
  }

  sair() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}