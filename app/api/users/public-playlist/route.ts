import Users from "@/models/users";
import connectDB from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

// get single playlist with playlistid search param else get all playlist
export const GET = async (request: NextRequest) => {
  const playlistId = request.nextUrl.searchParams.get("playlistid");
  try {
    await connectDB();

    const users = await Users.find({}, { playlist: 1 });

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    let playlists;
    if (playlistId) {
      playlists = users.flatMap((user) =>
        user.playlist.filter(
          (item: { id: string; visibility: "public" | "private" }) =>
            item.id === playlistId && item.visibility === "public"
        )
      )[0];
    } else {
      playlists = users.flatMap((user) =>
        user.playlist.filter(
          (item: { visibility: "public" | "private" }) =>
            item.visibility === "public"
        )
      );
    }
    return NextResponse.json(playlists, {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
