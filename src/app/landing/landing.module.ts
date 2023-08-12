import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { StyleClassModule } from 'primeng/styleclass';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { DataViewModule } from 'primeng/dataview';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StadiumCreationComponent } from './stadium/stadium-creation/stadium-creation.component';
import { StadiumUpdateComponent } from './stadium/stadium-update/stadium-update.component';

@NgModule({
    imports: [
        CommonModule,
        DividerModule,
        StyleClassModule,
        ChartModule,
        PanelModule,
        ButtonModule,
        TableModule,
        FieldsetModule,
        DataViewModule,
        ToastModule,
        HttpClientModule,
        BrowserAnimationsModule
    ],
    declarations: [LandingComponent, StadiumCreationComponent, StadiumUpdateComponent]
})
export class LandingModule { }
