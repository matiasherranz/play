import axios from 'axios';

import {
  REQUEST_SEARCH,
  REQUEST_SEARCH_SUCCESS,
  REQUEST_SEARCH_FAILURE,
  REQUEST_FETCH_ACCESS_TOKEN,
  REQUEST_FETCH_ACCESS_TOKEN_SUCCESS,
  REQUEST_FETCH_ACCESS_TOKEN_FAILURE,
} from '../constants/redux';

/** ***************************************************************************/

/**
 * Spotify search actions, action creators and thunk.
 */

function requestSearch() {
  return {
    type: REQUEST_SEARCH,
  };
}

function requestSearchSuccess(data) {
  return {
    type: REQUEST_SEARCH_SUCCESS,
    payload: data,
  };
}

function requestSearchFailure(error) {
  return {
    type: REQUEST_SEARCH_FAILURE,
    payload: error,
  };
}


export const spotifySearch = (search) => {
  return (dispatch, getState) => {
    const accessToken = getState().search.access_token;
    if (!accessToken) {
      dispatch(getAccessToken(false, search));
    }

    if (accessToken && search) {
      dispatch(requestSearch());
      return axios.get(
      "https://api.spotify.com/v1/search", {
        params: {
          q: search,
          type: "album,artist,track",
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then(
        data => {
          dispatch(requestSearchSuccess(data));
        },
        err => {
          console.log(`Error performing Spotify search: ${err}`);
          dispatch(requestSearchFailure(err));
        },
      );
    }
  };
};



/** ***************************************************************************/

/**
 * Access token actions, action creators and thunk.
 */

function requestAccessToken() {
  return {
    type: REQUEST_FETCH_ACCESS_TOKEN,
  };
}

function requestAccessTokenSuccess(data) {
  return {
    type: REQUEST_FETCH_ACCESS_TOKEN_SUCCESS,
    data,
  };
}

function requestAccessTokenFailure(error) {
  return {
    type: REQUEST_FETCH_ACCESS_TOKEN_FAILURE,
    error,
  };
}

export const getAccessToken = (tokenRefresh=false, searchAfterAuth='') => {
  return (dispatch, getState) => {
    const access_token = getState().access_token;
    if (access_token && !tokenRefresh) {
      // If there's already an access token on the Redux state and we were not
      // asked to refresh the token, let's just return it:
      return access_token;
    }
    const baseURL = 'http://ipsyfy.herokuapp.com';
    //const baseURL = 'http://localhost:5001';

    // And if there's not, let's get a new one:
    dispatch(requestAccessToken());
    return axios.get(
      `${baseURL}/get-tokens`, {
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
    }).then(
      result => {
        dispatch(requestAccessTokenSuccess(result.data))

        // Now that we are logged in, let's retry searching:
        if (searchAfterAuth) {
          dispatch(spotifySearch(searchAfterAuth));
        }
      },
      err => {
        console.log(`Error fetching access token from Spotify: ${err}`);
        dispatch(requestAccessTokenFailure(err));
      },
    );
  };
};
