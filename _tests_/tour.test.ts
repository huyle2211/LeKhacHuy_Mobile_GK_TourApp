
import {
  groupByCity,
  formatDate,
  getSeatLabel,
  Tour,
} from "../utils/tour";

const mockTours: Tour[] = [
  {
    id: "1",
    name: "Tour Đà Lạt tháng 11",
    city: "Đà Lạt",
    days: 3,
    price: 3590000,
    seats: 5,
    departure: "2026-11-10",
    image: "https://example.com/dalat.jpg",
    isFavorite: true,
  },
  {
    id: "2",
    name: "Tour Hà Nội mùa thu",
    city: "Hà Nội",
    days: 2,
    price: 2500000,
    seats: 0,
    departure: "2026-11-05",
    image: "https://example.com/hanoi.jpg",
    isFavorite: false,
  },
  {
    id: "3",
    name: "Tour Đà Lạt săn mây",
    city: "Đà Lạt",
    days: 4,
    price: 4200000,
    seats: 3,
    departure: "2026-11-05",
    image: "https://example.com/cloud.jpg",
    isFavorite: false,
  },
  {
    id: "4",
    name: "Tour Đà Nẵng biển xanh",
    city: "Đà Nẵng",
    days: 3,
    price: 3200000,
    seats: 4,
    departure: "2026-11-08",
    image: "https://example.com/danang.jpg",
    isFavorite: true,
  },
];

describe("groupByCity", () => {
  test("nhóm tour theo thành phố và sắp xếp tên thành phố A-Z", () => {
    const result = groupByCity(mockTours);

    expect(result).toHaveLength(3);

    expect(result.map((section) => section.title)).toEqual([
      "Đà Lạt",
      "Đà Nẵng",
      "Hà Nội",
    ]);
  });

  test("sắp xếp ngày khởi hành tăng dần trong cùng thành phố", () => {
    const result = groupByCity(mockTours);

    const dalat = result.find(
      (section) => section.title === "Đà Lạt"
    );

    expect(dalat?.data.map((tour) => tour.departure)).toEqual([
      "2026-11-05",
      "2026-11-10",
    ]);
  });

  test("trả về mảng rỗng nếu không có tour", () => {
    expect(groupByCity([])).toEqual([]);
  });
});

describe("formatDate", () => {
  test('đổi "2026-11-05" thành "05/11/2026"', () => {
    expect(formatDate("2026-11-05")).toBe("05/11/2026");
  });
});

describe("getSeatLabel", () => {
  test("0 chỗ trả về Hết chỗ", () => {
    expect(getSeatLabel(0)).toBe("Hết chỗ");
  });

  test("3 chỗ trả về Chỉ còn 3 chỗ", () => {
    expect(getSeatLabel(3)).toBe("Chỉ còn 3 chỗ");
  });

  test("4 chỗ trả về Còn 4 chỗ", () => {
    expect(getSeatLabel(4)).toBe("Còn 4 chỗ");
  });
});
