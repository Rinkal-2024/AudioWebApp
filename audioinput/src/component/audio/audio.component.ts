import { Component } from '@angular/core';
import { AudioService } from '../../audio.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-audio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio.component.html',
  styleUrl: './audio.component.scss'
})
export class AudioComponent {

  response: string = '';

  constructor(public audioService: AudioService, private http: HttpClient){}

  async submitAudio() {
    const audioBlob = await this.audioService.stopRecording();
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');

    this.http.post('http://localhost:5000/api/audio', formData).subscribe(
        (response: any) => {
            console.log('Response from server:', response);
            if (response && response.response) {
                this.displayResponse(response.response);
            } else {
                console.error('No valid response received');
            }
        },
        (error) => {
            console.error('Error uploading audio:', error);
        }
    );
}

// Method to display the response in your UI
displayResponse(response: string) {
  this.response = response
    console.log('Displaying response:', response);
}


}
