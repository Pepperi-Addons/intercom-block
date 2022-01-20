import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { PepNgxLibModule, PepAddonService, PepFileService } from '@pepperi-addons/ngx-lib';
import { BlockSettingsModule } from './block-settings';
import { BlockEditorModule } from './block-editor';
import { BlockModule } from './block'
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

export function createTranslateLoader(http: HttpClient, fileService: PepFileService, addonService: PepAddonService) {
    const translationsPath: string = fileService.getAssetsTranslationsPath();
    const translationsSuffix: string = fileService.getAssetsTranslationsSuffix();
    const addonStaticFolder = addonService.getAddonStaticFolder();

    return new MultiTranslateHttpLoader(http, [
        {
            prefix:
                addonStaticFolder.length > 0
                    ? addonStaticFolder + translationsPath
                    : translationsPath,
            suffix: translationsSuffix,
        },
        {
            prefix:
                addonStaticFolder.length > 0
                    ? addonStaticFolder + "assets/i18n/"
                    : "/assets/i18n/",
            suffix: ".json",
        },
    ]);
}

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
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient, PepFileService, PepAddonService]
            }
        })

    ],
    declarations: [	
        AppComponent,
      AddProfileFormComponent,
      MessageDialogComponent
   ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { 
    constructor(
        translate: TranslateService
    ) {

      let userLang = 'en';
      translate.setDefaultLang(userLang);
      userLang = translate.getBrowserLang().split('-')[0]; // use navigator lang if available

      if (location.href.indexOf('userLang=en') > -1) {
          userLang = 'en';
      }
      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use(userLang).subscribe((res: any) => {
          // In here you can put the code you want. At this point the lang will be loaded
      });
  }ƒ
}
