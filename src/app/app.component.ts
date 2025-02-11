import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail/detail.component';
interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,DetailComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  hideDropdowns = false;
  contactsForm = new FormGroup({
    name: new FormControl<string>(''),
    email: new FormControl<string | null>(null),
    phone: new FormControl<string>(''),
    favorite: new FormControl<boolean>(false)
    
  });

  contacts$: Observable<Contact[]> | undefined;
  contacts: Contact[] = []; 
  selectedRow: Contact | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.contacts$ = this.getContacts();
  }

  onFormSubmit(): void {
    const addContactRequest = {
      name: this.contactsForm.value.name,
      email: this.contactsForm.value.email,
      phone: this.contactsForm.value.phone,
      favorite: this.contactsForm.value.favorite,
    };

    this.http.post('https://localhost:7107/api/Contacts', addContactRequest)
      .pipe(
        catchError(error => {
          console.error('Error adding contact:', error);
          return [];
        })
      )
      .subscribe({
        next: () => {
          console.log('Contact added successfully.');
          this.contacts$ = this.getContacts();
          this.contactsForm.reset();
        },
        error: err => {
          console.error('Error:', err);
        }
      });
  }

  onDelete(id: string): void {
    this.http.delete(`https://localhost:7107/api/Contacts/${id}`)
      .subscribe({
        next: () => {
          alert('Contact deleted successfully.');
          this.contacts$ = this.getContacts();
        },
        error: err => {
          console.error('Error deleting contact:', err);
        }
      });
  }

  selectRow(contact: Contact): void {
    console.log('Row clicked:', contact); 
    this.selectedRow = contact;
  }
  
  isSelected(contact: Contact): boolean {
    return this.selectedRow === contact;
  }

  private getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('https://localhost:7107/api/Contacts');
  }
  onMainDropdownChange(event: any) {
    const selectedValue = event.target.value;
    this.hideDropdowns = selectedValue === 'hide';
  }
  speak() {
    var textElement = document.getElementById('input') as HTMLInputElement;
   // if (textElement) {
        var text = textElement.value;
        var utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    //} else {
       // console.error("Element with the specified ID not found.");
    //}
}
}
