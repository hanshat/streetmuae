import { homePlaylists } from "@/utils/playlists";
import CardCollection from "@/components/CardCollection";
import { topArtist } from "@/utils/topArtists";

export default function Home() {
  return (
    <div className="inner-container flex flex-col gap-6">
      {homePlaylists.map((item) => (
        <CardCollection
          key={item.id}
          id={item.id}
          title={item.title}
          type="song"
        />
      ))}

      <CardCollection title="Popular Artists" type="artist" />
    </div>
  );
}
