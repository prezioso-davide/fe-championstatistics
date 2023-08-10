import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LandingModule } from './landing/landing.module';
import { LayoutService } from './layout/service/app.layout.service';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        AppRoutingModule,
        LandingModule,
        BrowserModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        LayoutService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
