
import { Component, OnInit, ChangeDetectorRef, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PetService } from '../../../shared/services/pet.service';
import { Pet } from '../../../shared/models/pet.model';
import { HeaderAdmin } from '../header-admin/header-admin';
import { FooterAdmin } from '../footer-admin/footer-admin';
import { Modal } from '../../../components/modal/modal';

@Component({
  selector: 'app-listar-pet',
  standalone: true,
  imports: [CommonModule, RouterModule, Modal, HeaderAdmin, FooterAdmin],
  templateUrl: './listar-pet.html',
  styleUrl: './listar-pet.css'
})
export class ListarPet implements OnInit {

  private petService = inject(PetService);
  private cdr = inject(ChangeDetectorRef);

  pets: Pet[] = [];
  carregando = true;
  modalAberto = false;
  modalTitulo = '';
  modalMensagem = '';
  modalTipo: 'sucesso' | 'erro' | 'info' = 'info';
  petParaExcluir: Pet | null = null;

  @HostListener('document:keydown.enter')
  onEnterKey(): void {
    if (this.petParaExcluir) {
      this.excluirPet();
    }
  }

  ngOnInit(): void {
    this.carregarPets();
  }

  carregarPets(): void {
    this.carregando = true;
    this.petService.getPets().subscribe({
      next: (dados) => {
        this.pets = dados ?? [];
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregando = false;
        this.abrirModal('Erro ao carregar pets.', 'erro');
      }
    });
  }

  getImagem(imagem: string): string {
    if (!imagem) return '';
    if (imagem.startsWith('data:image')) return imagem;
    return `http://localhost:3000/assets/${imagem}`;
  }

  confirmarExclusao(pet: Pet): void {
    this.petParaExcluir = pet;
    this.cdr.detectChanges();
  }

  excluirPet(): void {
    if (!this.petParaExcluir?.id) return;

    this.petService.excluirPet(this.petParaExcluir.id).subscribe({
      next: () => {
        this.pets = this.pets.filter(p => p.id !== this.petParaExcluir?.id);
        this.petParaExcluir = null;
        this.abrirModal('Pet excluído com sucesso!', 'sucesso');
      },
      error: () => {
        this.petParaExcluir = null;
        this.abrirModal('Erro ao excluir pet.', 'erro');
      }
    });
  }

  abrirModal(msg: string, tipo: 'sucesso' | 'erro' | 'info' = 'info'): void {
    this.modalTitulo = tipo === 'sucesso' ? 'Sucesso!' : tipo === 'erro' ? 'Erro' : 'Atenção';
    this.modalMensagem = msg;
    this.modalTipo = tipo;
    this.modalAberto = true;
    this.cdr.detectChanges();
  }

  fecharModal(): void {
    this.modalAberto = false;
  }
}
