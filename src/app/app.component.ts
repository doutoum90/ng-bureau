import { Component, ViewChild } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'electron-app';

  sources: any[] = [
    { id: 1, name: 'Name' },
    { id: 2, name: 'Name Electron' },
  ];
  selectedSource: any;
  videostream: any;
  @ViewChild('videoElement', { static: true }) videoElement: any;
  video: any;
  data: any;

  constructor(private readonly _electronService: ElectronService) {}

  ngOnInit() {
    // this.data = await this._electronService.ipcRenderer.invoke('getPirates');

    this.video = this.videoElement.nativeElement;
  }

  displaySources() {
    if (this._electronService.isElectronApp) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', this._electronService.ipcRenderer);
      console.log('NodeJS childProcess', this._electronService.clipboard);
      this._electronService.remote.desktopCapturer
        ?.getSources({ types: ['window', 'screen'] })
        .then(async (sources) => {
          console.log(sources);
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
    console.log(this.selectedSource);
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

  public playPingPong() {
    let pong: string = this._electronService.ipcRenderer.sendSync('ping');
    console.log(pong);
  }

  public beep() {
    this._electronService.shell.beep();
  }
}
