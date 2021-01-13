import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/product/services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public itemsIncart: number = 0;

  constructor(public productService: ProductService) { }

  ngOnInit(): void {
    
    this.productService.cartItemCount.subscribe((data) => {
      this.productService.cartItemCountBadge = data;
    })

    this.productService.getCartItems().subscribe((data: any) => {
      this.productService.cartItemCount.next(data.length > 0 ? data.length : 0);
    })

  }

}
