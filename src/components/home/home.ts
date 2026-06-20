import { Component } from '@angular/core';
import { StoreData } from '../../models/store-data';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  store: StoreData;
  isAppear: Boolean;
  btnTitle: string;
  constructor() {
    this.store = new StoreData('ITI', 'https://iti.gov.eg/assets/images/ColoredLogo.svg', [
      'Assuit',
      'smart',
      'alex',
    ]);
    this.isAppear = false;
    this.btnTitle = 'Show';
  }
  toggleImg() {
    this.isAppear = !this.isAppear;
    this.btnTitle = this.isAppear ? 'Hide' : 'Show';
  }
}
