import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MessageService } from './message.service';
import { HttpClient } from '@angular/common/http';
import { Config } from '../entity/Config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(
    private messages: MessageService,
    private http: HttpClient) { }

  private readonly API = environment.API + '/configs';

  public getConfig() {
    this.messages.add(`API: ${this.API} - GET`);
    return this.http.get<Config>(this.API);
  }

  public setConfig(config) {
    this.messages.add(`${this.API}/${config.id} - PUT: ' + ${JSON.stringify(config)}`);
    return this.http.put(`${this.API}/${config.id}`, config);
  }
}
