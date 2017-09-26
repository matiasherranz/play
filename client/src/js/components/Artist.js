import React, {Component} from "react";

import {connect} from 'react-redux';
import {Col, Row} from 'react-bootstrap';

import { safeArrayToString } from '../utils';


class Artist extends Component {

  renderArtists() {

    const heightImg = 200;
    const widthImg  = 200;

    const search = this.props.search;

    if (!search || !search.artists.items.length) {
      return (
        <h4>
          No artists found.
        </h4>
      );
    } else {
      return this.props.search.artists.items.map((artist) => {

        let url = "./img/no_cover.png";
        if (artist.images.length) {
          url = artist.images[0].url;
        }

        let genres = null;
        if (artist.genres.length) {
          genres = (
            <div>
              Genres: {safeArrayToString(artist.genres, 20)}
            </div>
          );
        }

        return (
          <Col key={artist.id} md={4}>
            <h2> {artist.name} </h2>
            <img height={heightImg} width={widthImg} src={url}/>
            {genres}
            <div>
              Followers on Spotify: {artist.followers.total}
            </div>
            <h5>
              <a href={artist.uri}>Open on Spotify</a> |
              <a href={artist.external_urls.spotify}>External Link</a>
            </h5>
          </Col>
        );

      });
    }
  }

  render() {
    if (!this.props.search) {

      return (<div id="artist-list" />);

    } else {

      return (
        <Row id="artist-list" className="show-grid">
          <h2>Artists: </h2>
          {this.renderArtists()}
        </Row>
      );

    }
  }
}


const mapStateToProps = (state) => ({
    search: state.search.data,
});



export default connect(mapStateToProps)(Artist);
