
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PetService } from '../../../shared/services/pet.service';
import { Pet } from '../../../shared/models/pet.model';
import { HeaderAdmin } from '../header-admin/header-admin';
import { FooterAdmin } from '../footer-admin/footer-admin';

@Component({
  selector: 'app-editar-pet',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderAdmin, FooterAdmin],
  templateUrl: './editar-pet.html',
  styleUrl: './editar-pet.css'
})
export class EditarPet implements OnInit {

  private petService = inject(PetService);
  private cdr = inject(ChangeDetectorRef);

  pets: Pet[] = [];
  carregando = true;

  ngOnInit(): void {
    this.petService.getPets().subscribe({
      next: (dados) => {
        this.pets = dados ?? [];
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  getImagem(imagem: string): string {
    if (!imagem) return '';
    if (imagem.startsWith('data:image')) return imagem;
    return `http://assets/${imagem}`;
  }
}