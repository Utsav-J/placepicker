import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

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
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isFetching.set(true);
      const placesSubscription  = this.httpClient.get<{places: Place[]}>
      ("http://localhost:3000/places")
      .pipe(map((response)=>response.places), 
            catchError(
              (error)=>throwError(()=>new Error('Backend returned 500'))
            )
      )
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
}
