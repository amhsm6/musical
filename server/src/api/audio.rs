use crate::models::AudioTrack;

use std::sync::Arc;
use std::collections::HashMap;
use tokio::io::AsyncReadExt;
use tokio::sync::Mutex;
use tokio::fs::File;
use serde::{Serialize, Deserialize};
use axum::routing;
use axum::routing::Router;
use axum::body::Body;
use axum::extract::{Path, Query, State};
use diesel::prelude::*;
use diesel::pg::PgConnection;
use symphonia::core::io::MediaSourceStream;

#[derive(Deserialize)]
struct QueryParams {
    q: Option<String>
}

type QueryResult = HashMap<String, QueryAlbum>;

#[derive(Serialize)]
struct QueryAlbum {
    album_artist: Option<String>,
    tracks: Vec<AudioTrack>
}

async fn query(conn: State<Arc<Mutex<PgConnection>>>, Query(query): Query<QueryParams>) -> String {
    let conn = &mut *conn.lock().await;

    let query = query.q.unwrap_or("".to_string());
    let query = query.split_whitespace().flat_map(|x| vec!["%", x]).collect::<String>() + "%";

    let mut result: QueryResult = HashMap::new();

    crate::schema::audio::table
        .filter(
            crate::schema::audio::title.ilike(&query)
                .or(crate::schema::audio::album.ilike(&query))
        )
        .order_by((crate::schema::audio::disc_number.asc(), crate::schema::audio::track_number.asc()))
        .select(AudioTrack::as_select())
        .load(conn)
        .unwrap()
        .into_iter()
        .for_each(|track| {
            let album_title = track.album.as_deref().unwrap_or("");

            if !result.contains_key(album_title) {
                result.insert(album_title.to_string(), QueryAlbum { album_artist: track.album_artist.clone(), tracks: Vec::new() });
            }

            result.get_mut(album_title).unwrap().tracks.push(track);
        });

    serde_json::to_string(&result).unwrap()
}

async fn stream(conn: State<Arc<Mutex<PgConnection>>>, id: Path<i32>) -> Vec<u8> {
    let conn = &mut *conn.lock().await;
    let id = id.0;

    let path = crate::schema::audio::table
        .filter(crate::schema::audio::id.eq(id))
        .select(crate::schema::audio::path)
        .first::<String>(conn).unwrap();

    let mut src = File::open(path).await.unwrap();
    /*let mss = MediaSourceStream::new(Box::new(src), Default::default());

    let probe = symphonia::default::get_probe()
        .format(
            &Default::default(),
            mss,
            &Default::default(),
            &Default::default()
        )
        .unwrap();
    let fr = probe.format;

    let track = fr.default_track().unwrap();

    let sample_rate = track.codec_params.sample_rate.unwrap();
    let numsamples  = track.codec_params.n_frames.unwrap();
    let channels  = track.codec_params.channels.unwrap().count();
    let bitdepth    = track.codec_params.bits_per_sample.unwrap();

    let decoder = symphonia::default::get_codecs()
        .make(&track.codec_params, &Default::default())
        .unwrap();*/
    let mut buf = Vec::new();
    src.read_to_end(&mut buf).await.unwrap();

    buf
}

pub fn router() -> Router<Arc<Mutex<PgConnection>>> {
    Router::new()
        .route("/query", routing::get(query))
        .route("/stream/:id", routing::get(stream))
}
