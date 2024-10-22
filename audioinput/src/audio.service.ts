import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private mediaRecorder!: MediaRecorder;
  private audioChunks: Blob[] = [];

  constructor() { }

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };
    });
  }

  stopRecording() {
    return new Promise<Blob>((resolve) => {
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.audioChunks = [];
        resolve(audioBlob);
      };
    });
  }

}
