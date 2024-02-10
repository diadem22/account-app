import UserA from '../models/userA';

export async function createUserData(payload: {
  numberOfProducts: number;
  numberOfUsers: number;
  companyName: string;
  user_id: number;
}) {
  try {
    const percentage = (payload.numberOfUsers / payload.numberOfProducts) * 100;

    const newUserA = await UserA.create({
      numberOfProducts: payload.numberOfProducts,
      numberOfUsers: payload.numberOfUsers,
      companyName: payload.companyName,
      user_id: payload.user_id,
      percentage: percentage,
    });

    return newUserA;
  } catch (ex) {
    console.error(ex);
    throw ex;
  }
}
