import prisma from "@/app/lib/prismadb";
import { Prisma } from "@prisma/client";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
    } = params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Prisma.ListingWhereInput = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    // we will query roomCount the user search for or more not less
    if (roomCount) {
      query.roomCount = {
        gte: +roomCount,
        // gte stands for "greater than or equal to."
      };
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    // create a filter for our dateRange
    // we want to filter out all listings which have a reservation in our desired date range
    if (startDate && endDate) {
      // query.Not specifies that we want to exclude certain records based on the nested conditions.
      query.NOT = {
        reservations: {
          // specifies that we want to exclude records where some reservations overlap with the requested date range.
          some: {
            // The OR operator allows for multiple overlapping conditions to be checked, and if any of these conditions are met, the record is excluded.
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: endDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }
}
