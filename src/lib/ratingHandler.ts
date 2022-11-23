import { getRating } from "../db/ratingsEntity";

export const setUserRating = async (breakoutRef: string, rating: number) => {
  const userRef = "ludde@hejare.se";
  const existingRating = await getRating(breakoutRef, userRef);
  return;
};
