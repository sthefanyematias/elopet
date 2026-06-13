
import { Component, OnInit, ChangeDetectorRef, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetService } from '../../../shared/services/pet.service';
import { HeaderAdmin } from '../header-admin/header-admin';
import { FooterAdmin } from '../footer-admin/footer-admin';

@Component({
  selector: 'app-animais-adotados',
  standalone: true,
  imports: [CommonModule, HeaderAdmin, FooterAdmin],
  templateUrl: './animais-adotados.html',
  styleUrl: './animais-adotados.css'
})
export class AnimaisAdotados implements OnInit {

  private petService = inject(PetService);
  private cdr = inject(ChangeDetectorRef);

  adotados: { pet: any; interesse: any }[] = [];
  carregando = true;
  itemParaDesfazer: any = null;
  modalAberto = false;
  modalTitulo = '';
  modalMensagem = '';
  modalTipo: 'sucesso' | 'erro' | 'info' = 'info';

  @HostListener('document:keydown.enter')
  onEnterKey(): void {
    if (this.itemParaDesfazer) {
      this.desfazerAdocao();
    } else if (this.modalAberto) {
      this.modalAberto = false;
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    this.carregarAdotados();
  }

  carregarAdotados(): void {
    this.carregando = true;

    Promise.all([
      this.petService.getPets().toPromise(),
      this.petService.getInteresses().toPromise()
    ]).then(([pets, interesses]) => {
      const petsAdotados = (pets ?? []).filter(p => p.status === 'Adotado');

      this.adotados = petsAdotados.map(pet => {
        const interessesPet = (interesses ?? []).filter(i => i.petId === pet.id);
        const adotante = pet.adotanteId
          ? interessesPet.find(i => i.id === pet.adotanteId) ?? interessesPet[0]
          : interessesPet[0] ?? null;
        return { pet, interesse: adotante };
      });

      this.carregando = false;
      this.cdr.detectChanges();
    }).catch(() => {
      this.carregando = false;
      this.cdr.detectChanges();
    });
  }

  getImagem(imagem: string): string {
    if (!imagem) return '';
    if (imagem.startsWith('data:image')) return imagem;
    return `http://localhost:3000/assets/${imagem}`;
  }

  formatarData(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }

  confirmarDesfazer(item: any): void {
    this.itemParaDesfazer = item;
    this.cdr.detectChanges();
  }

  desfazerAdocao(): void {
    if (!this.itemParaDesfazer) return;
    const { pet } = this.itemParaDesfazer;

    const petAtualizado = { ...pet, status: 'Disponível', adotanteId: null };

    this.petService.editarPet(pet.id, petAtualizado).subscribe({
      next: () => {
        this.itemParaDesfazer = null;
        this.modalTitulo = 'Adoção desfeita';
        this.modalMensagem = `${pet.nome} voltou a ficar disponível para adoção.`;
        this.modalTipo = 'info';
        this.modalAberto = true;
        this.carregarAdotados();
        this.cdr.detectChanges();
      },
      error: () => {
        this.itemParaDesfazer = null;
        this.modalTitulo = 'Erro';
        this.modalMensagem = 'Não foi possível desfazer a adoção.';
        this.modalTipo = 'erro';
        this.modalAberto = true;
        this.cdr.detectChanges();
      }
    });
  }
}
