import React, {Component} from 'react';
import * as Actions from '../actions/Actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import BlueTower from '../assets/images/blue-tower.png';

class PlayerBoard extends Component{
    componentDidMount(){
        let tracks = [];
        for(let i=0; i< 18; i++){
            tracks[i] = this.refs[`track${i+1}`]
        }
        
        let bases = [
            this.refs['base1'],
            this.refs['base2'],
            this.refs['base3'],
            this.refs['base4']
        ]
        
        
        setTimeout(()=>{
            let globalTracks = this.props.state.default.tracks;
            let globalBases = this.props.state.default.bases;
            globalBases = 
            {   
                ...this.props.state.default.bases,
                [this.props.position]: bases
            }
            globalTracks = 
            {   
                ...this.props.state.default.tracks,
                [this.props.position]: tracks
            }
            this.props.actions.setTracks(globalTracks);
            this.props.actions.setBases(globalBases);
        }, Math.random(100))
        
    }
    render(){
        return(
            <div className={`player-board ${this.props.position}`}>
                <div className="player-base">
                    <div className="home">
                    <div ref="base1" className="bed"></div>
                    <div ref="base2" className="bed"></div>
                    <div ref="base3" className="bed"></div>
                    <div ref="base4" className="bed"></div>
                    </div>
                </div>
                <div className="player-track">
                    <div ref="track13" className="track"></div>
                    <div ref="track18" className="track base-track"></div>
                    <div ref="track1" className="track"></div>

                    <div ref="track12" className="track"></div>
                    <div ref="track17" className="track base-track"></div>
                    <div ref="track2" className="track"></div>

                    <div ref="track11" className="track"></div>
                    <div ref="track16" className="track base-track"></div>
                    <div ref="track3" className="track"></div>

                    <div ref="track10" className="track"></div>
                    <div ref="track15" className="track base-track"></div>
                    <div ref="track4" className="track"><div className="checkpoint"></div></div>

                    <div ref="track9" className="track base-track"></div>
                    <div ref="track14" className="track base-track"></div>
                    <div ref="track5" className="track"></div>

                    <div ref="track8" className="track"></div>
                    <div ref="track7" className="track"></div>
                    <div ref="track6" className="track"></div>
                </div>
               
            </div>
        )
       
    }
}

export default connect(state => ({
    state: state
  }),
    (dispatch) => ({
      actions: bindActionCreators(Actions, dispatch)
    })
  )(PlayerBoard);