export interface Course {
  _id?: string;
  title: string;
  description: string;
  instructor?: { _id: string; name: string }; // Populated instructor name
  students?: string[]; // Array of enrolled student IDs
  image: string;
  price: number;
  createdAt?: Date;
  label?: string; // Optional label (e.g., "Popular")
  labelColor?: string; // Optional label color (e.g., "red")
}
