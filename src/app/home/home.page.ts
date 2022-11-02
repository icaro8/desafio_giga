import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  form: any = {};
  toast: ApiService = new ApiService();

  constructor(
    private plt: Platform
  ) {
    this.plt.ready().then(async () => {
      await this.load(1);
    })
  }

  async load(page) {
    try {
      var api = new ApiService();
      api.show_toast = false
      await api.addLoading(`Atualizando a lista...`);
      api.url = `api/?format=json&results=20&page=${page}&inc=gender,name,email,picture&nat=br`;
      const res = await api.request();
      console.log(res);
      this.toast.showToast('Dados atualizados com sucesso!')
    } catch (e) {
      console.log(e);
    } finally{
      await api.rmLoading();
    }
  }

}