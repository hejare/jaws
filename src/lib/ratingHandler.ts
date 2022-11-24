import { getRatingsForDailyRun } from "../db/ratingsEntity";
import { RatingDataType } from "../db/ratingsMeta";
import { BreakoutWithRatingDataType } from "../db/breakoutsEntity";

export const getRatingsForDailyRunAndUser = async (
  breakoutRef: string,
  userRef: string,
) => {
  const ratingsForAllUsers = await getRatingsForDailyRun(breakoutRef);
  return ratingsForAllUsers.filter(
    (rating: RatingDataType) => rating.userRef === userRef,
  );
};

export const extendBreakoutsWithRatings = (
  breakouts: BreakoutWithRatingDataType[],
  ratings: RatingDataType[],
) => {
  ratings.forEach((rating) => {
    breakouts.find((element) => {
      if (element._ref === rating.breakoutRef) {
        element.rating = rating.value;
        return true;
      }
      return false;
    });
  });
  return breakouts;
};
