import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OnLoadOption, OnHideOption, LauncherVisibility } from '../../../../shared/entities'
import { BlockService } from '../block/block.service';

@Component({
    selector: 'block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {
    @Input() hostObject: any;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translate: TranslateService,
                private blockService: BlockService) { 
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
        this.onLoad = this.hostObject.configuration?.OnLoad ?? "None";
        this.onHide = this.hostObject.configuration?.OnHide ?? "Nothing";
        this.appID = this.hostObject.configuration?.AppID ?? "";
        this.launcherVisibility = this.hostObject.configuration?.LauncherVisibility;
    }

    ngOnChanges(e: any): void {
        
    }

    initOptionsLists() {
        this.onLoadOptions = [  
            { key: "None", value: this.translate.instant('None') },
            { key: "Show", value: this.translate.instant('Show') },
            { key: "ShowMessages", value: this.translate.instant('Show Messages') },
            { key: "ShowNewMessages", value: this.translate.instant('Show New Message') }
        ];

        this.onHideOptions = [  
            { key: "Nothing", value: this.translate.instant('Nothing') },
            { key: "NavigateBack", value: this.translate.instant('Navigate Back') }
        ];

        this.launcherVisibilityOptions = [  
            { key: "Visible", value: this.translate.instant('Visible') },
            { key: "Hidden", value: this.translate.instant('Hidden') }
        ];
    }

    onValueChanged(element, $event) {
        switch (element) {
            case 'AppID': {
                this.appID = $event;
                break
            }
            case 'SecretKey': {
                this.saveSecretKey($event)
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
                "OnLoad": this.onLoad,
                "OnHide": this.onHide,
                "LauncherVisibility": this.launcherVisibility
            }
        })
    }

    async saveSecretKey(secretKey: string) {
        await this.blockService.saveSecretKey(this.appID, secretKey);
    }
}
