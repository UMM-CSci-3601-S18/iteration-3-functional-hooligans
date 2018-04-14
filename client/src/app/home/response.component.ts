import {Component, Inject} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
@Component({
    selector: 'app-response.component',
    templateUrl: 'response.component.html',
    styleUrls: ['./response.component.css'],
})
export class ResponseComponent {
    public selectedEmotion = "none";
    public sanitzer;

    // links is an array of different responses we are using when you select an emoji in our home page

    public links: string[] = [
        'https://www.youtube.com/watch?v=Jyy0ra2WcQQ',
        'https://www.youtube.com/watch?v=6kVlonPVAjI',
        'https://www.youtube.com/watch?v=z39iodZOf00',
        'https://www.youtube.com/watch?v=Yt1JtbhSIMc',
        'https://www.youtube.com/watch?v=csjhIkKnz4Q',
        'https://www.youtube.com/watch?v=Orrr7PyaZs4',
        'https://www.youtube.com/watch?v=uLu6iq0NaqU',
        'https://www.youtube.com/watch?v=eMHg8sSmKWs',
        'https://www.youtube.com/watch?v=hJbRpHZr_d0',
        'https://www.youtube.com/watch?v=Nw2oBIrQGLo',
        'https://www.youtube.com/watch?v=XyNlqQId-nk',
        'https://www.youtube.com/watch?v=EtH9Yllzjcc',
        'https://www.youtube.com/watch?v=BfFi4wba30g',
        'https://www.youtube.com/watch?v=WxUulGkLu4I',
        'https://www.youtube.com/watch?v=1JArN6rag8s'
    ];


    constructor(
        public dialogRef: MatDialogRef<ResponseComponent>, private sanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) public data: { response: number } ) {
    }



    // getLink is the magic function that randomly chooses one of the links in the array
    // that we added to the responses.component file to make sure the links are not
    // repetitive and random everytime

    // getLink() : string {
    //     var response
    //     var index = Math.floor(Math.random() * this.links.length);
    //   response = this.links[index];
    //     return this.sanitizer.bypassSecurityTrustUrl(response);
    //
    // }

    onNoClick(): void {
        this.dialogRef.close();
    }


}
