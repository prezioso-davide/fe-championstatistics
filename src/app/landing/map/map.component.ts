import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { TeamService } from '../service/team.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnChanges, AfterViewInit {

  @Input() countriesTarget: any[];

  map: L.Map;
  countriesLayer: L.GeoJSON;
  private countryMarkersMap: { [countryName: string]: L.Marker[] } = {};

  constructor(
    private _http: HttpClient,
    private _teamService: TeamService
  ) { }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

    if (changes.countriesTarget && changes.countriesTarget.currentValue) {

      if (this.countriesLayer) {
        this.countriesLayer.eachLayer((layer: L.Layer) => {
          this.countriesLayer.resetStyle(layer);
        });
      }
  
      const countryNames = changes.countriesTarget.currentValue.map(country => country.name);
      const layers = this.countriesLayer.getLayers();
      layers.forEach((layer: any) => {
        const countryName = layer.feature.properties.name;
        if (countryNames.includes(countryName)) {
          layer.setStyle(this.getHighlightedCountryStyle());
        } else {
          layer.setStyle(this.getDefaultCountryStyle())
        }
      });
    }
  }

  addStadiumMarkers(countryName: string, stadiums: any[]): void {
    const markers: L.Marker[] = [];
  
    stadiums.forEach(stadium => {
      const teamsData$ = this._teamService.getAllTeamsByStadiumId(stadium.id).subscribe({
        next: (data) => {
          const teamNames = data.map(team => team.teamName).join(', '); // Ottieni i nomi delle squadre e li unisci con una virgola
          const popupContent = `${stadium.stadiumName}<br> Squ: ${teamNames}`; 

          const marker = L.marker([stadium.latitude, stadium.longitude])
            .bindPopup(popupContent)
            .addTo(this.map);
          markers.push(marker);
        }
      })

      
    });
  
    this.countryMarkersMap[countryName] = markers;
  }
  
  clearStadiumMarkers(countryName: string): void {
    const markersToRemove = this.countryMarkersMap[countryName];
    if (markersToRemove) {
      markersToRemove.forEach(marker => marker.remove());
      delete this.countryMarkersMap[countryName];
    }
  }
  

  private initializeMap(): void {
    this.map = L.map('map-leaf').setView([51.505, 10], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.addCountriesLayer();

  }

  private addCountriesLayer(): void {
    this._http.get('assets/landing/custom.geo.json').subscribe((data: any) => {
      this.countriesLayer = L.geoJSON(data, {
        style: this.getDefaultCountryStyle(),
      }).addTo(this.map);
    });
  }

  private getDefaultCountryStyle(): any {
    return {
      weight: 0,
      opacity: 1,
      color: '#e0e0e0',
      fillOpacity: 0.2
    };
  }

  private getHighlightedCountryStyle(): any {
    return {
      weight: 2,
      opacity: 1,
      color: '#ff0000',
      dashArray: '3',
      fillOpacity: 0.2
    };
  }

}
