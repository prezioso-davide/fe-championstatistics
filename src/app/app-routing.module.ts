import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    { path: '', pathMatch:'full', redirectTo: 'landing' },
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {useHash: true, scrollPositionRestoration: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
