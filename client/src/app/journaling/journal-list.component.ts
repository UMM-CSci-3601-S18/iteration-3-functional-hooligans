import {Component, OnInit} from '@angular/core';
import {JournalListService} from './journal-list.service';
import {Journal} from './journal';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddJournalComponent} from './add-journal.component';
import {EditJournalComponent} from "./edit-journal.component";
import {environment} from "../../environments/environment";
import {SelectJournalComponent} from "./select-journal.component";
import {AuthService} from "angularx-social-login";
import {SocialUser} from "angularx-social-login";

@Component({
    selector: 'app-journal-list-component',
    templateUrl: 'journal-list.component.html',
    styleUrls: ['./journal-list.component.css'],
})

export class JournalListComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public journals: Journal[];
    public filteredJournals: Journal[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public journalSubject: string;
    public journalBody: string;
    public journalDate: any;
    public user: SocialUser;

    public selectedJournal: Journal;

    // Inject the JournalListService into this component.
    constructor(public journalListService: JournalListService, public dialog: MatDialog,
                public authService: AuthService) {
        if(environment.production === false) {

        }
    }

    openDialog(): void {
        const newJournal: Journal = {_id: '', subject: '', body: '', date: '', email: this.user.email};
        const dialogRef = this.dialog.open(AddJournalComponent, {
            width: '500px',
            data: { journal: newJournal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.journalListService.addNewJournal(result).subscribe(
                addJournalResult => {
                    this.selectedJournal = newJournal;
                    this.refreshJournals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the journal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    openDialogSelect(): void {
        const newJournal: Journal = {_id: '', subject: '', body: '', date: '', email: this.user.email};
        const dialogRef = this.dialog.open(SelectJournalComponent, {
            width: '500px',
            data: { journal: newJournal }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result != null) {
                this.selectedJournal = result;
            }
        });
    }


    openDialogReview(editJournal: Journal): void {
        console.log(editJournal._id + ' ' + editJournal.subject);
        const dialogRef = this.dialog.open(EditJournalComponent, {
            width: '500px',
            data: { journal: editJournal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.journalListService.editJournal(result).subscribe(
                editJournalResult => {

                    if(result != null) {
                        this.selectedJournal = result;
                    }
                    this.refreshJournals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error editing the journal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    deleteJournal(_id: string){
        this.journalListService.deleteJournal(_id).subscribe(
            journals => {
                this.refreshJournals();
                this.loadService();
                this.selectedJournal = null;
            },
            err => {
                console.log(err);
                this.refreshJournals();
                this.loadService();
                this.selectedJournal = null;
            }
        );
    }

    loadService(): void {
        this.journalListService.getJournals(this.user.email).subscribe(
            journals => {
                this.journals = journals;
                this.filteredJournals = this.journals;
            },
            err => {
                console.log(err);
            }
        );
    }


    public getReadableDate(): string {
        if(this.selectedJournal.date == '') {
            return '';
        }
        const date = new Date(this.selectedJournal.date);
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':'
            + date.getMinutes();
    }

    public filterJournals(searchSubject: string, searchBody: string): Journal[] {

        this.filteredJournals = this.journals;

        // Filter by subject
        if (searchSubject != null) {
            searchSubject = searchSubject.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchSubject || journal.subject.toLowerCase().indexOf(searchSubject) !== -1;
            });
        }

        // Filter by body
        if (searchBody != null) {
            searchBody = searchBody.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !searchBody || journal.body.toLowerCase().indexOf(searchBody) !== -1;
            });
        }

        return this.filteredJournals;
    }


    /**
     * Starts an asynchronous operation to update the journals list
     *
     */
    refreshJournals(): Observable<Journal[]> {
        // Get Journals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)
        const journalListObservable: Observable<Journal[]> = this.journalListService.getJournals(this.user.email);
        journalListObservable.subscribe(
            journals => {
                this.journals = journals;
                this.filterJournals(this.journalSubject, this.journalBody);
            },
            err => {
                console.log(err);
            });
        return journalListObservable;
    }

    /**
     * we might want the server to search for entries instead of angular ?
     loadService(): void {
        this.journalListService.getJournals(this.userCompany).subscribe(
            users => {
                this.users = users;
                this.filteredUsers = this.users;
            },
            err => {
                console.log(err);
            }
        );
    }
     **/

    ngOnInit(): void {
        if(environment.envName != 'e2e') {
            this.authService.authState.subscribe((user) => {
                this.user = user;
            });
        }
        else {
            // run this code during e2e testing
            // so that we don't have to sign in
            this.user = {
                provider: '',
                id: '',
                email: 'sunshine@test.com',
                name: 'test dummy',
                photoUrl: '',
                firstName: 'test',
                lastName: 'dummy',
                authToken: '',
                idToken: 'testToken',
            };
        }
        this.refreshJournals();
    }
}
