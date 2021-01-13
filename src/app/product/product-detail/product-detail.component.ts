import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/models/product';
import { ICartItem } from 'src/app/models/cart';
import { ProductService } from '../services/product.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  private productId: string | null;
  public productItemData: IProduct;
  public cartItems: ICartItem[];

  constructor(private productService: ProductService, private router: Router, private route: ActivatedRoute) {
    this.productId = this.route.snapshot.paramMap.get("id");
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
    this.productService.getProductList(this.productId?.toString()).subscribe((data => {
      this.productItemData = data;

      this.productService.getCartItems().subscribe((data: ICartItem) => {
        this.cartItems = Object.values(data);
        const alreadyInCart = this.cartItems.findIndex((item) => item.productId === this.productItemData.id);
        if (alreadyInCart !== -1) {
          const selectedItem = this.cartItems[alreadyInCart];
          this.productItemData.quantity = selectedItem.quantity;
          this.productItemData.price = Number(selectedItem.price);
        }
      });

    }));
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
        selectedItem.quantity = quantity;
        selectedItem.price = (Number(selectedItem.price) * selectedItem.quantity);

        this.productService.updateItemToCart(selectedItem, selectedItem?.id?.toString() || "").subscribe((data) => {
          this.router.navigateByUrl('/my-cart');
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
