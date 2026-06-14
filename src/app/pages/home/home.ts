
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PetService } from '../../shared/services/pet.service';
import { Pet } from '../../shared/models/pet.model';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {

  petsDestaque: Pet[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private petService: PetService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    timer(0, 10000).pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.petService.getPets())
    ).subscribe({
      next: (pets) => {
        this.petsDestaque = (pets ?? [])
          .filter(p => p.status === 'Disponível')
          .slice(0, 3);
        this.cdr.detectChanges();
      },
      error: () => {
        this.petsDestaque = [];
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getImagem(imagem: string): string {
    if (!imagem) return '';
    if (imagem.startsWith('data:image')) return imagem;
    return `http://assets/${imagem}`;
  }

  trackByPet(_: number, pet: Pet): number {
    return pet.id ?? _;
  }
}
