import { Component, ViewChild } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'electron-app';

  sources: any[] = [];
  selectedSource: any;
  @ViewChild('videoElement', { static: true }) videoElement: any;
  video: any;
  pirates: any;

  constructor(private readonly _electronService: ElectronService) {}

  async ngOnInit() {
    this.pirates = await this._electronService.ipcRenderer.invoke('getPirates');

    this.video = this.videoElement.nativeElement;
  }

  displaySources() {
    if (this._electronService.isElectronApp) {
      this._electronService.desktopCapturer
        .getSources({ types: ['window', 'screen'] })
        .then(async (sources) => {
          this.sources = sources;
          if (this.sources.length > 0) {
            this.selectedSource = this.sources[0];
          }
        });
    }
  }

  selectSource(source: any) {
    this.selectedSource = source;
  }

  takeScreenshot() {
    let nav = <any>navigator;

    nav.webkitGetUserMedia(
      {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: this.selectedSource.id,
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720,
          },
        },
      },
      (stream: any) => {
        this.video.srcObject = stream;
        this.video.onloadedmetadata = (e: unknown) => this.video.play();
      },
      () => {
        console.log('getUserMediaError');
      }
    );
    return;
  }
}
