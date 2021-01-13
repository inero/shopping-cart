import { Injectable } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { IProduct } from 'src/app/models/product';
import { ICartItem } from 'src/app/models/cart';
import { Observable, BehaviorSubject } from 'rxjs';
import { CommonConstants } from 'src/app/constants/common-costants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public cartItemCountBadge: number;
  public cartItemCount = new BehaviorSubject(0);

  constructor(private productListService: RestService<IProduct>, private cartListService: RestService<ICartItem>) {
    this.cartItemCountBadge = 0;
  }

  public getProductList(productId: string = ''): Observable<IProduct> {
    return this.productListService.getData(CommonConstants.basePath, 'products', 'application/json', productId);
  }

  public getCartItems(productId: string = ''): Observable<ICartItem> {
    return this.cartListService.getData(CommonConstants.basePath, 'cart', 'application/json', productId);
  }

  public addItemToCart(cartItemData: ICartItem): Observable<ICartItem> {
    return this.cartListService.postData(cartItemData, CommonConstants.basePath, 'cart', 'application/json', 'application/json');
  }
  
  public updateItemToCart(cartItemData: ICartItem, id: string): Observable<ICartItem> {
    return this.cartListService.putData(cartItemData, CommonConstants.basePath, 'cart', 'application/json', 'application/json', id);
  }

  public removeItemFromCart(id: string): Observable<ICartItem> {
    return this.cartListService.deleteData(id, CommonConstants.basePath, 'cart', 'application/json', 'application/json');
  }

  public getDateTime(): string {
    var today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}`
  }


}
