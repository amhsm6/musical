use musical::meta::AudioMetadata;
use musical::models::NewAudioTrack;

use std::iter;
use std::path::Path;
use std::fs::{File, DirEntry};
use diesel::prelude::*;
use diesel::pg::PgConnection;

fn traverse<P: AsRef<Path>>(path: P) -> Box<dyn Iterator<Item = DirEntry>> {
    Box::new(
        std::fs::read_dir(path).unwrap()
            .map(|x| x.unwrap())
            .flat_map(|x| if x.file_type().unwrap().is_dir() { traverse(x.path()) } else { Box::new(iter::once(x)) })
    )
}

fn main() {
    dotenvy::dotenv().unwrap();

    let dburl = std::env::var("DATABASE_URL").unwrap();
    let mut conn = PgConnection::establish(&dburl).unwrap();

    traverse("db")
        .flat_map(|entry| {
            let path = entry.path().to_str().unwrap().to_string();
            let filename = entry.path().file_stem().unwrap().to_str().unwrap().to_string();

            let src = Box::new(File::open(&path).unwrap());
            AudioMetadata::extract(src)
                .inspect_err(|e| eprintln!("error: {path}: {e}"))
                .map(|meta| (path, filename, meta))
        })
        .for_each(|(path, filename, meta)| {
            let new_track = NewAudioTrack {
                path,
                title: meta.title.unwrap_or(filename),
                album: meta.album,
                artist: meta.artist,
                album_artist: meta.album_artist,
                track_number: meta.track_number,
                track_total: meta.track_total,
                disc_number: meta.disc_number,
                disc_total: meta.disc_total
            };

            diesel::insert_into(musical::schema::audio::table)
                .values(new_track)
                .execute(&mut conn)
                .unwrap();
        });
}
