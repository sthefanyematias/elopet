import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderAdmin } from '../header-admin/header-admin';
import { FooterAdmin } from '../footer-admin/footer-admin';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [RouterModule, HeaderAdmin, FooterAdmin],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeAdmin { }