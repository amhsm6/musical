CREATE TABLE audio (
    id SERIAL PRIMARY KEY,
    path VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    album VARCHAR,
    artist VARCHAR,
    album_artist VARCHAR,
    track_number INTEGER,
    track_total INTEGER,
    disc_number INTEGER,
    disc_total INTEGER
);
