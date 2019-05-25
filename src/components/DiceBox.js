import React, {Component} from 'react';
import * as Actions from '../actions/Actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class DiceBox extends Component{
    componentDidMount(){
        
    }
    render(){
        return(
            <div className={`dice-box ${this.props.player}`} onClick={this.props.clickFunc}>
               <h1>{this.props.number}</h1>
               {this.props.rollTime ? <h5>Roll Time!</h5> : null}
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
  )(DiceBox);