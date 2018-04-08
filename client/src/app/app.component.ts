import {Component, Input, OnInit} from '@angular/core';
import {gapi} from 'gapi-client';
import {environment} from "../environments/environment";
import {AuthService, GoogleLoginProvider, SocialUser} from "angular4-social-login";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = "Sunshine Journal";
    public user: SocialUser;
    public loggedIn: boolean;

    public buttonText: string;

    constructor(private authService: AuthService) { }

    //New function to return the name of the active user
    //window.* is not defined, or 'gettable' straight from HTML *ngIf
    //So this function will return that
    getLoginName(){
        var name = window['name'];
        return name;
    }

    signInWithGoogle(): void {
        if(this.loggedIn) {
            this.signOut();
            return;
        }
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)

            .then((res) => {
                console.log(this.user.name + ' signed in.');
                //refreshes after login so that the name of the user can be shown
                window.location.reload();
                return;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    signOut(): void {
        this.authService.signOut()

            .then((res) => {
                console.log('Signed out.');
                return;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    ngOnInit() {
        this.authService.authState.subscribe((user) => {
            this.user = user;
            this.loggedIn = (user != null);
            if(this.loggedIn) {
                this.buttonText = 'Sign Out'
            }
            else {
                this.buttonText = 'Sign In'
            }
        });
    }

}
