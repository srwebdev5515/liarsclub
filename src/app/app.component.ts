import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';

import { MainService } from './services/main.service';
import { SocketService } from './services/socket.service';

declare var $: any;
@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})

export class AppComponent implements OnInit {
    location: Location;
    private isUsers = true;

    constructor(location: Location, private mainService: MainService, private router: Router, private socketService: SocketService) {
        this.location = location;

        router.events.subscribe((val: any) => {
          this.isUsers = val.url.includes('/users/');

          if (val instanceof NavigationStart) {
            this.mainService.validateUsertoken().subscribe(
              d => {
                if (d.type === false && !this.isUsers) {
                  this.router.navigate(['/users/login']);
                } else {
                  this.mainService.userRole = d.role;
                  this.mainService.userId = d.id;
                  this.socketService.sendMessage('userid', d.id);
                  this.mainService.username = d.name;
                }
                this.mainService.loading = false;
              },
              e => {
                this.mainService.loading = false;
                console.log(e);
                if (!this.isUsers) {
                  this.router.navigate(['/users/login']);
                }
              }
            );
          }
        });
    }

    ngOnInit() {
      $.getScript('../assets/js/init/initMenu.js');
      $.getScript('../assets/js/demo.js');
    }

    public isMap() {
        // console.log(this.location);
        if (this.location.prepareExternalUrl(this.location.path()) === '#/maps/fullscreen'){
            return true;
        } else {
            return false;
        }
    }
}
