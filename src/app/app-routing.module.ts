import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
    { path: '', pathMatch:'full', redirectTo: 'landing' },
    { path: 'landing', component: LandingComponent },
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {useHash: true, scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', scrollOffset: [0, 64]})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
