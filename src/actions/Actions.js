import * as types from './ActionTypes';


export function setTracks(tracks) {
    return {
        type: types.SET_TRACKS,
        tracks
    };
}

export function setBases(bases) {
    return {
        type: types.SET_BASES,
        bases
    };
}

export function setBeans(beans) {
    return {
        type: types.SET_BEANS,
        beans
    };
}
