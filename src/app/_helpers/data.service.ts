import { Injectable } from '@angular/core';
import {InMemoryDbService, RequestInfo} from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { User } from './user.interface';
@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService{

  constructor() { }

  createDb() {
    let users :User[]= [
      {id:1,title:'Mr',firstName: 'Utkarsh', lastName:'Shukla',dob:'1999-01-18',email:'test1@test.com',password:'@123',acceptTerms:true},
      {id:2,title:'Mr',firstName: 'Rahul', lastName:'Sharma',dob:'2000-02-19',email:'test2@test.com',password:'@345',acceptTerms:true},
      {id:3,title:'Mrs',firstName: 'Radhika', lastName:'Tripathi',dob:'2001-03-20',email:'test3@test.com',password:'@678',acceptTerms:true}

    ];
    return {users};
  }
}
