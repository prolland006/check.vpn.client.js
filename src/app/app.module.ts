import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { SummaryPage } from '../pages/summary/summary';
import { GeolocPage } from '../pages/geoloc/geoloc';

@NgModule({
  declarations: [
    MyApp,
    SummaryPage,
    GeolocPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SummaryPage,
    GeolocPage
  ],
  providers: []
})
export class AppModule {}
