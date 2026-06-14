
import { CommonModule } from '@angular/common';
import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef, inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Pet } from '../../shared/models/pet.model';
import { PetService } from '../../shared/services/pet.service';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-vitrine',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './vitrine.html',
  styleUrl: './vitrine.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Vitrine implements OnInit, OnDestroy {

  listaPets: Pet[] = [];
  listaPetsFiltrados: Pet[] = [];
  filtroEspecie = '';
  filtroPorte = '';
  carregando = true;
  private destroy$ = new Subject<void>();

  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private petService = inject(PetService);

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['porte'] !== undefined) this.filtroPorte = params['porte'] || '';
      if (params['especie'] !== undefined) this.filtroEspecie = params['especie'] || '';
      this.filtrar();
      this.cdr.markForCheck();
    });

    timer(0, 10000).pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.petService.getPets())
    ).subscribe({
      next: (dados) => {
        this.listaPets = (dados ?? []).filter(p => p.status === 'Disponível');
        this.filtrar();
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.listaPets = [];
        this.listaPetsFiltrados = [];
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filtrar(): void {
    this.listaPetsFiltrados = this.listaPets.filter(pet =>
      (!this.filtroEspecie || pet.especie === this.filtroEspecie) &&
      (!this.filtroPorte || pet.porte === this.filtroPorte)
    );
    this.cdr.markForCheck();
  }

  limparFiltros(): void {
    this.filtroEspecie = '';
    this.filtroPorte = '';
    this.listaPetsFiltrados = [...this.listaPets];
    this.cdr.markForCheck();
  }

  getImagem(imagem: string): string {
    if (!imagem) return '';
    if (imagem.startsWith('data:image')) return imagem;
    return `/assets/${imagem}`;
  }

  trackByPet(index: number, pet: Pet): number {
    return pet.id ?? index;
  }
}
