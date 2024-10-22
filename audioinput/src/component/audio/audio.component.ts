import { Component } from '@angular/core';
import { AudioService } from '../../audio.service';
import { HttpClient } from '@angular/common/http';
import { error } from 'node:console';

@Component({
  selector: 'app-audio',
  standalone: true,
  imports: [],
  templateUrl: './audio.component.html',
  styleUrl: './audio.component.scss'
})
export class AudioComponent {

  constructor(public audioService: AudioService, private http: HttpClient){}

  async submitAudio() {
    const audioBlob = await this.audioService.stopRecording();
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');
  
    this.http.post('http://localhost:5000/api/audio', formData).subscribe(
      (response) => {
      console.log(response)
      },
      (error) =>{
        console.error(error ,"=====>");
      }
  
  );
  }

}
