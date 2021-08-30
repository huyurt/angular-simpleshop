import {Component, OnInit} from '@angular/core';
import {IOrder} from "../../shared/models/order";
import {Router} from "@angular/router";

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent implements OnInit {
  order: IOrder | undefined;

  constructor(private router: Router) {
    const nnavigation = this.router.getCurrentNavigation();
    const state = nnavigation?.extras?.state;
    if (state) {
      this.order = state as IOrder;
    }
  }

  ngOnInit(): void {
  }

}
