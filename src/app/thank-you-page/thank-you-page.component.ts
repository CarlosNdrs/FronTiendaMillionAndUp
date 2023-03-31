import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../interfaces/order.interface';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-thank-you-page',
  templateUrl: './thank-you-page.component.html',
  styleUrls: ['./thank-you-page.component.scss']
})
export class ThankYouPageComponent implements OnInit {

  orderId:any;
  order:any;

  constructor(private route: ActivatedRoute, private dataService:DataService) { }

  ngOnInit(): void {

    this.orderId = this.route.snapshot.paramMap.get('orderId');

    this.dataService.getPurchaseInfo(this.orderId).subscribe( p => {
      this.order = p;
    })
  }

}
