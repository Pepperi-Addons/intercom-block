import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { OnLoadOption, OnHideOption, LauncherVisibility, DUMMY_SECRET_KEY } from '../../../../shared/entities'
import { BlockService } from '../block/block.service';
import { AddonService } from '../addon.service'
import { v4 as uuid } from 'uuid';

@Component({
    selector: 'block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {
    @Input() hostObject: any;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('secretKeyTextbox') secretKeyTextBox: any;

    constructor(private translate: TranslateService,
        private addonService: AddonService,
        private blockService: BlockService) {
        this.addonService.addonUUID = "26f57caf-1b8d-46a3-ac31-0e8ac9260657"
    }

    appID: string;
    onHide: OnHideOption;
    onLoad: OnLoadOption;
    launcherVisibility: LauncherVisibility;
    secretKey: string;
    uuid: string;

    isIdentityVerifictionOn: boolean;
    onLoadOptions: { key: OnLoadOption, value: string }[];
    onHideOptions: { key: OnHideOption, value: string }[];
    launcherVisibilityOptions: { key: LauncherVisibility, value: string }[];

    ngOnInit(): void {
        // When finish load raise block-editor-loaded.
        // this.hostEvents.emit({action: 'block-editor-loaded'});

        this.initOptionsLists();
        this.initHostObjectData();
    }

    ngOnChanges(e: any): void {

    }

    async initHostObjectData() {
        this.onLoad = this.hostObject.configuration?.OnLoad ?? "None";
        this.onHide = this.hostObject.configuration?.OnHide ?? "Nothing";
        this.appID = this.hostObject.configuration?.AppID ?? "";
        this.launcherVisibility = this.hostObject.configuration?.LauncherVisibility;
        this.isIdentityVerifictionOn = this.hostObject.configuration?.IdentityVerifictionOn ?? false;
        this.uuid = this.hostObject.configuration?.Key;

        if (this.uuid && await this.blockService.isSecretKeyExist(this.uuid) == true) {
            this.secretKey = DUMMY_SECRET_KEY
        }
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
                this.secretKey = DUMMY_SECRET_KEY
                break
            }
            case 'IsIdentityVerifictionOn': {
                this.isIdentityVerifictionOn = $event
                this.secretKeyTextBox.disabled = !this.isIdentityVerifictionOn;
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
                "LauncherVisibility": this.launcherVisibility,
                "IdentityVerifictionOn": this.isIdentityVerifictionOn,
                "Key": this.uuid
            }
        })
    }

    async saveSecretKey(secretKey: string) {
        if(this.uuid === undefined) {
            this.uuid = uuid();
        }
        await this.blockService.saveSecretKey(this.uuid, secretKey);
    }
}
