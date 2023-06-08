import { FormGroup } from "@angular/forms";

export function MustMatch(password:string, confirmPassword:string){
    return (formGroup: FormGroup) => {
        const passwordControl = formGroup.controls[password];
        const confirmPasswordControl = formGroup.controls[confirmPassword];

        if(confirmPasswordControl.errors && !confirmPasswordControl.errors['mustMatch']){
            return;
        }

        if(passwordControl.value !== confirmPasswordControl.value){
            confirmPasswordControl.setErrors({mustMatch : true});
        }else{
            confirmPasswordControl.setErrors(null);
        }
    }
}