import { Component, OnInit } from '@angular/core';
import { PaidServicesService } from 'src/app/Core/Services/paidServices/paid-services.service';

@Component({
  selector: 'app-paid-services',
  templateUrl: './paid-services.component.html',
  styleUrls: ['./paid-services.component.css']
})
export class PaidServicesComponent implements OnInit {

  activeTab: string = 'Doctor'; // الافتراضي
  providers: any[] = [];
  providersDoctor: any[] = [];


  // showModal
  showModal : boolean = false;


  constructor(private paidServices : PaidServicesService ) { }
  ngOnInit(): void {

    this.getAllProviders();
    this.getAllProvidersDriver();

  }


  // Get all providers
  getAllProviders(): void {
    this.paidServices.getAllProviders().subscribe({
      next: (res) => {
        console.log(res);
        this.providersDoctor = res.data;
      },
      error: (err) => {
        console.error('Error fetching providers:', err);
      }
    });
  }

  // Get all providers
  getAllProvidersDriver(): void {
    this.paidServices.getAllProvidersDriver().subscribe({
      next: (res) => {
        console.log(res);
        this.providers = res.data;
      },
      error: (err) => {
        console.error('Error fetching providers:', err);
      }
    });
  }


  trackBy(index: number, user: any): number {
    return user.id;
  }

  setActive(tab: string) {
    this.activeTab = tab;

  }

  selectedType: 'doctor' | 'driver' | null = null;


  // Open view modal
  selectedProvider: any = null;

  openViewModal(provider: any, type: 'doctor' | 'driver') {
    this.selectedProvider = provider;
    this.selectedType = type;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedProvider = null;
    this.selectedType = null;
  }

  showFullImage = false;
fullImageUrl: string | null = null;

openFullImage(url: string) {
  this.fullImageUrl = url;
  this.showFullImage = true;
}

closeFullImage() {
  this.showFullImage = false;
  this.fullImageUrl = null;
}


}
