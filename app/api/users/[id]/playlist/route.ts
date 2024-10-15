import Users from "@/models/users";
import connectDB from "@/utils/db";
import { NextResponse, type NextRequest } from "next/server";

interface RequestBody {
  songIds: string[];
  title: string;
  visibility?: "public" | "private";
  playlistId?: string;
  isFullDeletePlaylist?: boolean;
}

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { songIds, title, visibility }: RequestBody = await request.json();

  try {
    if (songIds.length < 0 || title.length < 0) {
      return NextResponse.json(
        { error: "The songIds must be an array and title must be a string" },
        { status: 400 }
      );
    }
    await connectDB();

    const user = await Users.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    }

    const isPlaylistTitleExist = user.playlist.some((item: { title: string }) =>
      title.toLowerCase().includes(item.title.toLowerCase())
    );
    if (isPlaylistTitleExist) {
      return NextResponse.json(
        { error: "Playlist title already exist" },
        { status: 404 }
      );
    }

    user.playlist.push({ title, songIds, visibility });
    await user.save();

    return NextResponse.json(
      { message: "Playlist created successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    await connectDB();

    const user = await Users.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    }

    const playlist = user.playlist;

    return NextResponse.json(playlist, { status: 200 });
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { songIds, playlistId, visibility }: RequestBody = await request.json();

  try {
    if (!Array.isArray(songIds) || typeof playlistId !== "string") {
      return NextResponse.json(
        {
          error: "The songIds must be an array and playlistId must be a string",
        },
        { status: 400 }
      );
    }
    await connectDB();

    const user = await Users.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    }
    const playlist = user.playlist.find(
      (item: { id: string }) => item.id === playlistId
    );
    if (!playlist) {
      return NextResponse.json(
        { error: "Playlist does not exist" },
        { status: 404 }
      );
    }

    if (visibility) {
      playlist.visibility = visibility;
      await user.save();

      return NextResponse.json(
        {
          message: `Playlist visibility change to ${visibility}`,
          updatedPlaylist: user.playlist,
        },
        { status: 200 }
      );
    }

    const duplicateSongs = songIds.filter((songId) =>
      playlist.songIds.includes(songId)
    );

    if (duplicateSongs.length > 0) {
      return NextResponse.json(
        {
          error: `The following song IDs already exist in the playlist: ${duplicateSongs.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }
    playlist.songIds = [...playlist.songIds, ...songIds];
    await user.save();

    return NextResponse.json(
      {
        message: "Playlist updated successfully",
        updatedPlaylist: user.playlist,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { songIds, playlistId, isFullDeletePlaylist }: RequestBody =
    await request.json();

  try {
    if (!Array.isArray(songIds) || typeof playlistId !== "string") {
      return NextResponse.json(
        {
          error: "The songIds must be an array and playlistId must be a string",
        },
        { status: 400 }
      );
    }
    await connectDB();
    const user = await Users.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    }

    if (isFullDeletePlaylist) {
      // delete complete playlist
      user.playlist = user.playlist.filter(
        (item: { id: string }) => item.id !== playlistId
      );
      await user.save();

      return NextResponse.json(
        {
          message: "Playlist deleted successfully",
          updatedPlaylist: user.playlist,
        },
        { status: 200 }
      );
    }

    const playlist = user.playlist.find(
      (item: { id: string }) => item.id === playlistId
    );
    if (!playlist) {
      return NextResponse.json(
        { error: "Playlist does not exist" },
        { status: 404 }
      );
    }

    playlist.songIds = playlist.songIds.filter(
      (songId: string) => !songIds.includes(songId)
    );
    await user.save();

    return NextResponse.json(
      {
        message: "Playlist song(s) deleted successfully",
        updatedPlaylist: user.playlist,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
