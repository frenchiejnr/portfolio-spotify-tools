drop schema public cascade;
create schema public;
CREATE TABLE Users (
    user_id SERIAL NOT NULL UNIQUE,
    PRIMARY KEY (user_id)
);
CREATE TABLE Spotify (
  spotify_id varchar(50) NOT NULL UNIQUE PRIMARY KEY,
  access_token VARCHAR(255) NOT NULL,
  refresh_token VARCHAR(255) NOT NULL,
  token_type VARCHAR(50) NOT NULL,
  expires_at TIMESTAMP NOT NULL
);
CREATE TABLE ListenBrainz (
    listenbrainz_id varchar(50) PRIMARY KEY,
    last_listened TIMESTAMP NOT NULL
);
CREATE TABLE Linked_Ids (
    user_id INT NOT NULL REFERENCES Users ON DELETE CASCADE,
    spotify_id varchar(50) NOT NULL REFERENCES Spotify ON DELETE CASCADE,
    listenbrainz_id varchar(50) NOT NULL REFERENCES ListenBrainz ON DELETE CASCADE
)