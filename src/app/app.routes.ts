
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Home } from './pages/home/home';
import { Vitrine } from './pages/vitrine/vitrine';
import { DetalhesPet } from './pages/detalhes-pet/detalhes-pet';
import { Login } from './pages/admin/login/login';
import { HomeAdmin } from './pages/admin/home/home';
import { ListarPet } from './pages/admin/listar-pet/listar-pet';
import { CadastrarPet } from './pages/admin/cadastrar-pet/cadastrar-pet';
import { EditarPet } from './pages/admin/editar-pet/editar-pet';
import { ExcluirPet } from './pages/admin/excluir-pet/excluir-pet';
import { Interesses } from './pages/admin/interesses/interesses';
import { AnimaisAdotados } from './pages/admin/animais-adotados/animais-adotados';
import { GerenciarAdmins } from './pages/admin/gerenciar-admins/gerenciar-admins';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home, title: 'EloPet – Início' },
    { path: 'vitrine', component: Vitrine, title: 'EloPet – Adoção' },
    { path: 'detalhes-pet/:id', component: DetalhesPet, title: 'EloPet – Detalhes do Pet' },
    { path: 'admin/login', component: Login, title: 'EloPet Admin – Login' },
    { path: 'admin/home', component: HomeAdmin, canActivate: [authGuard], title: 'EloPet Admin – Painel' },
    { path: 'admin/listar', component: ListarPet, canActivate: [authGuard], title: 'EloPet Admin – Pets Cadastrados' },
    { path: 'admin/cadastrar', component: CadastrarPet, canActivate: [authGuard], title: 'EloPet Admin – Cadastrar Pet' },
    { path: 'admin/cadastrar/:id', component: CadastrarPet, canActivate: [authGuard], title: 'EloPet Admin – Editar Pet' },
    { path: 'admin/editar', component: EditarPet, canActivate: [authGuard], title: 'EloPet Admin – Editar Pet' },
    { path: 'admin/excluir', component: ExcluirPet, canActivate: [authGuard], title: 'EloPet Admin – Remover Pet' },
    { path: 'admin/interesses', component: Interesses, canActivate: [authGuard], title: 'EloPet Admin – Interesses de Adoção' },
    { path: 'admin/adotados', component: AnimaisAdotados, canActivate: [authGuard], title: 'EloPet Admin – Animais Adotados' },
    { path: 'admin/gerenciar-admins', component: GerenciarAdmins, canActivate: [authGuard], title: 'EloPet Admin – Gerenciar Admins' },
    { path: 'login', redirectTo: 'admin/login', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' }
];
