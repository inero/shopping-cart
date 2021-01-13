import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/models/product';
import { ProductService } from '../services/product.service';
import { ICartItem } from 'src/app/models/cart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  public productList: IProduct[];
  public cartItems: ICartItem[];

  constructor(private productService: ProductService, private router: Router) {
    this.productList = [];
    this.cartItems = [];
  }

  ngOnInit(): void {
    this.productService.getProductList().
      subscribe((data: IProduct) => {
        this.productList = Object.values(data);
      });
  }

  public addToCart(productItem: IProduct, quantity: string) {
    this.setProductItemTocart(productItem, Number(quantity));
  }

  public setProductItemTocart(productItem: IProduct, quantity: number) {
    this.productService.getCartItems().subscribe((data: ICartItem) => {
      this.cartItems = Object.values(data);

      const alreadyInCart = this.cartItems.findIndex((item) => item.productId === productItem.id);
      if (alreadyInCart !== -1) {
        const selectedItem = this.cartItems[alreadyInCart];
        selectedItem.quantity += 1;
        selectedItem.price = (Number(selectedItem.price) * selectedItem.quantity);

        this.productService.updateItemToCart(selectedItem, selectedItem?.id?.toString() || "").subscribe((data) => {
          
        });

      } else {
        const productTocart: ICartItem = {
          productId: productItem.id,
          userId: 1,
          quantity: quantity,
          price: Number(quantity * productItem.price),
          name: productItem.name,
          image: productItem.image,
          orderDate: this.productService.getDateTime(),
          description: productItem.description
        }

        this.productService.addItemToCart(productTocart).subscribe((data) => {
          const itemNext: number = this.productService.cartItemCountBadge + 1;
          this.productService.cartItemCount.next(itemNext);
        })
      }
    })
  }

}
