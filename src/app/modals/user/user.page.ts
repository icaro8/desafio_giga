import { Component, Input } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage {
  @Input() detail: any;

  constructor(
    private modalController: ModalController,
    private plt:Platform
  ) {
    this.plt.ready().then(async () => {
      await console.log(this.detail);
      
    })
  }

  async close() {
    try {
      await this.modalController.dismiss();
    } catch (e) {
      console.log(e);
    }
  }

}
