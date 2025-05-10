import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  isFetching = signal<Boolean>(false);
  error = signal('');
  private placesService = inject(PlacesService);
  userPlaces = this.placesService.loadedUserPlaces;

  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription = this.placesService.loadUserPlaces()
    .subscribe({
      complete: ()=>{
        this.isFetching.set(false);
      }
    });  

    this.destroyRef.onDestroy(()=>{
        subscription.unsubscribe();
    });
  }

  onRemovePlace(place: Place) : void{
    const subscription = this.placesService.removeUserPlace(place).subscribe();
    
    this.destroyRef.onDestroy(()=>{
      subscription.unsubscribe();
    })
  }
}
