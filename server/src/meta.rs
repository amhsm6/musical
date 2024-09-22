use std::error::Error;
use symphonia::core::io::{MediaSourceStream, MediaSource};
use symphonia::core::meta::{Metadata, MetadataRevision, Tag, StandardTagKey, Value};

#[derive(Default)]
pub struct AudioMetadata {
    pub title: Option<String>,
    pub album: Option<String>,
    pub artist: Option<String>,
    pub album_artist: Option<String>,
    pub track_number: Option<i32>,
    pub track_total: Option<i32>,
    pub disc_number: Option<i32>,
    pub disc_total: Option<i32>
}

impl AudioMetadata {
    pub fn extract(source: Box<dyn MediaSource>) -> Result<AudioMetadata, Box<dyn Error>> {
        let mss = MediaSourceStream::new(source, Default::default());

        let mut probed = symphonia::default::get_probe()
            .format(
                &Default::default(),
                mss,
                &Default::default(),
                &Default::default()
            )?;

        let mut metadata = AudioMetadata::default();

        probed.metadata.get()
            .into_iter()
            .for_each(|mut meta| metadata.update_meta(&mut meta));

        metadata.update_meta(&mut probed.format.metadata());

        Ok(metadata)
    }

    fn update_meta(&mut self, meta: &mut Metadata) {
        while !meta.is_latest() {
            let rev = meta.pop().unwrap();
            self.update_rev(&rev);
        }

        meta.current()
            .into_iter()
            .for_each(|rev| self.update_rev(rev));
    }

    fn update_rev(&mut self, rev: &MetadataRevision) {
        rev.tags()
            .into_iter()
            .for_each(|tag| self.update_tag(tag));
    }

    fn update_tag(&mut self, tag: &Tag) {
        match (tag.std_key, &tag.value) {
            (Some(StandardTagKey::TrackTitle),  Value::String(ref x))   => self.title        = Some(x.clone()),
            (Some(StandardTagKey::Album),       Value::String(ref x))   => self.album        = Some(x.clone()),
            (Some(StandardTagKey::Artist),      Value::String(ref x))   => self.artist       = Some(x.clone()),
            (Some(StandardTagKey::AlbumArtist), Value::String(ref x))   => self.album_artist = Some(x.clone()),

            (Some(StandardTagKey::TrackNumber), &Value::SignedInt(x))   => self.track_number = Some(x as i32),
            (Some(StandardTagKey::TrackTotal),  &Value::SignedInt(x))   => self.track_total  = Some(x as i32),
            (Some(StandardTagKey::DiscNumber),  &Value::SignedInt(x))   => self.disc_number  = Some(x as i32),
            (Some(StandardTagKey::DiscTotal),   &Value::SignedInt(x))   => self.disc_total   = Some(x as i32),

            (Some(StandardTagKey::TrackNumber), &Value::UnsignedInt(x)) => self.track_number = Some(x as i32),
            (Some(StandardTagKey::TrackTotal),  &Value::UnsignedInt(x)) => self.track_total  = Some(x as i32),
            (Some(StandardTagKey::DiscNumber),  &Value::UnsignedInt(x)) => self.disc_number  = Some(x as i32),
            (Some(StandardTagKey::DiscTotal),   &Value::UnsignedInt(x)) => self.disc_total   = Some(x as i32),

            (Some(StandardTagKey::TrackNumber), Value::String(ref x)) if x.parse::<i32>().is_ok() => self.track_number = Some(x.parse().unwrap()),
            (Some(StandardTagKey::TrackTotal),  Value::String(ref x)) if x.parse::<i32>().is_ok() => self.track_total  = Some(x.parse().unwrap()),
            (Some(StandardTagKey::DiscNumber),  Value::String(ref x)) if x.parse::<i32>().is_ok() => self.disc_number  = Some(x.parse().unwrap()),
            (Some(StandardTagKey::DiscTotal),   Value::String(ref x)) if x.parse::<i32>().is_ok() => self.disc_total   = Some(x.parse().unwrap()),

            (Some(StandardTagKey::TrackNumber), Value::String(ref x)) => {
                let data = x.split('/')
                    .map(|x| x.parse())
                    .collect::<Vec<Result<i32, _>>>();

                match data[..] {
                    [Ok(num), Ok(total)] => {
                        self.track_number = Some(num);
                        self.track_total = Some(total);
                    }

                    _ => {}
                }
            }

            (Some(StandardTagKey::DiscNumber), Value::String(ref x)) => {
                let data = x.split('/')
                    .map(|x| x.parse())
                    .collect::<Vec<Result<i32, _>>>();

                match data[..] {
                    [Ok(num), Ok(total)] => {
                        self.disc_number = Some(num);
                        self.disc_total = Some(total);
                    }

                    _ => {}
                }
            }

            _ => {}
        }
    }
}
