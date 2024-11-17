import prisma from "@/app/lib/prismadb";

interface IParams {
  listingId?: string;
  userId?: string;
  autherId?: string;
}

export default async function getReservations(params: IParams) {
  try {
    const { listingId, userId, autherId } = params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    // find all reservations for this single listing we are looking at
    if (listingId) {
      query.listingId = listingId;
    }

    // find all the trips the user has
    if (userId) {
      query.userId = userId;
    }

    // find all the reservations that other users made for our listings
    if (autherId) {
      query.listing = { userId: autherId };
    }

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeReservations = reservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt.toISOString(),
      },
    }));

    return safeReservations;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }
}
