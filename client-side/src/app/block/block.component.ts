import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
    @Input() hostObject: any;
    appID: string;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    constructor(
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
            this.hostEvents.emit({action: 'block-loaded'});
        } , 0);
    }

    ngOnChanges(e: any): void {

    }

    openChat() {
        window["Intercom"]('boot', {
            app_id: this.appID,
        });
        window['Intercom']('show');
        window['Intercom']('onHide', () => {
            console.log('Chat closed');
            window['Intercom']('shutdown');
        });
    }
}
