import {Component, OnInit} from '@angular/core';
import {IProduct} from "../../shared/models/product";
import {ShopService} from "../shop.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct | undefined;

  constructor(private shopService: ShopService, private activateRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activateRoute.snapshot.paramMap.get('id') || '';
    if (!Number(id)) {
      return;
    }

    this.shopService.getProduct(parseInt(id)).subscribe(product => {
      this.product = product;
    }, error => {
      console.log(error);
    });
  }
}
