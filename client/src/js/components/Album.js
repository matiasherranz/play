import React, {Component} from "react";

import {connect} from 'react-redux';
import {Col, Row} from 'react-bootstrap';

import { safeArrayToString } from '../utils';


class Album extends Component {

  renderAlbums() {

    const heightImg = 200;
    const widthImg = 200;

    const search = this.props.search;

    if (!search || !search.albums.items.length) {
      return (
        <h4>
          No albums found.
        </h4>
      );
    } else {

      return this.props.search.albums.items.map((album) => {

        let url = "./img/no_cover.png";

        if (album.images.length) {
          url = album.images[1].url;
        }

        const artistNames = album.artists.map((artist) => artist.name);

        return (
          <Col key={album.id} md={4}>
            <h3>
              {album.name}
            </h3>
            <img height={heightImg} width={widthImg} src={url}/>
            <div>
              <strong>Artist:</strong> { safeArrayToString(artistNames)}
            </div>
            <div>
              <strong>Type:</strong> {album.album_type}
            </div>
            <h5>
              <a href={album.uri}>Open on Spotify</a> |
              <a href={album.external_urls.spotify}>External Link</a>
            </h5>
          </Col>
        );
      });
    }
  }


  render() {
    if (!this.props.search) {
      return (<div id="album-list" />);

    } else {
      return (
        <Row id="album-list" className="show-grid">
          <h2>Albums:</h2>
          {this.renderAlbums()}
        </Row>
      );
    }
  }

}


const mapStateToProps = (state) => ({
    search: state.search.data,
});


export default connect(mapStateToProps)(Album);
