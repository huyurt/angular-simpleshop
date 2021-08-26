import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {IPagination} from "../shared/models/pagination";
import {IProduct} from "../shared/models/product";
import {IBrand} from "../shared/models/brand";
import {IProductType} from "../shared/models/productType";
import {map} from "rxjs/operators";
import {ShopParams} from "../shared/models/shopParams";

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';

  constructor(private http: HttpClient) {
  }

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    if (shopParams.brandIdsSelected!.length > 0) {
      params = params.append('brandIdsStr', shopParams.brandIdsSelected!.toString());
    }

    if (shopParams.productTypeIdsSelected!.length > 0) {
      params = params.append('typeIdsStr', shopParams.productTypeIdsSelected!.toString());
    }

    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());

    return this.http.get<IPagination<IProduct[]>>(this.baseUrl + 'products', {observe: 'response', params})
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getBrands() {
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands');
  }

  getProductTypes() {
    return this.http.get<IProductType[]>(this.baseUrl + 'products/types');
  }
}