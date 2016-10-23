import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import {Http} from "@angular/http";
import 'rxjs/add/operator/map';

@Component({
  templateUrl: 'geoloc.html'
})
export class GeolocPage {
  selectedItem: any;
  vpnOK: string;

  constructor(private http: Http, public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.http.get('http://192.168.0.11:3000/status')
      .map(data => data.json())
      .subscribe(_vpnOK =>
        {
          console.log('_vpnOK', _vpnOK.vpnOK);
          this.vpnOK = _vpnOK.vpnOK;
        }
      );


  }

}
