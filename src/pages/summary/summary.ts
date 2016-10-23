import {Component, ViewChild, ElementRef} from '@angular/core';
import {Http} from "@angular/http";
import { MediaPlugin } from 'ionic-native';
import {Platform} from "ionic-angular";
import {log, PRIORITY_INFO} from "../../services/log";

@Component({
  templateUrl: 'summary.html'
})
export class SummaryPage {
  vpnOK: string;
  svpnOK: string;
  fifoTrace: log;

  // get the element with the #chessCanvas on it
  @ViewChild("statusCanvas") statusCanvas: ElementRef;

  constructor(private http: Http, private platform: Platform) {
    this.fifoTrace = new log(5);
    this.getStatus();
  }

  getMediaURL(s) {
    if (this.platform.is('android')) {
      return "/android_asset/www/" + s;
    }
    return s;
  }

  getStatus() {
    this.fifoTrace.log({level: PRIORITY_INFO, message: 'http get'});
    this.http.get('http://192.168.0.11:3000/status')
      .map(data => data.json())
      .subscribe(_vpnOK => {
          this.fifoTrace.log({level: PRIORITY_INFO, message: '_vpnOK '+_vpnOK.vpnOK});
          this.vpnOK = _vpnOK.vpnOK;
          if (!this.vpnOK && this.vpnOK!=this.svpnOK) { //if vpn disconnection

            this.fifoTrace.log({level: PRIORITY_INFO, message: 'play sound'});
            if (this.platform.is('android'))new MediaPlugin(this.getMediaURL('assets/sound/war.wav')).play();

          }
          this.svpnOK = this.vpnOK;
          setTimeout(() => {this.getStatus();},3000);
        },
        err => {
          console.log(err);
          this.vpnOK = "false";
          setTimeout(() => {this.getStatus();},3000);
        });
  }

  okCanvas() {
    let context: CanvasRenderingContext2D = this.statusCanvas.nativeElement.getContext("2d");
    context.fillStyle = 'green';
    context.fillRect(0, 0, 15, 15);
  }

  koCanvas() {
    let context: CanvasRenderingContext2D = this.statusCanvas.nativeElement.getContext("2d");
    context.fillStyle = 'red';
    context.fillRect(0, 0, 15, 15);
  }

}



