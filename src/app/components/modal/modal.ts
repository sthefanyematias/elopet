
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  @Input() titulo: string = '';
  @Input() mensagem: string = '';
  @Input() tipo: 'sucesso' | 'erro' | 'info' = 'info';
  @Output() fechar = new EventEmitter<void>();

  @HostListener('document:keydown.enter')
  onEnter(): void {
    this.aoFechar();
  }

  aoFechar(): void {
    this.fechar.emit();
  }
}
