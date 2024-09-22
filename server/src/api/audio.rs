use std::sync::Arc;
use tokio::sync::Mutex;
use axum::routing;
use axum::routing::Router;
use axum::extract::{Path, State};
use diesel::prelude::*;
use diesel::pg::PgConnection;

async fn get_albums(conn: State<Arc<Mutex<PgConnection>>>) -> String {
    let mut conn = conn.lock().await;

    let albums = crate::schema::audio::table
        .filter(crate::schema::audio::album.is_not_null())
        .select(crate::schema::audio::album.assume_not_null())
        .distinct()
        .load::<String>(&mut *conn)
        .unwrap();
        
    serde_json::to_string(&albums).unwrap()
}

async fn get_album(conn: State<Arc<Mutex<PgConnection>>>, id: Path<i32>) -> String {
    // let mut conn = conn.lock().await;
    let id = *id;

    format!("{id}")
}

pub fn router() -> Router<Arc<Mutex<PgConnection>>> {
    Router::new()
        .route("/albums", routing::get(get_albums))
        .route("/album/:id", routing::get(get_album))
}

//        .route("/track/{id}", web::get().to(get_track))
    /*let src = File::open(filename).unwrap();
    let mss = MediaSourceStream::new(Box::new(src), Default::default());

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
    let channels    = track.codec_params.channels.unwrap().count();
    let bitdepth    = track.codec_params.bits_per_sample.unwrap();

    let decoder = symphonia::default::get_codecs()
        .make(&track.codec_params, &Default::default())
        .unwrap();

    format!("{} {} {} {}", sample_rate, numsamples, channels, bitdepth)*/
