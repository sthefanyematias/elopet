
import { Component, OnInit, ChangeDetectorRef, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetService } from '../../../shared/services/pet.service';
import { HeaderAdmin } from '../header-admin/header-admin';
import { FooterAdmin } from '../footer-admin/footer-admin';
import { Modal } from '../../../components/modal/modal';

@Component({
  selector: 'app-interesses',
  standalone: true,
  imports: [CommonModule, Modal, HeaderAdmin, FooterAdmin],
  templateUrl: './interesses.html',
  styleUrl: './interesses.css'
})
export class Interesses implements OnInit {

  private petService = inject(PetService);
  private cdr = inject(ChangeDetectorRef);

  interessesAtivos: any[] = [];
  interessesConcedidos: any[] = [];
  carregando = true;
  itemParaExcluir: any = null;
  itemParaAdotar: any = null;
  modalAberto = false;
  modalTitulo = '';
  modalMensagem = '';
  modalTipo: 'sucesso' | 'erro' | 'info' = 'info';

  @HostListener('document:keydown.enter')
  onEnterKey(): void {
    if (this.itemParaAdotar) {
      this.concederAdocao();
    } else if (this.itemParaExcluir) {
      this.excluirInteresse();
    }
  }

  ngOnInit(): void {
    this.carregarInteresses();
  }

  carregarInteresses(): void {
    this.carregando = true;
    this.petService.getInteresses().subscribe({
      next: (dados) => {
        const todos = dados ?? [];
        this.interessesAtivos = todos.filter(i => !i.adotado);
        this.interessesConcedidos = todos.filter(i => !!i.adotado);
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private promoverListaEsperaSeNecessario(): void {
    this.petService.getInteresses().subscribe({
      next: (todos) => {
        const ativos = todos.filter(i => !i.adotado);
        const porPet = new Map<number, any[]>();
        ativos.forEach(i => {
          const lista = porPet.get(i.petId) ?? [];
          lista.push(i);
          porPet.set(i.petId, lista);
        });

        const promessas: Promise<void>[] = [];

        porPet.forEach((interesses) => {
          const temPrincipal = interesses.some(i => !i.listaEspera);
          if (!temPrincipal && interesses.length > 0) {
            const ordenados = [...interesses].sort(
              (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
            );
            const promover = ordenados[0];
            const p = this.petService
              .patchInteresse(promover.id, { listaEspera: false })
              .toPromise()
              .then(() => {});
            promessas.push(p);
          }
        });

        Promise.all(promessas).then(() => this.carregarInteresses());
      }
    });
  }

  formatarData(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }

  confirmarAdocao(item: any): void {
    this.itemParaAdotar = item;
    this.cdr.detectChanges();
  }

  concederAdocao(): void {
    if (!this.itemParaAdotar) return;
    const interesse = this.itemParaAdotar;

    this.petService.getPetById(interesse.petId).subscribe({
      next: (pet) => {
        const petAtualizado = { ...pet, status: 'Adotado', adotanteId: interesse.id };

        this.petService.editarPet(pet.id!, petAtualizado).subscribe({
          next: () => {
            this.petService.patchInteresse(interesse.id, { adotado: true }).subscribe({
              next: () => {
                this.itemParaAdotar = null;
                this.modalTitulo = 'Adoção concedida!';
                this.modalMensagem = `${interesse.nomePet} foi marcado como adotado por ${interesse.nome}.`;
                this.modalTipo = 'sucesso';
                this.modalAberto = true;
                this.carregarInteresses();
                this.cdr.detectChanges();
              }
            });
          },
          error: () => {
            this.itemParaAdotar = null;
            this.modalTitulo = 'Erro';
            this.modalMensagem = 'Não foi possível conceder a adoção.';
            this.modalTipo = 'erro';
            this.modalAberto = true;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.itemParaAdotar = null;
        this.modalTitulo = 'Erro';
        this.modalMensagem = 'Pet não encontrado.';
        this.modalTipo = 'erro';
        this.modalAberto = true;
        this.cdr.detectChanges();
      }
    });
  }

  confirmarExclusao(item: any): void {
    this.itemParaExcluir = item;
    this.cdr.detectChanges();
  }

  excluirInteresse(): void {
    if (!this.itemParaExcluir?.id) return;

    const eraLista = this.itemParaExcluir.listaEspera;

    this.petService.excluirInteresse(this.itemParaExcluir.id).subscribe({
      next: () => {
        this.itemParaExcluir = null;
        this.modalTitulo = 'Removido!';
        this.modalMensagem = 'Interesse removido com sucesso.';
        this.modalTipo = 'sucesso';
        this.modalAberto = true;

        if (!eraLista) {
          this.promoverListaEsperaSeNecessario();
        } else {
          this.carregarInteresses();
        }

        this.cdr.detectChanges();
      },
      error: () => {
        this.itemParaExcluir = null;
        this.modalTitulo = 'Erro';
        this.modalMensagem = 'Erro ao remover interesse.';
        this.modalTipo = 'erro';
        this.modalAberto = true;
        this.cdr.detectChanges();
      }
    });
  }
}
