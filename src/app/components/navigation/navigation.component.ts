import { Component, OnInit } from '@angular/core';
import { NavigationLinkI } from '../../models/navigation-link.inteface';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  navigationLinks: NavigationLinkI[] = [
    {
      label: 'Market View',
      path: ''
    },
    {
      label: 'Order Depth',
      path: 'order-depth'
    },
    {
      label: 'Market Trades',
      path: 'market-trades'
    },
    {
      label: 'Order Entry',
      path: 'order-entry'
    },
    {
      label: 'My Orders',
      path: 'my-orders'
    },
    {
      label: 'My Trades',
      path: 'my-trades'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
