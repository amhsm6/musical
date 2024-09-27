use diesel::prelude::*;

#[derive(Insertable)]
#[diesel(table_name = crate::schema::audio)]
pub struct NewAudioTrack {
    pub path: String,
    pub title: String,
    pub album: Option<String>,
    pub artist: Option<String>,
    pub album_artist: Option<String>,
    pub track_number: Option<i32>,
    pub track_total: Option<i32>,
    pub disc_number: Option<i32>,
    pub disc_total: Option<i32>
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::audio)]
pub struct AudioTrack {
    pub id: i32,
    pub title: String,
    pub album: Option<String>,
    pub artist: Option<String>,
    pub album_artist: Option<String>,
    pub track_number: Option<i32>,
    pub track_total: Option<i32>,
    pub disc_number: Option<i32>,
    pub disc_total: Option<i32>
}
