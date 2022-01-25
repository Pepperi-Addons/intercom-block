import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PepAddonService, PepFileService, PepTextboxField } from '@pepperi-addons/ngx-lib';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepCheckboxModule } from '@pepperi-addons/ngx-lib/checkbox';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepGenericListModule } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepPageLayoutModule } from '@pepperi-addons/ngx-lib/page-layout';
import { PepColorModule } from '@pepperi-addons/ngx-lib/color';

import { BlockSettingsComponent } from './block-settings.component';

import { config } from '../addon.config';
import { PepTopBarModule } from '@pepperi-addons/ngx-lib/top-bar';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';

@NgModule({
    declarations: [BlockSettingsComponent],
    imports: [
        CommonModule,
        PepTextboxModule,
        PepCheckboxModule,
        PepSelectModule,
        PepButtonModule,
        PepGenericListModule,
        PepPageLayoutModule,
        PepTopBarModule,
        PepColorModule,
        PepTextareaModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (http: HttpClient, fileService: PepFileService, addonService: PepAddonService) => 
                    PepAddonService.createDefaultMultiTranslateLoader(http, fileService, addonService, config.AddonUUID),
                deps: [HttpClient, PepFileService, PepAddonService],
            }, isolate: false
        }),
    ],
    exports: [BlockSettingsComponent],
    providers: [
        TranslateStore,
        // Add here all used services.
    ]
})
export class BlockSettingsModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}