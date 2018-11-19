import { Component, OnInit } from '@angular/core';
import { ConfigService } from './service/config.service';
import { Config } from './entity/Config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Angular-Boletos';
  config: Config;

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.configService.getConfig().subscribe(data => {
      this.config = data;
    });
  }
}
