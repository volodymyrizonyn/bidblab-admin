

import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { CommonService } from '../../shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { DialogService } from '../../shared/services/dialog.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { BlockUIService } from '../../shared/services/block-ui.service';
import { Question } from '../../shared/models/question.model';
import { QuestionDialogComponent } from '../../shared/components/question-dialog/question-dialog.component';
import { LoginComponent } from '../../shared/components/login/login.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AnswerDialogComponent } from '../../shared/components/answer-dialog/answer-dialog.component';
import { Answer } from '../../shared/models/answer.model';
import { User } from '../../shared/models/user.model';
import { SocketsService } from '../../shared/services/sockets.service';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';

import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MembersListComponent implements OnInit, AfterViewInit {

  // public displayedColumns = ['firstname', 'lastname', 'username', 'email', 'profilePicture', 'aboutme',
  //                            'gender', 'birthday', 'phone', 'physicaladdress', 'shippingaddress',
  //                            'tags', 'follows',
  //                            'verified', 'verificationTokenExpiry', "resetPasswordTokenExpiry",
  //                            "createdAt",  "updatedAt",
  //                            'details', 'update', 'delete'];

  public displayedColumns = ['username', 'birthday', 'physicaladdress', 'details', 'update', 'delete'];

  public dataSource = new MatTableDataSource<User>();
  private totalMembers: number;
  private pageSize: number;
  form: FormGroup;

  @ViewChild(MatSort) sort: MatSort;
 
  constructor(
    private fb: FormBuilder,
    private socketsService: SocketsService,
    private blockUIService: BlockUIService,
    private commonService: CommonService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
    private router: Router
  ) {}
 
  ngOnInit() {
    //this.newQuestionFlag = false;
    this.pageSize = 10;
    //this.autocomplete = [];
    // this.form = this.fb.group({
    //   search: ''
    // });
    this.getAllMembers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
 
  public getAllMembers(event?) {
    this.blockUIService.setBlockStatus(true);
    if (event) {
      this.pageSize = event.pageSize;
    }
    //this.autocomplete.splice(0);
    const observable = event
      ? this.commonService.getMembers(
          event.pageSize,
          event.pageIndex, ""
          //this.form.value.search
        )
      : this.commonService.getMembers(null, null, "");//this.form.value.search);
    observable.subscribe(
      (res: any) => {
        this.totalMembers = res.data.totalMembers;
        this.dataSource.data = res.data.members as User[];
        this.blockUIService.setBlockStatus(false);
      },
      (err: HttpErrorResponse) => {
        this.snackBar.open(err.error.msg, 'Dismiss');
      }
    );
  }
 
  public redirectToDetails = (id: string) => {
    event.preventDefault();
    console.log(id);
  }
 
  public redirectToUpdate = (id: string) => {
    console.log(id);
  }
 
  public redirectToDelete = (id: string) => {
    console.log(id);
  }
 
}