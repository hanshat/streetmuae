export interface PlaylistData {
  id: string;
  name: string;
  description: string;
  type: string;
  year: null;
  playCount: null;
  language: string;
  explicitContent: boolean;
  url: string;
  songCount: number;
  artists: Artist[];
  image: Image[];
  songs: TSong[];
}

export interface Artist {
  id: string;
  name: string;
  role: Role;
  image: Image[];
  type: ArtistType;
  url: string;
}

export interface Image {
  quality: "50x50" | "150x150" | "500x500";
  url: string;
}
export interface DownloadUrl {
  quality: "12kbps" | "160kbps" | "96kbps" | "48kbps" | "320kbps";
  url: string;
}

export enum Role {
  Lyricist = "lyricist",
  Music = "music",
  PrimaryArtists = "primary_artists",
  Singer = "singer",
}

export enum ArtistType {
  Artist = "artist",
}

export interface TSong {
  id: string;
  name: string;
  type: "song";
  year: string;
  releaseDate: Date;
  duration: number;
  label: string;
  explicitContent: boolean;
  playCount: number;
  language: string;
  hasLyrics: boolean;
  lyricsId: null;
  url: string;
  copyright: string;
  album: Album;
  artists: Artists;
  image: Image[];
  downloadUrl: DownloadUrl[];
}

export interface Album {
  id: string;
  name: string;
  url: string;
}

export interface Artists {
  primary: Artist[];
  featured: any[];
  all: Artist[];
}

export interface SearchSongs {
  results: TSong[];
}

export interface Data<T> {
  success: boolean;
  data: T;
}

export interface TPlaylists extends Data<PlaylistData> {}
export interface TSongs extends Data<TSong[]> {}
export interface TSearchSongs extends Data<SearchSongs> {}
