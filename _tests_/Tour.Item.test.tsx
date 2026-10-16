
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TourItem from "../components/TourItem";
import { Tour } from "../utils/tour";

const tour: Tour = {
  id: "tour-1",
  name: "Đà Lạt mộng mơ",
  city: "Đà Lạt",
  days: 3,
  price: 3590000,
  seats: 2,
  departure: "2026-11-05",
  image: "https://example.com/tour.jpg",
  isFavorite: false,
};

describe("TourItem", () => {
  const onPress = jest.fn();
  const onToggleFavorite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("compact không hiển thị thành phố", () => {
    const { queryByText } = render(
      <TourItem
        tour={tour}
        compact
        onPress={onPress}
        onToggleFavorite={onToggleFavorite}
      />
    );

    expect(queryByText("Đà Lạt")).toBeNull();
  });

  it("không compact thì hiển thị thành phố", () => {
    const { getByText } = render(
      <TourItem
        tour={tour}
        onPress={onPress}
        onToggleFavorite={onToggleFavorite}
      />
    );

    expect(getByText("Đà Lạt")).toBeTruthy();
  });

  it("nhấn tim gọi callback đúng một lần và không mở thẻ", () => {
    const { getByTestId } = render(
      <TourItem
        tour={tour}
        onPress={onPress}
        onToggleFavorite={onToggleFavorite}
      />
    );

    fireEvent.press(getByTestId("fav-btn"));

    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    expect(onToggleFavorite).toHaveBeenCalledWith("tour-1", true);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("nhấn tên tour gọi onPress với đúng object tour", () => {
    const { getByText } = render(
      <TourItem
        tour={tour}
        onPress={onPress}
        onToggleFavorite={onToggleFavorite}
      />
    );

    fireEvent.press(getByText("Đà Lạt mộng mơ"));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(tour);
  });
});
