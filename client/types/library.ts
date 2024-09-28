export type QueryResult = {
    [album_title: string]: Album
};

export type Album = {
    album_artist: string,
    tracks: Track[]
};

export type Track = {
    id: number,
    title: string,
    album: string | null,
    artist: String | null,
    album_artist: string | null,
    track_number: number | null,
    track_total: number | null,
    disc_number: number | null,
    disc_total: number | null
};
