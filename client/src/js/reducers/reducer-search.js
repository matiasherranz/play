import {
  REQUEST_SEARCH,
  REQUEST_SEARCH_SUCCESS,
  REQUEST_SEARCH_FAILURE,
  REQUEST_FETCH_ACCESS_TOKEN,
  REQUEST_FETCH_ACCESS_TOKEN_SUCCESS,
  REQUEST_FETCH_ACCESS_TOKEN_FAILURE,
} from '../constants/redux';


export default (
  state = {isFetching: false, results: null, access_token: null, refresh_token: null},
  action
) => {

  /******************************** Search!  ********************************/

  switch (action.type) {
    case REQUEST_SEARCH:
      return {
        ...state,
        isFetching: true,
      };
      break;

    case REQUEST_SEARCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.payload.data,
      };
      break;

    case REQUEST_SEARCH_FAILURE:
      return {
        ...state,
        isFetching: false,
        ...action.payload,
      };
      break;

    /******************************* Tokens!  *******************************/

    case REQUEST_FETCH_ACCESS_TOKEN:
      return {
        ...state,
        isFetching: true,
      };
      break;

    case REQUEST_FETCH_ACCESS_TOKEN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        access_token: action.data.access_token,
        refresh_token: action.data.refresh_token,
      };
      break;

    case REQUEST_FETCH_ACCESS_TOKEN_FAILURE:
      return {
        ...state,
        isFetching: true,
        error: action.error.message,
      };
      break;

    /******************************* Default  *******************************/

    default:
      return state;
  }
}
