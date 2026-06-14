import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private readonly API = '/pets';
  private readonly API_INTERESSES = '/interesses';
  private readonly API_UPLOAD = '/upload';

  constructor(private http: HttpClient) { }

  uploadImagem(file: File): Observable<{ filename: string }> {
    const formData = new FormData();
    formData.append('imagem', file);
    return this.http.post<{ filename: string }>(this.API_UPLOAD, formData);
  }

  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.API);
  }

  getPetById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.API}/${id}`);
  }

  salvarPet(pet: any): Observable<Pet> {
    return this.http.post<Pet>(this.API, pet);
  }

  editarPet(id: number, pet: Pet): Observable<Pet> {
    return this.http.put<Pet>(`${this.API}/${id}`, pet);
  }

  patchPet(id: number, campos: Partial<Pet>): Observable<Pet> {
    return this.http.patch<Pet>(`${this.API}/${id}`, campos);
  }

  excluirPet(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }

  getInteresses(): Observable<any[]> {
    return this.http.get<any[]>(this.API_INTERESSES);
  }

  getInteressesPorPet(petId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_INTERESSES}?petId=${petId}`);
  }

  salvarInteresse(dados: any): Observable<any> {
    return this.http.post<any>(this.API_INTERESSES, dados);
  }

  excluirInteresse(id: number): Observable<any> {
    return this.http.delete(`${this.API_INTERESSES}/${id}`);
  }

  patchInteresse(id: number, campos: any): Observable<any> {
    return this.http.patch<any>(`${this.API_INTERESSES}/${id}`, campos);
  }
}
