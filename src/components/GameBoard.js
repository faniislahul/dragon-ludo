import React, {Component} from 'react';
import PlayerBoard from './PlayerBoard';
import DiceBox from './DiceBox';
import * as Actions from '../actions/Actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import RedDragon from '../assets/images/red-dragon.gif';
import BlueDragon from '../assets/images/blue-dragon.gif';
import YellowDragon from '../assets/images/yellow-dragon.gif';
import GreenDragon from '../assets/images/green-dragon.gif';

import BlueTower from '../assets/images/blue-tower.png';
import RedTower from '../assets/images/red-tower.png';
import YellowTower from '../assets/images/yellow-tower.png';
import GreenTower from '../assets/images/green-tower.png';


const sequences = ['fp-bl', 'fp-tl', 'fp-tr','fp-br']
const gamePlayers = ['blBeans', 'tlBeans', 'trBeans','brBeans']
const n = 4;
class GameBoard extends Component{

    constructor(props){
        super(props);

        this.state={
            beans : null,
            position: null,
            isMoving: false,
            score: {
                tlBeans: 0,
                trBeans: 0,
                blBeans: 0,
                brBeans: 0

            },
            bases: [],
            currentPlayer: '',
            currentSteps: 0,
            rollTime: true,
            diceRolled: false
        }

        this.interval = null;

    }

    componentWillMount(){
        let tlBeans = []
        let trBeans = []
        let blBeans = []
        let brBeans = []

        for(let i = 0; i< 4;  i++){
            tlBeans[i] = {top: 0, left: 0, track: -1, base: 'fp-tl', point: 0 }
            trBeans[i] = {top: 0, left: 0, track: -1, base: 'fp-tr', point: 0 }
            blBeans[i] = {top: 0, left: 0, track: -1, base: 'fp-bl', point: 0 }
            brBeans[i] = {top: 0, left: 0, track: -1, base: 'fp-br', point: 0 }
        }
        this.setState({
            position: {
                tlBeans,
                trBeans,
                blBeans,
                brBeans
            }
        })
    }
  
