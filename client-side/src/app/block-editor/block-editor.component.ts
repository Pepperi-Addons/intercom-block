import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OnLoadOption, OnHideOption, LauncherVisibility } from '../../../../shared/entities'

@Component({
    selector: 'block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {
    @Input() hostObject: any;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService) { 
    }

    appID: string;
    onHide: OnHideOption;
    onLoad: OnLoadOption;
    launcherVisibility: LauncherVisibility;
    secretKey: string;

    isIdentityVerifictionOn: boolean = true;
    onLoadOptions: {key: OnLoadOption, value: string}[];
    onHideOptions: {key: OnHideOption, value: string}[];
    launcherVisibilityOptions: {key: LauncherVisibility, value: string}[];

    ngOnInit(): void {
        // When finish load raise block-editor-loaded.
        // this.hostEvents.emit({action: 'block-editor-loaded'});

        this.initOptionsLists()
        this.onLoad = this.hostObject.configuration.OnLoad ?? 0;
        this.onHide = this.hostObject.configuration.OnHide ?? 0;
        this.secretKey = this.hostObject.configuration.SecretKey ?? "";
        this.appID = this.hostObject.configuration.AppID ?? "";
        this.launcherVisibility = this.hostObject.configuration.LauncherVisibility;
    }

    ngOnChanges(e: any): void {
        
    }

    initOptionsLists() {
        this.onLoadOptions = [  
            { key: OnLoadOption.None, value: this.translate.instant('None') },
            { key: OnLoadOption.Show, value: this.translate.instant('Show') },
            { key: OnLoadOption.ShowMessages, value: this.translate.instant('Show Messages') },
            { key: OnLoadOption.ShowNewMessages, value: this.translate.instant('Show New Message') }
        ];

        this.onHideOptions = [  
            { key: OnHideOption.Nothing, value: this.translate.instant('Nothing') },
            { key: OnHideOption.NavigateBack, value: this.translate.instant('Navigate Back') }
        ];

        this.launcherVisibilityOptions = [  
            { key: LauncherVisibility.Visible, value: this.translate.instant('Visible') },
            { key: LauncherVisibility.Hidden, value: this.translate.instant('Hidden') }
        ];
    }

    onValueChanged(element, $event) {
        switch (element) {
            case 'AppID': {
                this.appID = $event;
                break
            }
            case 'SecretKey': {
                this.secretKey = $event;
                break
            }
            case 'IsIdentityVerifictionOn': {
                this.isIdentityVerifictionOn = !this.isIdentityVerifictionOn
                document.getElementById('secret_key').setAttribute("disabled", `${!this.isIdentityVerifictionOn}`);
                break
            }
            case 'LauncherVisibility': {
                this.launcherVisibility = $event;
                break
            }
            case 'OnLoad': {
                this.onLoad = $event;
                break
            }
            case 'OnHide': {
                this.onHide = $event
                break 
            }
        }
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: {
                "AppID": this.appID,
                "SecretKey": $event,
                "OnLoad": this.onLoad,
                "OnHide": this.onHide,
                "LauncherVisibility": this.launcherVisibility
            }
        })
    }
}
