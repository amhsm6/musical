// @generated automatically by Diesel CLI.

diesel::table! {
    audio (id) {
        id -> Int4,
        path -> Varchar,
        title -> Varchar,
        album -> Nullable<Varchar>,
        artist -> Nullable<Varchar>,
        album_artist -> Nullable<Varchar>,
        track_number -> Nullable<Int4>,
        track_total -> Nullable<Int4>,
        disc_number -> Nullable<Int4>,
        disc_total -> Nullable<Int4>,
    }
}
