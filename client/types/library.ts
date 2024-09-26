export type QueryResult = {
    [album_title: string]: Album
};

export type Album = {
    tracks: Track[]
};

export type Track = {
    id: number,
    title: string
};
