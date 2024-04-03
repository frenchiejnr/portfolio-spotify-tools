export interface Listen {
  inserted_at: string;
  listened_at: number;
  recording_msid: string;
  track_metadata: {
    additional_info: {
      spotify_album_id: string;
      spotify_artist_ids: any;
      listening_from: string;
      release_mbid: string;
      artist_mbids: string[];
      artist_names?: string[];
      recording_mbid: string;
      tags: string[];
      artist_msid: string;
      origin_url: string;
      recording_msid: string;
      release_msid: string;
      work_mbids: string[];
      release_group_mbid: string;
      track_mbid: string;
      spotify_id: string;
      isrc: string;
      tracknumber: number;
    };
    artist_name: string;
    track_name: string;
    release_name: string;
  };
  user_name: string;
}

export interface Recent_Listens_Payload {
  payload: {
    count: number;
    listens: Listen[];
    user_list: string;
  };
}

export type MediaItemWithCount = {
  name: string;
  id: string;
  url: string;
  count: number;
  lastPlayed: Date;
};
