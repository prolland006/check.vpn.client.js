import {Component, ViewChild, ElementRef} from '@angular/core';
import {Http} from "@angular/http";
import { MediaPlugin, BackgroundMode } from 'ionic-native';
import {Platform} from "ionic-angular";
import {log, PRIORITY_INFO} from "../../services/log";
import {Observable} from "rxjs/Rx";

const SOUND_VPN_DOWN = 'sound/war.wav';

@Component({
  templateUrl: 'summary.html'
})
export class SummaryPage {
  vpnOK: boolean;
  svpnOK: boolean;
  fifoTrace: log;
  soundVpnDown: MediaPlugin;

  // get the element with the #chessCanvas on it
  @ViewChild("statusCanvas") statusCanvas: ElementRef;

  constructor(private http: Http, private platform: Platform) {
    this.fifoTrace = new log(5);


    if (this.platform.is('android')) {
      this.platform.ready().then(() => {

        this.platform.ready().then(() => {
          this.soundVpnDown = new MediaPlugin(this.getMediaURL(SOUND_VPN_DOWN));
        }).catch(err=> {
          console.log(err);
        });

        BackgroundMode.setDefaults({ text:'Doing heavy tasks.'});
        // Enable background mode
        BackgroundMode.enable();

        // Called when background mode has been activated
        BackgroundMode.onactivate = () => {
          return new Observable(observer=>{
            setTimeout(function () {
              // Modify the currently displayed notification
              observer.next('one');
              BackgroundMode.configure({
                text:'background for more than 1s now.'
              });
            }, 1000);

            setTimeout(function () {
              // Modify the currently displayed notification
              observer.next('two');
              BackgroundMode.configure({
                text:'background for more than 5s now.'
              });
            }, 5000);

            setTimeout(function () {
              // Modify the currently displayed notification
              observer.complete();
              BackgroundMode.configure({
                text:' background for more than 10s.'
              });
            }, 10000);

          });
        };

        BackgroundMode.onactivate().subscribe(
          value => console.log('value',value),
          error => console.log('error',error),
          () => console.log('finished')
        );


      }).catch(err=> {
        console.log(err);
      });
    }


    this.getStatus();
  }

  /*
   * set the media URL switch the platform
   */
  getMediaURL(mediaPath) {
    if (this.platform.is('android')) {
      return "/android_asset/www/assets/" + mediaPath;
    }
    return "../../assets/" + mediaPath;
  }


  getStatus() {
    this.fifoTrace.log({level: PRIORITY_INFO, message: 'http get'});
    this.http.get('http://192.168.0.11:3000/status')
      .map(data => data.json())
      .subscribe(_vpnOK => {
          this.fifoTrace.log({level: PRIORITY_INFO, message: '_vpnOK '+_vpnOK.vpnOK});
          this.svpnOK = this.vpnOK;
          this.vpnOK = _vpnOK.vpnOK;
          if (!this.vpnOK && this.svpnOK) { //if vpn disconnection

            if (this.platform.is('android')) {
              this.platform.ready().then(() => {
                this.fifoTrace.log({level: PRIORITY_INFO, message: 'play sound'});
                this.soundVpnDown.play();
              });
            }
          }
          setTimeout(() => {this.getStatus();},3000);
        },
        err => {
          console.log(err);
          this.vpnOK = false;
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



