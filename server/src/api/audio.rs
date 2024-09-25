use std::sync::Arc;
use tokio::sync::Mutex;
use axum::routing;
use axum::routing::Router;
use axum::extract::{State, Query};
use diesel::prelude::*;
use diesel::pg::PgConnection;

async fn query(conn: State<Arc<Mutex<PgConnection>>>, query: Query<String>) -> String {
    let mut conn = conn.lock().await;

    tokio::time::sleep(tokio::time::Duration::from_millis(1509)).await;

    let albums = crate::schema::audio::table
        .filter(crate::schema::audio::album.is_not_null())
        .select(crate::schema::audio::album.assume_not_null())
        .distinct()
        .load::<String>(&mut *conn)
        .unwrap();
        
    serde_json::to_string(&albums).unwrap()
}

pub fn router() -> Router<Arc<Mutex<PgConnection>>> {
    Router::new()
        .route("/query", routing::get(query))
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
