import {combineReducers} from 'redux';
import SearchReducer from './reducer-search';


const allReducers = combineReducers({
    search: SearchReducer,
});


export default allReducers
