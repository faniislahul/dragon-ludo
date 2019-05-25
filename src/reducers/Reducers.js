import * as types from '../actions/ActionTypes';

const initialState = {
    tracks: {},
    bases: null,
    beans: null,
  }

export default (state = initialState, action = {}) => {
    switch (action.type) {
      
      
      case types.SET_TRACKS:
        return {
            ...state,
            tracks: action.tracks
        };
      
      case types.SET_BASES:
        return {
            ...state,
            bases: action.bases
        };
      case types.SET_BEANS:
        return {
            ...state,
            beans: action.beans
        };
      

      default:
        return state;
      }
}