    componentDidMount(){
        // setTimeout(()=>{
        //     console.log(this.props.state.default.tracks)
        // }, 200)

        let tlBeans = []
        let trBeans = []
        let blBeans = []
        let brBeans = []

        for(let i = 0; i< 4;  i++){
            tlBeans[i] = this.refs[`tlBeans${i}`]
            trBeans[i] = this.refs[`trBeans${i}`]
            blBeans[i] = this.refs[`blBeans${i}`]
            brBeans[i] = this.refs[`brBeans${i}`]
        }
        this.setState({
            beans: {
                tlBeans,
                trBeans,
                blBeans,
                brBeans
            }
        })

        setTimeout(()=>{
            let initPos = this.state.position
            for(let player in initPos){
                let base = null;
                switch(player){
                    case 'tlBeans': {
                        base = 'fp-tl' 
                        break;
                    }
                    case 'trBeans': {
                        base = 'fp-tr' 
                        break;
                    }
                    case 'blBeans': {
                        base = 'fp-bl' 
                        break;
                    }
                    case 'brBeans': {
                        base = 'fp-br' 
                        break;
                    }
                }
                
                for(let i=0; i<4; i++){
                    let pos = this.offset(this.props.state.default.bases[base][i])
                    initPos[player][i] = {
                        top: pos.top,
                        left: pos.left,
                        track: -1,
                        point: 0,
                        base: initPos[player][i].base
                    }
                }
            }
            this.setState({
                position: initPos
            })

            
            
        }, 200)

        //set tower base
        setTimeout(()=>{
            let libBases = [];
            for( let bases in this.props.state.default.bases){
                this.props.state.default.bases[bases].map((base, i)=>{
                    // console.log(base)
                    let pos = this.offset(base)
                    libBases.push({
                        top: pos.top,
                        left: pos.left,
                        player: bases
                    })


                    
                })
            }
            this.setState({
                bases: libBases
            })
            // console.log(libBases)
            
        }, 200)


        this.setState({
            currentPlayer: gamePlayers[0]
        })

    }
    moves(player, id){
        
        if(this.state.rollTime){
            return;
        }

        if(this.state.currentPlayer !== player){
            return;
        }

        const steps = this.state.currentSteps;
        console.log("Steps: ", steps);

        

        
        //Don't process is bean is moving
        if(this.state.isMoving) return

        

        let position = this.state.position;
        let base = this.state.position[player][id].base;

        if(position[player][id].track === -1 && steps < 6){
            return;
        }
        
        this.setState({
            isMoving: true
        })

        if(position[player][id].track === -1 && steps === 6){
            console.log("first move")
            let pos = this.offset(this.props.state.default.tracks[base][8]);
            position[player][id]= {
                track : 8,
                top: pos.top,
                left: pos.left,
                base: base,
                point: position[player][id].point
            }
            this.setState({
                position: position,
                isMoving: false,
                rollTime:true
            })
            return;
        }

        

        let home = base;
        let track = (position[player][id].track + 1);
        let step = 1;
        let it = 0;
        console.log('----------------------------------')
        this.interval = setInterval(()=>{
            console.log(position[player][id])

            //if out of steps
            if(step === steps){
                this.killBeans(player, position[player][id].base, track);
                this.setState({
                    isMoving: false
                })
                clearInterval(this.interval)
            }

            //if user reach home tracks moves beans to arrow tracks
            if(position[player][id].point === 4 && track == 7){
                track = 13;
            }


            

            //move beans to winning spot
            if(position[player][id].point === 4 && (steps+track) === 19){
                // let pos = this.offset(this.props.state.default.tracks[home][track]);
                position[player][id]= {
                    track : track,
                    top: 0,
                    left: 0,
                    base: home,
                    point: position[player][id].point
                }
                this.setState({
                    position: position,
                    isMoving: false,
                    score: {
                        ...this.state.score,
                        [player]: this.state.score[player] + 1
                    }
                }, ()=>{
                    clearInterval(this.interval)
                })
                
            }

            
            //check if beans still in white tracks
            if(track < 13){
                
                // console.log(this.props.state.default.tracks[home])
                let pos = this.offset(this.props.state.default.tracks[home][track]);
                position[player][id]= {
                    track : track,
                    top: pos.top,
                    left: pos.left,
                    base: home,
                    point: position[player][id].point
                }
                this.setState({
                    position: position
                }, ()=>{
                    track++;
                    step++;
                })
                
            
            }else{
                if(position[player][id].point === 4){

                    //if player not getting right steps to win, stop..
                    if(position[player][id].point === 4 && (steps+track) > 19){
                        this.setState({
                            isMoving: false
                        })
                        clearInterval(this.interval)
                    }
                    
                    if(track < 18){

                        let pos = this.offset(this.props.state.default.tracks[home][track]);
                        position[player][id]= {
                            track : track,
                            top: pos.top,
                            left: pos.left,
                            base: home,
                            point: position[player][id].point
                        }
                        this.setState({
                            position: position
                        }, ()=>{
                            track++;
                            step++;
                        })
                    }else{
                        this.setState({
                            isMoving: false
                        })
                        clearInterval(this.interval);
                    }
                    
                }else{

                    home = sequences[(sequences.indexOf(home) + 1) % 4];
                    track = 0;
                    let pos = this.offset(this.props.state.default.tracks[home][track]);
                    position[player][id]= {
                        track : track,
                        top: pos.top,
                        left: pos.left,
                        base: home,
                        point: position[player][id].point+1
                    }

                    this.setState({
                        position: position
                    },()=>{
                        track++;
                        step++;
                    })

                }
                
            }

            it++
        }, 600)
        

    }
    killBeans = (player, base, track)=>{
        let others = [];
        

        if(track === 8 || track === 4){
            let nextPlayer = this.state.currentPlayer;

            if(this.state.currentSteps !== 6){
                nextPlayer = gamePlayers[(gamePlayers.indexOf(this.state.currentPlayer) + 1) % n]
                
            }
            this.setState({
                currentPlayer: nextPlayer,
                rollTime: true
            })
            return
        }

        for(let pl in this.state.position){
            for(let id in this.state.position[pl]){

                if(this.state.position[pl][id].track === track && this.state.position[pl][id].base === base && pl !== player){
                    others.push({
                        player: pl,
                        id: id
                    })
                }
            }
        }

        for(let dead in others){
            let home= ''
            switch(others[dead].player){
                case 'tlBeans': {
                    home = 'fp-tl' 
                    break;
                }
                case 'trBeans': {
                    home = 'fp-tr' 
                    break;
                }
                case 'blBeans': {
                    home = 'fp-bl' 
                    break;
                }
                case 'brBeans': {
                    home = 'fp-br' 
                    break;
                }
            }

            let initPos = this.state.position
            let pos = this.offset(this.props.state.default.bases[home][others[dead].id])
            initPos[others[dead].player][others[dead].id] = {
                top: pos.top,
                left: pos.left,
                track: -1,
                point: 0,
                base: home
            }

            
            setTimeout(()=>{
                this.setState({
                    position: initPos,
                    
                })
            }, 1200)
            
        }

        let nextPlayer = this.state.currentPlayer;

        if(this.state.currentSteps !== 6 && others.length === 0){
            nextPlayer = gamePlayers[(gamePlayers.indexOf(this.state.currentPlayer) + 1) % n]
            
        }
        this.setState({
            currentPlayer: nextPlayer,
            rollTime: true
        })
    }
    offset(el) {
        var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop + 10, left: rect.left + scrollLeft + 10 }
    }
    rollTheDice = ()=>{
        
        this.setState({
            rollTime: false
        })

        let counter = 0;
        let diceRoll = setInterval(()=>{
            

            this.setState({
                currentSteps: (Math.floor(Math.random() * (7 - 1)) + 1),
            },()=>{
                if(counter === 6){
                    if(this.state.currentSteps !== 6){
    
                        //check if there any bean outside
                        let outsideBeans = 0;
                        for(let pl in this.state.position){
                            for(let id in this.state.position[pl]){
                                if(this.state.position[pl][id].track > -1 && pl === this.state.currentPlayer){
                                    outsideBeans++
                                }
                            }
                        }
                        if(outsideBeans === 0){
                            this.setState({
                                currentPlayer: gamePlayers[(gamePlayers.indexOf(this.state.currentPlayer) + 1) % n],
                                rollTime: true,
                            })
                        }
                    }
                    
                    clearInterval(diceRoll);
                }
            })
            counter++;
        }, 80)
        
    }
    
    renderBases = () => {
    }
    render(){
        let beans = [];
        for(let player in this.state.position){
            for(let i=0 ; i< 4; i++){
               beans.push({
                   player: player,
                   index: i
               })
            }
        }

        
        return(
            <div className="game-board">
                <PlayerBoard position="fp-tl" />
                <PlayerBoard position="fp-tr" />
                <PlayerBoard position="fp-bl" />
                <PlayerBoard position="fp-br" />

                <div className="arrow-fp-tl"></div>
                <div className="arrow-fp-tr"></div>
                <div className="arrow-fp-bl"></div>
                <div className="arrow-fp-br"></div>
                {beans.map((item, index)=>{
                        return(
                            <div 
                            key={index}
                            ref={`${item.player}${item.index}`} 
                            onClick={()=>{this.moves(item.player, item.index)}}
                            style={{top: this.state.position[item.player][item.index].top, left: this.state.position[item.player][item.index].left}} 
                            className={`beans ${item.player} ${item.player === this.state.currentPlayer && !this.state.rollTime ? 'selected': ''}`}>
                                {/* {item.index} */}
                                {item.player === 'blBeans' ? <img src={BlueDragon} /> : 
                                item.player === 'tlBeans' ? <img src={RedDragon} />: 
                                item.player === 'trBeans' ? <img src={YellowDragon} />: 
                                item.player === 'brBeans' ? <img src={GreenDragon} />: 
                                null
                                }
                                
                            </div>
                        )
                    })
                }

                {this.state.bases.map((item, i)=>{
                    return(
                        <div 
                        key = {`bases${item.player}${i}`}
                        className="tower"
                        style={{top: item.top-10, left: item.left-20}} 
                        >
                        {item.player === 'fp-bl' ? <img src={BlueTower} /> : 
                        item.player === 'fp-tl' ? <img src={RedTower} />: 
                        item.player === 'fp-tr' ? <img src={YellowTower} />: 
                        item.player === 'fp-br' ? <img src={GreenTower} />: 
                        null
                        }
                        </div>
                    )
                })}

                <DiceBox player="dice-fp-tl" number={this.state.currentSteps} clickFunc={this.rollTheDice} rollTime={this.state.rollTime} />
                

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
  )(GameBoard);