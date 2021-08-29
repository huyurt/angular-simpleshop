import {Component, OnInit} from '@angular/core';
import {AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../account.service";
import {Router} from "@angular/router";
import {of, timer} from "rxjs";
import {map, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  errors: string[] = [];

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) {
  }

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = new FormGroup({
      displayName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')],
        [this.validateEmailNotToken()]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe(() => {
      this.router.navigateByUrl('/shop');
    }, error => {
      console.log(error);
      this.errors = error.errors || [];
    });
  }

  validateEmailNotToken(): AsyncValidatorFn {
    return control => {
      return timer(500)
        .pipe(
          switchMap(() => {
            if (!control.value) {
              return of(null);
            }
            return this.accountService.checkEmailExists(control.value)
              .pipe(
                map(res => {
                  return res ? {emailExists: true} : null;
                })
              )
          })
        )
    }
  }

}
