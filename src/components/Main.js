import React, {Component} from 'react';
import GameBoard from './GameBoard';
import '../assets/css/main.scss';


class Main extends Component{

    render(){
        return(
            <div className="container">
                <GameBoard />
            </div>
        )
        
        
    }
}

export default Main;