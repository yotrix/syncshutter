export enum PaymentStatus {
  Paid = "Paid",
  Pending = "Pending",
}

export interface Event {
  id: string;
  clientName: string;
  eventType: string;
  eventStartDate: string; // ISO string format
  eventEndDate: string; // ISO string format
  location: string;
  phone: string;
  payment: number;
  paymentStatus: PaymentStatus;
  notes: string;
  needsVideography: boolean;
  videographyStartDate?: string; // ISO string format
  videographyEndDate?: string; // ISO string format
}