import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlockService } from './block.service';
import { OnLoadOption, OnHideOption, LauncherVisibility } from '../../../../shared/entities'

@Component({
    selector: 'block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
    @Input() hostObject: any;
    appID: string;
    secretKey: string;
    actionOnHide: OnHideOption;
    actionOnLoad: OnLoadOption;
    launcherVisibility: LauncherVisibility;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(
         private BlockService: BlockService
        // private translate: TranslateService
    ) {
    }

    ngOnInit(): void {
        if (document.getElementById('intercom-script') == null) {
            const intercomScript = `(function () { var w = window; var ic = w.Intercom; if (typeof ic === "function") { ic('reattach_activator'); ic('update', w.intercomSettings); } else { var d = document; var i = function () { i.c(arguments); }; i.q = []; i.c = function (args) { i.q.push(args); }; w.Intercom = i; var l = function () { var s = d.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://widget.intercom.io/widget/${this.appID}'; var x = d.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); }; if (document.readyState === 'complete') { l(); } else if (w.attachEvent) { w.attachEvent('onload', l); } else { w.addEventListener('load', l, false); } } })();`
            const script = document.createElement('script');
            script.id = 'intercom-script';
            script.innerHTML = intercomScript;
            document.head.appendChild(script);
        }

        setTimeout(() => {
            this.openChat();

            // When finish load raise block-loaded.
            this.hostEvents.emit({ action: 'block-loaded' });
        }, 0);
    }

    ngOnChanges(e: any): void {
        this.appID = this.hostObject.configuration.AppID;
        this.actionOnLoad = this.hostObject.configuration.OnLoad;
        this.actionOnHide = this.hostObject.configuration.OnHide;
        this.saveSecretKey()
    }

    async saveSecretKey() {
        this.secretKey = this.hostObject.configuration.SecretKey;
        await this.BlockService.saveSecretKey(this.secretKey);
    }

    openChat() {
        window["Intercom"]('boot', {
            app_id: this.appID,
            email:  this.BlockService.getEmail(),
            user_hash: this.BlockService.getUserHash(),
            hide_default_launcher: this.launcherVisibility == LauncherVisibility.Hidden
        });

        this.onLoad()
        this.onHide()
    }

    onLoad() {
        switch (this.actionOnLoad) {
            case OnLoadOption.Show: {
                window['Intercom']('show');
                break
            }
            case OnLoadOption.ShowMessages: {
                window['Intercom']('showMessages');
                break
            }
            case OnLoadOption.ShowNewMessages: {
                window['Intercom']('showNewMessages');
                break
            }
        }
    }

    onHide() {
        switch (this.actionOnHide) {
            case OnHideOption.NavigateBack: {
                window['Intercom']('onHide', () => {
                    const event = new CustomEvent('emit-event', {
                        detail: {
                            key: 'CloseChat',
                            data: {
                            }
                        }
                    });
                    window.dispatchEvent(event);
                });
                break;
            }
        }
    }
}
