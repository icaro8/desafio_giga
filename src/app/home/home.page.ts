import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController, Platform } from '@ionic/angular';
import { UserPage } from '../modals/user/user.page';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  form: any = { loaded: false, allLoaded: false, user: [], data: [] };
  toast: ApiService = new ApiService();
  page = 1;
  filter: string = 'all';

  constructor(
    private plt: Platform,
    private modalController: ModalController,
  ) {
    this.plt.ready().then(async () => {
      await this.load(this.page);
    })
  }

  async load(page) {
    try {
      var api = new ApiService();
      api.show_toast = false;
      api.url = `api/?format=json&results=20&page=${page}`;
      this.form.data = this.form.data.concat(await api.request());
      this.form.data.map(e => {
        e.results.map(e => {
          if (e.gender == 'male') e.gender = 'Masculino';
          if (e.gender == 'female') e.gender = 'Feminino';
        });
        this.form.user = this.form.user.concat(e.results);
        console.log(e);
      })
      this.form.loaded = true;
      console.log(this.form);
    } catch (e) {
      console.log(e);
      api.showToast(e);
    }
  }

  async showUser(i: number) {
    console.log(this.form.user[i]);
    const modal = await this.modalController.create({
      component: UserPage,
      componentProps: {
        detail: this.form.user[i],
      }
    });
    await modal.present();
    let x = await modal.onWillDismiss();
    if (x.data) {
      x.data = x.data;
    }
  }

  async loadData(event) {
    console.log(event);
    this.page++;
    console.log(this.page);

    await this.load(this.page);
    setTimeout(() => {
      event.target.complete();
      event.target.disabled = this.form.allLoaded;
      // if (data.length === 1000) {
      // }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}