
export type Tour = {
  id: string;
  name: string;
  city: string;
  days: number;
  price: number;
  seats: number;
  departure: string;
  image: string;
  isFavorite: boolean;
};

export type TourSection = {
  title: string;
  data: Tour[];
};

export function groupByCity(tours: Tour[]): TourSection[] {
  const cities = [...new Set(tours.map((tour) => tour.city))].sort(
    (a, b) => a.localeCompare(b, "vi")
  );

  return cities
    .map((city) => ({
      title: city,
      data: tours
        .filter((tour) => tour.city === city)
        .sort((a, b) => a.departure.localeCompare(b.departure)),
    }))
    .filter((section) => section.data.length > 0);
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function getSeatLabel(seats: number): string {
  if (seats === 0) return "Hết chỗ";
  if (seats <= 3) return `Chỉ còn ${seats} chỗ`;
  return `Còn ${seats} chỗ`;
}
