
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService } from '../../../shared/services/pet.service';
import { Modal } from '../../../components/modal/modal';
import { HeaderAdmin } from '../header-admin/header-admin';
import { FooterAdmin } from '../footer-admin/footer-admin';
import { Location, CommonModule } from '@angular/common';
import { Pet } from '../../../shared/models/pet.model';

@Component({
  selector: 'app-cadastrar-pet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Modal, HeaderAdmin, FooterAdmin],
  templateUrl: './cadastrar-pet.html',
  styleUrl: './cadastrar-pet.css',
})
export class CadastrarPet implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private petService = inject(PetService);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);

  modalAberto = false;
  mensagemModal = '';
  modalTitulo = '';
  modalTipo: 'sucesso' | 'erro' | 'info' = 'info';
  salvouComSucesso = false;
  salvando = false;
  idPet: number | null = null;
  arquivoSelecionado: File | null = null;
  interessesDoPet: any[] = [];
  adotanteSelecionado: any = null;
  adotanteIdSelecionado: number | null = null;

  formPet = this.fb.group({
    nome: ['', [Validators.required]],
    especie: ['', [Validators.required]],
    sexo: ['', [Validators.required]],
    idade: [null as number | null, [Validators.required, Validators.min(0)]],
    unidadeIdade: ['anos', [Validators.required]],
    porte: ['', [Validators.required]],
    status: ['Disponível', [Validators.required]],
    imagem: [''],
    descricao: ['', [Validators.required]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idPet = Number(id);
      this.carregarPet(this.idPet);
      this.carregarInteressesDoPet(this.idPet);
    }
  }

  carregarPet(id: number): void {
    this.petService.getPetById(id).subscribe({
      next: (pet) => {
        this.formPet.patchValue({
          ...pet,
          unidadeIdade: (pet as any).unidadeIdade || 'anos'
        });
        this.cdr.detectChanges();
      },
      error: () => this.abrirModal('Erro ao carregar pet.', 'erro')
    });
  }

  carregarInteressesDoPet(petId: number): void {
    this.petService.getInteresses().subscribe({
      next: (todos) => {
        this.interessesDoPet = todos.filter(i => Number(i.petId) === Number(petId));
        this.cdr.detectChanges();
      }
    });
  }

  aoAlterarStatus(): void {
    const status = this.formPet.get('status')?.value;
    if (status !== 'Adotado') {
      this.adotanteSelecionado = null;
      this.adotanteIdSelecionado = null;
    }
    this.cdr.detectChanges();
  }

  selecionarAdotanteCard(interessado: any): void {
    if (this.adotanteIdSelecionado === interessado.id) {
      this.adotanteIdSelecionado = null;
      this.adotanteSelecionado = null;
    } else {
      this.adotanteIdSelecionado = interessado.id;
      this.adotanteSelecionado = interessado;
    }
    this.cdr.detectChanges();
  }

  aoSelecionarArquivo(event: any): void {
    const file = event.target.files[0];
    if (file) this.arquivoSelecionado = file;
  }

  salvar(): void {
    if (this.formPet.invalid) {
      this.abrirModal('Preencha todos os campos obrigatórios.', 'erro');
      return;
    }

    this.salvando = true;
    this.cdr.detectChanges();

    if (this.arquivoSelecionado) {
      this.petService.uploadImagem(this.arquivoSelecionado).subscribe({
        next: (res) => {
          this.formPet.patchValue({ imagem: res.filename });
          this.persistirPet();
        },
        error: () => {
          this.salvando = false;
          this.abrirModal('Erro ao fazer upload da imagem.', 'erro');
          this.cdr.detectChanges();
        }
      });
    } else {
      this.persistirPet();
    }
  }

  private persistirPet(): void {
    const petBase: any = {
      nome: this.formPet.value.nome ?? '',
      especie: this.formPet.value.especie ?? '',
      sexo: this.formPet.value.sexo ?? '',
      idade: Number(this.formPet.value.idade) || 0,
      unidadeIdade: this.formPet.value.unidadeIdade ?? 'anos',
      porte: this.formPet.value.porte ?? '',
      status: this.formPet.value.status ?? 'Disponível',
      imagem: this.formPet.value.imagem ?? '',
      descricao: this.formPet.value.descricao ?? '',
    };

    if (this.formPet.value.status === 'Adotado' && this.adotanteIdSelecionado) {
      petBase.adotanteId = this.adotanteIdSelecionado;
    } else {
      petBase.adotanteId = null;
    }

    if (this.idPet) {
      const pet: Pet = { ...petBase, id: this.idPet };
      this.petService.editarPet(this.idPet, pet).subscribe({
        next: () => {
          if (this.adotanteIdSelecionado && this.formPet.value.status === 'Adotado') {
            this.petService.patchInteresse(this.adotanteIdSelecionado, { adotado: true }).subscribe();
          }
          this.salvando = false;
          this.salvouComSucesso = true;
          this.abrirModal('Pet editado com sucesso!', 'sucesso');
          this.cdr.detectChanges();
        },
        error: () => {
          this.salvando = false;
          this.abrirModal('Erro ao editar pet.', 'erro');
          this.cdr.detectChanges();
        }
      });
    } else {
      this.petService.salvarPet(petBase).subscribe({
        next: () => {
          this.salvando = false;
          this.salvouComSucesso = true;
          this.formPet.reset({ status: 'Disponível', unidadeIdade: 'anos' });
          this.arquivoSelecionado = null;
          this.abrirModal('Pet cadastrado com sucesso!', 'sucesso');
          this.cdr.detectChanges();
        },
        error: () => {
          this.salvando = false;
          this.abrirModal('Erro ao salvar pet.', 'erro');
          this.cdr.detectChanges();
        }
      });
    }
  }

  apenasLetras(event: KeyboardEvent): boolean {
    return /^[a-zA-ZÀ-ÿ\s]$/.test(event.key);
  }

  apenasNumeros(event: KeyboardEvent): boolean {
    return /^[0-9]$/.test(event.key);
  }

  abrirModal(msg: string, tipo: 'sucesso' | 'erro' | 'info' = 'info'): void {
    this.mensagemModal = msg;
    this.modalTipo = tipo;
    this.modalTitulo = tipo === 'sucesso' ? 'Sucesso!' : tipo === 'erro' ? 'Erro' : 'Informação';
    this.modalAberto = true;
    this.cdr.detectChanges();
  }

  fecharModal(): void {
    this.modalAberto = false;
    if (this.salvouComSucesso) {
      this.router.navigate(['/admin/home']);
    }
  }

  voltar(): void {
    this.location.back();
  }
}
