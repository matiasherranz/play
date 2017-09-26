import React, {Component} from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {FormControl, FormGroup} from 'react-bootstrap';
import debounce from 'lodash/debounce';

import {spotifySearch} from '../actions/search';

class Search extends Component {

  constructor(props){
    super(props);

    this.state = {
      searchTerm: '',
    };

    this.debouncedSearch = debounce(this.props.spotifySearch, 400, {
      'leading': false,
      'trailing': true,
    });
  }

  handleChange(e) {
    const search = e.target.value;
    this.setState({ searchTerm: search });
    this.debouncedSearch(search);
  }

  render() {
    let searchTerm = null;
    if (this.state.searchTerm) {
      searchTerm = (
        <div>
          <h4>Searching for:</h4>
          <p> {this.state.searchTerm}</p>
        </div>
      );
    }

    return (
      <div>
        <FormGroup className="Search" id="custom-search-input">
          <FormControl
            type="text"
            onChange={this.handleChange.bind(this)}
            placeholder="Search"
          />
        </FormGroup>
        {searchTerm}
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
    search: state.search
});


function matchDispatchToProps(dispatch) {
  return bindActionCreators({spotifySearch}, dispatch);
}


export default connect(mapStateToProps, matchDispatchToProps)(Search);
