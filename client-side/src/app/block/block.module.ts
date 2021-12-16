import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';

import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService, PepFileService, PepHttpService } from '@pepperi-addons/ngx-lib';

import { BlockComponent } from '.';

import { config } from '../addon.config';

export const routes: Routes = [
    {
        path: '',
        component: BlockComponent
    }
];

@NgModule({
    declarations: [BlockComponent],
    imports: [
        CommonModule,
        PepButtonModule,
        // TranslateModule.forChild({
        //     loader: {
        //         provide: TranslateLoader,
        //         useFactory: (http: HttpClient, fileService: PepFileService, addonService: PepAddonService) => 
        //             PepAddonService.createDefaultMultiTranslateLoader(http, fileService, addonService, config.AddonUUID),
        //         deps: [HttpClient, PepFileService, PepAddonService],
        //     }, isolate: false
        // }),
        RouterModule.forChild(routes)
    ],
    exports: [BlockComponent],
    providers: [
        // TranslateStore
    ]
})
export class BlockModule {
    constructor(
        // translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        // this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
