export interface Workspace {
  _id: string;
  title: string;
  address: string;
  city: string;
  area: string;
  floor: string;
  squareFeet: number;
  seats: number;
  pricePerSeat: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  type: string[];
  createdAt: string;
  updatedAt: string;
}
