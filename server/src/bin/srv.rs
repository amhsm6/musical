use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::net::TcpListener;
use axum::Router;
use diesel::prelude::*;
use diesel::pg::PgConnection;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().unwrap();

    let dburl = std::env::var("DATABASE_URL").unwrap();
    let conn = PgConnection::establish(&dburl).unwrap();
    let state = Arc::new(Mutex::new(conn));

    println!("Server is running on port 3015");

    let router = Router::new()
        .nest("/api/audio", musical::api::audio::router())
        .with_state(state);

    let listener = TcpListener::bind("0.0.0.0:3015").await.unwrap();
    axum::serve(listener, router).await.unwrap();
}
