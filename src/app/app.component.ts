import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './_helpers/user.service';
import Swal from 'sweetalert2';
import { User } from './_helpers/user.interface';
import { DBOperation } from './_helpers/db-operation';
import { MustMatch } from './_helpers/must-match.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'registrationapp';
  //registerForm : FormGroup=new FormGroup({});
   registerForm: FormGroup;
  users: User[] = [];
  submitted : boolean = false;
  buttonText : string = "Submit";
  dbops : DBOperation;


  constructor(private _toastr: ToastrService, private fb: FormBuilder, private _userService: UserService) {

  }
  ngOnInit() {
    this.setFormState();
    this.getAllUsers();

  }
  setFormState() {

    this.buttonText = "Submit";
    this.dbops = DBOperation.create;

    this.registerForm = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      dob: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6),])],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]

    },{
      validators : MustMatch('password','confirmPassword')
    });
  }

  get f(){
    return this.registerForm.controls;
    
  }
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

   switch(this.dbops){
    case DBOperation.create:
      this._userService.addUser(this.registerForm.value).subscribe(res =>{
        this._toastr.success("User Details Added !!","User Registration");
        this.getAllUsers();
        this.onCancel();
      });
      break;
    case DBOperation.update:
      this._userService.updateUser(this.registerForm.value).subscribe(res =>{
        this._toastr.success("User Details Updated !!","User Registration");
        this.getAllUsers();
        this.onCancel();
      });
      break;
   }


  }
  onCancel() {
    this.registerForm.reset();
    this.buttonText = "Submit";
    this.dbops = DBOperation.create;
    this.submitted = false;
  }
  getAllUsers() {
    this._userService.getUsers().subscribe((res: User[]) => {
      this.users = res;
    });
  }

  Edit(userId: number) {
   this.buttonText = "Update";
   this.dbops = DBOperation.update;

   let user = this.users.find((u : User)=> u.id === userId);
   this.registerForm.patchValue(user);
   this.registerForm.get('password').setValue('');
   this.registerForm.get('confirmPassword').setValue('');
   this.registerForm.get('acceptTerms').setValue(false);
   
  }
  Delete(userId: number) {
    Swal.fire({
      title: 'Are you sure',
      text: 'You will not be able to recoever it',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it.',
      cancelButtonText: 'Keep It'
    }).then((result) => {
      if (result.value) {
        this._userService.deleteUser(userId).subscribe(res => {
          this.getAllUsers();
          this._toastr.success("Delete Success !!", "User Registration")
        });
      
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'File is safe',
          'error'
        )
      }
    })
  }


}
