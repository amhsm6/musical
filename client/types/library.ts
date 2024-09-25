export type Album = {
    title: string | null,
    artist: string | null,
    tracks: Track[]
};

export type Track = {
    id: number,
    name: string,
    artist: string | null,
    track_number: number,
    track_total: number,
    disc_number: number,
    disc_total: number
};
