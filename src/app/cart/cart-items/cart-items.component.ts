import { Component, OnInit } from '@angular/core';
import { ICartItem } from 'src/app/models/cart';
import { IProduct } from 'src/app/models/product';
import { ProductService } from 'src/app/product/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css']
})
export class CartItemsComponent implements OnInit {

  public cartItems: ICartItem[];
  public orderSubTotal: number = 1;
  public shippingPrice: number = 40;
  public cartOrderTotal: number = 1;
  public productItemData: IProduct;

  constructor(private productService: ProductService, private router: Router) {
    this.cartItems = [];
    this.productItemData = {
      id: 0,
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      image: "",
      category: ""
    };
  }

  ngOnInit(): void {
    this.productService.getCartItems().subscribe((data: ICartItem) => {
      this.cartItems = Object.values(data);
      this.getOrderSubTotal(data);
    })
  }

  public addCartItemIncrement(index: number, updatedQty: string): void {
    this.cartItems[index].quantity = Number(updatedQty);
    this.cartItems[index].price = Number(Number(updatedQty) * Number(this.cartItems[index].price));
    this.productService.getProductList(this.cartItems[index].productId?.toString()).subscribe((data => {
      this.productItemData = data;
      this.cartItems[index].price = Number(Number(updatedQty) * this.productItemData.price);
      this.getOrderSubTotal(this.cartItems);
    }));
  }

  public getOrderSubTotal(cart: any): void {
    let total = cart.reduce((total: number, item: any) => {
      return total + item.price;
    }, 0);
    this.orderSubTotal = total;
    this.cartOrderTotal = this.shippingPrice + this.orderSubTotal;
  }

  public deleteCartItem(id: any) {
    if (confirm("Are you sure want to remove the item")) {
      this.productService.removeItemFromCart(id.toString()).subscribe((data) => {
        this.cartItems = this.cartItems.filter((item)=> item.id!==id);
        this.productService.cartItemCount.next(this.productService.cartItemCountBadge - 1);
        this.getOrderSubTotal(this.cartItems);
        if (this.productService.cartItemCountBadge === 0) {
          this.router.navigateByUrl('/products');
        }
      })
    }
  }
}
