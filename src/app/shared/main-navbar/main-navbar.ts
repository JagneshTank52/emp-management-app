import { Component } from '@angular/core';
import { ReusableBtn } from '../reusable-btn/reusable-btn';
import { ReusableNavBtn } from '../reusable-nav-btn/reusable-nav-btn';

@Component({
  selector: 'app-main-navbar',
  imports: [ReusableNavBtn],
  templateUrl: './main-navbar.html',
  styleUrl: './main-navbar.css'
})
export class MainNavbar {

}
