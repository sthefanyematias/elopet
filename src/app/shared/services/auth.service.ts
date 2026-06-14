import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, timeout, catchError, of } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly API = 'http://localhost:3000/usuarios';
    readonly ADMIN_PRINCIPAL = 'admin@elopet.com';

    constructor(private http: HttpClient) { }

    login(email: string, senha: string): Observable<Usuario | undefined> {
        return this.http.get<Usuario[]>(this.API).pipe(
            timeout(2000),
            map(usuarios => usuarios.find(u => u.email === email && u.senha === senha)),
            catchError(() => of(undefined))
        );
    }

    estaLogado(): boolean {
        return localStorage.getItem('admin_logado') === 'true';
    }

    getEmailLogado(): string {
        return localStorage.getItem('admin_email') ?? '';
    }

    getNomeLogado(): string {
        return localStorage.getItem('admin_nome') || localStorage.getItem('admin_email') || 'Admin';
    }

    getIdLogado(): number {
        return Number(localStorage.getItem('admin_id') ?? 0);
    }

    eAdminPrincipal(): boolean {
        return this.getEmailLogado() === this.ADMIN_PRINCIPAL;
    }

    logout(): void {
        localStorage.removeItem('admin_logado');
        localStorage.removeItem('admin_email');
        localStorage.removeItem('admin_nome');
        localStorage.removeItem('admin_id');
    }

    getUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.API);
    }

    adicionarUsuario(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
        return this.http.post<Usuario>(this.API, usuario);
    }

    excluirUsuario(id: number): Observable<any> {
        return this.http.delete(`${this.API}/${id}`);
    }

    verificarSenhaAdminPrincipal(senha: string): Observable<boolean> {
        return this.http.get<Usuario[]>(this.API).pipe(
            timeout(2000),
            map(usuarios => !!usuarios.find(u => u.email === this.ADMIN_PRINCIPAL && u.senha === senha)),
            catchError(() => of(false))
        );
    }
}