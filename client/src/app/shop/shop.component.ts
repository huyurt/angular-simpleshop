import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IProduct} from "../shared/models/product";
import {ShopService} from "./shop.service";
import {IBrand} from "../shared/models/brand";
import {IProductType} from "../shared/models/productType";
import {ShopParams} from "../shared/models/shopParams";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', {static: false}) searchTerm: ElementRef | undefined;

  products: IProduct[] | undefined;
  brands: IBrand[] | undefined;
  productTypes: IProductType[] | undefined;

  shopParams = new ShopParams();
  totalCount = 0;

  sortOptions = [
    {name: 'Alfabetik', value: 'name'},
    {name: 'Fiyat: Ucuzdan Pahalıya', value: 'priceAsc'},
    {name: 'Fiyat: Pahalıdan Ucuza', value: 'priceDesc'}
  ];

  constructor(private shopService: ShopService) {
  }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getProductTypes();
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe(response => {
      this.products = response!.data;
      this.shopParams.pageNumber = response!.pageIndex;
      this.shopParams.pageSize = response!.pageSize;
      this.totalCount = response!.count;
    }, error => {
      console.log(error);
    });
  }

  getBrands() {
    this.shopService.getBrands().subscribe(response => {
      this.brands = response;
    }, error => {
      console.log(error);
    });
  }

  getProductTypes() {
    this.shopService.getProductTypes().subscribe(response => {
      this.productTypes = response;
    }, error => {
      console.log(error);
    });
  }

  onBrandSelectAll() {
    this.shopParams.brandIdsSelected = this.brands!.map(x => x.id);
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onBrandSelected(brandId: number) {
    if (this.onIsBrandActive(brandId))
      this.shopParams.brandIdsSelected = this.shopParams.brandIdsSelected.filter(x => x !== brandId);
    else
      this.shopParams.brandIdsSelected.push(brandId);
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onIsBrandActive(brandId: number): boolean {
    return this.shopParams.brandIdsSelected.filter(x => x === brandId).length > 0;
  }

  onBrandSelectedClean() {
    if (this.shopParams.brandIdsSelected.length != 0) {
      this.shopParams.brandIdsSelected = [];
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }
  }

  onProductTypeSelectAll() {
    this.shopParams.productTypeIdsSelected = this.productTypes!.map(x => x.id);
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onProductTypeSelected(productTypeId: number) {
    if (this.onIsProductTypeActive(productTypeId))
      this.shopParams.productTypeIdsSelected = this.shopParams.productTypeIdsSelected.filter(x => x !== productTypeId);
    else
      this.shopParams.productTypeIdsSelected.push(productTypeId);
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onIsProductTypeActive(productTypeId: number): boolean {
    return this.shopParams.productTypeIdsSelected.filter(x => x === productTypeId).length > 0;
  }

  onProductTypeSelectedClean() {
    if (this.shopParams.productTypeIdsSelected.length != 0) {
      this.shopParams.productTypeIdsSelected = [];
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }
  }

  onSortSelected(sort: string) {
    this.shopParams.sort = sort;
    this.getProducts();
  }

  onPageChanged(event: any) {
    if (this.shopParams.pageNumber !== event) {
      this.shopParams.pageNumber = event;
      this.getProducts();
    }
  }

  onSearch() {
    this.shopParams.search = this.searchTerm!.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onReset() {
    this.searchTerm!.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }


}
