import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlockSettingsComponent } from '../block-settings/block-settings.component';

// Important for single spa
@Component({
    selector: 'app-empty-route',
    template: '<div>Route is not exist.</div>',
})
export class EmptyRouteComponent {}

const routes: Routes = [
    {
        path: `:settingsSectionName/:addonUUID/:slugName`,
        children: [
            {
                path: '',
                component: BlockSettingsComponent
                // TODO: solve routing
                // path: '**',
                // loadChildren: () => import('./addon/addon.module').then(m => m.BlockModule)
            }
        ]
    },
    {
        path: '**',
        component: EmptyRouteComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }
