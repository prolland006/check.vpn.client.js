import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import {Http, Headers, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/map';

@Component({
  templateUrl: 'geoloc.html'
})
export class GeolocPage {
  selectedItem: any;
  ip: string;
  city: string;
  country: string;
  isoCode: string;
  latitude: string;
  longitude: string;
  names: string;
  subIsoCode: string;
  subName: string;

  constructor(private http: Http, public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.http.get('http://ipv4.myexternalip.com/json')
      .map(data => data.json())
      .subscribe(_ip =>
        {
          console.log('_ip', _ip.ip);
          this.ip = _ip.ip;

          this.http.get(`http://nice-informatique-service.fr/geoip_service/geoip_service.php?ip=${_ip.ip}&data=json`)
            .map(data => data.json())
            .subscribe(geoloc =>
              {
                console.log('geoploc', geoloc);
                this.city = geoloc.city;
                this.country = geoloc.country;
                this.isoCode = geoloc.isoCode;
                this.latitude = geoloc.latitude;
                this.longitude = geoloc.longitude;
                this.names = geoloc.names;
                this.subIsoCode = geoloc.subIsoCode;
                this.subName = geoloc.subName;
              }
            );

        }
      );


  }

}
