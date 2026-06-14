
import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Pet } from '../../shared/models/pet.model';
import { PetService } from '../../shared/services/pet.service';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { cpfValidator } from '../../shared/validators/cpf.validators';

@Component({
  selector: 'app-detalhes-pet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './detalhes-pet.html',
  styleUrl: './detalhes-pet.css',
})
export class DetalhesPet implements OnInit, OnDestroy {
  pet: Pet | null = null;
  carregando = true;
  erroCarregamento = false;
  petIdAtual: number = 0;
  formAdocao: FormGroup;
  exibirModal = false;
  tituloModal = '';
  msgModal = '';
  tipoModal: 'sucesso' | 'erro' | 'info' = 'sucesso';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.formAdocao = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]*$/)]],
      cpf: ['', [Validators.required, cpfValidator]],
      rg: ['', [Validators.required, Validators.minLength(7)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.minLength(14)]],
      motivo: ['', [Validators.maxLength(300)]]
    });
  }

  @HostListener('document:keydown.enter')
  onEnterKey(): void {
    if (this.exibirModal) {
      this.fecharEVoltar();
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.petIdAtual = id;
        this.iniciarPolling(id);
      } else {
        this.router.navigate(['/vitrine']);
      }
    });
  }

  iniciarPolling(id: number): void {
    timer(0, 10000).pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.petService.getPetById(id))
    ).subscribe({
      next: (res) => {
        if (res) {
          this.pet = res;
          this.erroCarregamento = false;
        } else {
          this.erroCarregamento = true;
        }
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregando = false;
        this.erroCarregamento = true;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  tentarNovamente(): void {
    this.destroy$.next();
    this.iniciarPolling(this.petIdAtual);
  }

  getImagem(imagem: string): string {
    if (!imagem) return '';
    if (imagem.startsWith('data:image')) return imagem;
    return `/assets/${imagem}`;
  }

  private limparMascara(valor: string): string {
    return valor.replace(/\D/g, '');
  }

  enviarInteresse(): void {
    this.formAdocao.markAllAsTouched();
    if (this.formAdocao.invalid) return;

    const { cpf, rg } = this.formAdocao.value;
    const cpfLimpo = this.limparMascara(cpf);
    const rgLimpo = this.limparMascara(rg);

    this.petService.getInteresses().subscribe({
      next: (todos) => {
        const interessesDoPet = todos.filter(
          i => Number(i.petId) === Number(this.petIdAtual)
        );

        const jaExiste = interessesDoPet.some(
          i => this.limparMascara(i.cpf) === cpfLimpo &&
            this.limparMascara(i.rg) === rgLimpo
        );

        if (jaExiste) {
          this.tipoModal = 'info';
          this.tituloModal = 'Interesse já registrado';
          this.msgModal = 'Menção de adoção já cadastrada nesse CPF e RG. Aguarde nosso contato!';
          this.exibirModal = true;
          this.cdr.detectChanges();
          return;
        }

        const emListaEspera = interessesDoPet.length > 0;

        const novoInteresse = {
          ...this.formAdocao.value,
          petId: this.pet?.id,
          nomePet: this.pet?.nome,
          data: new Date().toISOString(),
          listaEspera: emListaEspera
        };

        this.petService.salvarInteresse(novoInteresse).subscribe({
          next: () => {
            if (emListaEspera) {
              this.tipoModal = 'info';
              this.tituloModal = 'Você está na lista de espera!';
              this.msgModal = `O(a) ${this.pet?.nome} já está em trâmite de adoção, mas registramos seu interesse. Você está na lista de espera e entraremos em contato caso a adoção não seja concluída.`;
            } else {
              this.tipoModal = 'sucesso';
              this.tituloModal = 'Sucesso!';
              this.msgModal = `Seu interesse em adotar o(a) ${this.pet?.nome} foi enviado com sucesso! Entraremos em contato em breve.`;
            }
            this.exibirModal = true;
            this.cdr.detectChanges();
          },
          error: () => {
            this.tipoModal = 'erro';
            this.tituloModal = 'Erro';
            this.msgModal = 'Não foi possível enviar sua solicitação.';
            this.exibirModal = true;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.tipoModal = 'erro';
        this.tituloModal = 'Erro';
        this.msgModal = 'Não foi possível verificar os interesses. Tente novamente.';
        this.exibirModal = true;
        this.cdr.detectChanges();
      }
    });
  }

  fecharEVoltar(): void {
    this.exibirModal = false;
    if (this.tipoModal === 'sucesso' || this.tipoModal === 'info') {
      this.router.navigate(['/vitrine']);
    }
  }

  formatarCpf(event: any): void {
    let v = event.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.formAdocao.patchValue({ cpf: v }, { emitEvent: false });
  }

  formatarRg(event: any): void {
    let v = event.target.value.replace(/\D/g, '');
    if (v.length > 10) v = v.slice(0, 10);
    v = v.replace(/(\d{2})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.formAdocao.patchValue({ rg: v }, { emitEvent: false });
  }

  formatarTelefone(event: any): void {
    let v = event.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    this.formAdocao.patchValue({ telefone: v }, { emitEvent: false });
  }

  apenasLetras(event: KeyboardEvent): boolean {
    return /^[a-zA-ZÀ-ÿ\s]$/.test(event.key);
  }

  apenasNumeros(event: KeyboardEvent): boolean {
    return /^[0-9]$/.test(event.key);
  }
}
