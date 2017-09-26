import React, {Component} from "react";

import {connect} from 'react-redux';
import ReactAudioPlayer from 'react-audio-player';
import {Col, Row} from 'react-bootstrap';

import { safeArrayToString } from '../utils';


class AudioPlayer extends Component {

  renderTracks() {

    const heightImg = 100;
    const widthImg  = 100;
    const search = this.props.search;

    if (!search || !search.tracks.items.length) {
      return (
        <h4> No tracks found.</h4>
      );
    } else {

      const track = this.props.search.tracks.items[0];
      const arrayImageLength = track.album.images.length;
      const artistNames = track.album.artists.map((artist) => artist.name);

      if (!arrayImageLength) {
        return (
          <ReactAudioPlayer src={track.preview_url} />
        );
      } else {
        return (
          <Row className="show-grid">
            <Col xs={3} md={3}>
              <img
                height={heightImg}
                width={widthImg}
                src={track.album.images[0].url}
              />
            </Col>
            <Col xs={9} sm={9} md={9} lg={9}>
              <h5> {track.name} </h5>
              <h6>
                By {safeArrayToString(artistNames)}
              </h6>
              <ReactAudioPlayer src={track.preview_url} />
            </Col>
          </Row>
        );
      }

    }
  }

  render() {

    if (!this.props.search) {
      return (<div id="player" />);
    } else {

      return (
        <Row id="player" className="show-grid">
          <h4>Most popular song from last search: </h4>
          {this.renderTracks()}
        </Row>
      );

    }
  }
}


const mapStateToProps = (state) => ({
    search: state.search.data,
});


export default connect(mapStateToProps)(AudioPlayer);
