use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::net::TcpListener;
use axum::Router;
use axum::extract::Request;
use axum::middleware::Next;
use axum::response::Response;
use diesel::prelude::*;
use diesel::pg::PgConnection;

async fn nocors(req: Request, next: Next) -> Response {
    let mut resp = next.run(req).await;
    resp.headers_mut().insert(http::header::ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());
    resp
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().unwrap();

    let dburl = std::env::var("DATABASE_URL").unwrap();
    let conn = PgConnection::establish(&dburl).unwrap();
    let state = Arc::new(Mutex::new(conn));

    println!("Server is running on port 3015");

    let router = Router::new()
        .nest("/api/audio", musical::api::audio::router())
        .with_state(state)
        .layer(axum::middleware::from_fn(nocors));

    let listener = TcpListener::bind("0.0.0.0:3015").await.unwrap();
    axum::serve(listener, router).await.unwrap();
}
