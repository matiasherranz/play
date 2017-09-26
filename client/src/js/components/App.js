require('../../scss/style.scss');

import React from 'react';
import {connect} from 'react-redux';

import Album from '../components/Album';
import Artist from '../components/Artist';
import LoadingOverlay from '../components/LoadingOverlay';
import Player from '../components/Player';
import Search from './search';

import {Col, Grid, Row, Jumbotron, Button} from 'react-bootstrap';


class App extends React.Component {

  render() {
    const overlay = this.props.isFetching ? <LoadingOverlay/> : null;

    return (
      <div>

        {overlay}
        <Grid>
          <Jumbotron>
          <h1>Hello, there!</h1>
          <p>
            This is little Spotify seach app, put together using React, Redux, redux-thunk
            and lots of love.
            <br/>
            Use the search box below and have fun!
          </p>
        </Jumbotron>

          <h2>Search Spotify from here!</h2>
          <Row className="show-grid">
            <Col xs={12} sm={6} md={8} lg={8}> <Search/> </Col>
            <Col xs={12} sm={6} md={4} lg={4}> <Player/> </Col>
          </Row>
          <hr/>
          <Row className="show-grid">
            <Col xs={12} sm={12} md={12} lg={12}> <Artist/> </Col>
            <Col xs={12} sm={12} md={12} lg={12}> <Album/> </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
    isFetching: state.search.isFetching,
});


export default connect(mapStateToProps)(App);
