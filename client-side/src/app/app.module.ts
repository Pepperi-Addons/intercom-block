import { BrowserModule } from '@angular/platform-browser';
import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { PepNgxLibModule, PepAddonService, PepFileService } from '@pepperi-addons/ngx-lib';
import { BlockSettingsModule } from './block-settings';
import { BlockEditorComponent, BlockEditorModule } from './block-editor';
import { BlockComponent, BlockModule } from './block'
import { PepTopBarModule } from '@pepperi-addons/ngx-lib/top-bar';
import { PepPageLayoutModule } from '@pepperi-addons/ngx-lib/page-layout';
import { AddProfileFormComponent } from './add-profile-form/add-profile-form.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { MatDialogModule } from '@angular/material/dialog';
import { PepColorModule } from '@pepperi-addons/ngx-lib/color';
import { TestIntercomAPIDialogComponent } from './test-intercom-api-dialog/test-intercom-api-dialog.component'
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';

import { config } from './addon.config';
import { SettingsComponent } from './settings';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        PepNgxLibModule,
        BlockSettingsModule,
        BlockEditorModule,
        BlockModule,
        PepTopBarModule,
        PepPageLayoutModule,
        PepSelectModule,
        PepButtonModule,
        HttpClientModule,
        MatDialogModule,
        PepColorModule,
        PepTextboxModule,
        PepTextareaModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }
        })

    ],
    declarations: [
        AppComponent,
        AddProfileFormComponent,
        MessageDialogComponent,
        TestIntercomAPIDialogComponent
    ],
    providers: [],
    bootstrap: [
        // AppComponent
    ]
})
export class AppModule implements DoBootstrap {
    constructor(
        private injector: Injector,
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }

    ngDoBootstrap() {
        this.pepAddonService.defineCustomElement(`settings-element-${config.AddonUUID}`, SettingsComponent, this.injector);
        this.pepAddonService.defineCustomElement(`intercom-element-${config.AddonUUID}`, BlockComponent, this.injector);
        this.pepAddonService.defineCustomElement(`intercom-editor-element-${config.AddonUUID}`, BlockEditorComponent, this.injector);
    }
}