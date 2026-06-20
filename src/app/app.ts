import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

//? Decorator DP --> add new property in
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
