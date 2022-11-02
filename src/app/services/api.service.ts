import { Injectable } from "@angular/core";
import { Toast } from "@awesome-cordova-plugins/toast/ngx";
import { LoadingController, NavController, ToastController } from "@ionic/angular";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private loadingController: LoadingController = new LoadingController();
  public url: string;
  public method: string = 'GET';
  public message: string = 'Carregando...';
  public show_errors: boolean = true;
  public show_toast: boolean = true;
  public data: any;
  public contentType: string;// = 'application/json'; //'multipart/form-data';
  private toast: Toast = new Toast();
  private ctrlLoading: any;
  constructor(private nav?: NavController) {
    this.nav = nav;
  }

  async showToast(msg: string) {
    this.toast.show(msg, '5000', 'top').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }

  async request() {
    try {
      if (this.show_toast) {
        await this.addLoading(this.message);
      }
      const headers = new Headers();
      if (this.contentType) headers.append('Content-Type', this.contentType);
      const requestOptions: any = {
        method: this.method,
        headers: headers,
        body: null,
        redirect: 'follow',
      };
      if (this.data) requestOptions.body = this.contentType == 'application/x-www-form-urlencoded' ? JSON.stringify(this.data) : this.data;
      var x = await fetch(`${environment.base_ws}/${this.url}`, requestOptions);
      console.log(x);
      if (!x.ok) throw x;
      if (x.status === 204) return Promise.resolve(x);
      var res = await x.json();
      return Promise.resolve(res);
    } catch (e) {
      console.error(e);
      if (!this.show_errors) return Promise.resolve();
      try {
        e = await e.json();
        console.log(e);
        this.showToast(e.message);
      } catch (z) {
        console.error(z);
        this.showToast('Não foi possivel conectar com servidor, por favor tente novamente mais tarde');
        return Promise.reject(z);
      }
      return Promise.reject(e);
    } finally {
      if (this.show_toast) await this.rmLoading();
    }
  }


  purgeData(data: any) {
    var data: any = JSON.parse(JSON.stringify(data));
    Object.keys(data).map(tab => {
      if (!data[tab] || (Array.isArray(data[tab]) && !data[tab].length) || !Object.keys(data[tab]).length) {
        delete data[tab];
        return;
      };
      Object.keys(data[tab]).map(e => {
        if (!data[tab][e]) delete data[tab][e];
      });
    });
    // console.log(data);
    return data;
  }

  setData(data: any, contentType: string = 'application/json') {
    this.data = this.purgeData(data);
    if (contentType) this.contentType = contentType;
  }

  async addLoading(msg) {
    try {
      this.ctrlLoading = await this.loadingController.create({
        // mode: 'ios',
        // duration: 50000,
        spinner: 'bubbles',
        message: msg,
        translucent: true,
        cssClass: 'custom-class custom-loading',
        backdropDismiss: false,

      })
      this.ctrlLoading.present();
    } catch (e) {
      console.log(e);

    }
  }

  async rmLoading() {
    try {
      this.ctrlLoading.dismiss();
    } catch (e) {
      console.log(e);
    }
  }

}
