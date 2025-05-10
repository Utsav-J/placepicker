import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal<Boolean>(false);
  error = signal('');
  private destroyRef = inject(DestroyRef);
  private placesService = inject(PlacesService);
  ngOnInit(): void {
    this.isFetching.set(true);
      const placesSubscription  = this.placesService.loadAvailablePlaces()
      .subscribe({
        next: (places)=>{
          console.log(places);
          this.places.set(places);
        },
        error:(error:Error)=>{
          console.log(error);
          this.error.set(error.message);
        },
        complete:()=>{
          this.isFetching.set(false);
        }
      });
      
      this.destroyRef.onDestroy(()=>{
        placesSubscription.unsubscribe();
      })
  }

  onSelectPlace(selectedPlace : Place){
    const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace)
    .subscribe({
      next: ()=>{},
    });
    
    this.destroyRef.onDestroy(()=>{
      subscription.unsubscribe();
    })
  }
}
