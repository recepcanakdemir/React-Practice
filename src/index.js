import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props){
    return (
        <div className='square' onClick={props.onClick}>
            {props.value}
        </div>
    );
}


//class Board extends React.Component{

    //renderSquare(i){
        //return(
            //<Square
                //value = {this.props.squares[i]}
                //onClick = {() => this.props.onClick(i)}
            ///>
        //);
    //}

    //render(){
        //return(
            //<div class="board-container">
                //<div className='board-row'>
                    //{this.renderSquare(0)}
                    //{this.renderSquare(1)}
                    //{this.renderSquare(2)}
                //</div>
                //<div className='board-row'>
                    //{this.renderSquare(3)}
                    //{this.renderSquare(4)}
                    //{this.renderSquare(5)}
                //</div>
                //<div className='board-row'>
                    //{this.renderSquare(6)}
                    //{this.renderSquare(7)}
                    //{this.renderSquare(8)}
                //</div>
            //</div>
        //)
    //}
//}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const boardSize = 3; // this is size of a column (it means number of rows)
        const squares = [] // this will store rows
        for(let i = 0; i < boardSize; i++){
            const rowSquares = []; // this will store each square in a row
            for(let j = 0; j < boardSize; j++){
                const sqaureIndex = i*boardSize + j; // this line finds what is the index of the current square by the i and j value
                rowSquares.push(this.renderSquare(sqaureIndex)); // finally pushes the square to the list that is storing squares in a row
            }
            squares.push(<div className="board-row">{rowSquares}</div>) // pushing every to the squares list
        }
        return <div className="board-container">{squares}</div>; // displaying the result

    }
}


class Game extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares:Array(9).fill(null),
                xPos:0,
                yPos:0,
            }],
            stepNumber:0,
            xIsNext: true,
            asc : true,
        }

    }
    
    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const xPos =  parseInt(i / 3);
        const yPos =  parseInt(i % 3);
        
        if(calculateWinner(squares) || squares[i]){ // if game is finished or the clicked square is already filled return
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares : squares,
                xPos : xPos,
                yPos : yPos,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpAndMakeBold(step){
        this.setState({
            stepNumber:step,
            xIsNext: (step % 2) === 0,
        })
    }

    render(){
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        console.log(this.state.asc)
        // this is like a forEach, this code takes each history element as a step parameter displays on the screen, move is increased automatically thanks to mapping
        let moves = history.map((step, move) => {
            const tuple = step.xPos + " ," + step.yPos ;
            const desc = move ? 'Go to move #'  + move + ' (' + tuple + ') ': 'Go to game start';
            return(
                <li key={move}> 
                    <button 
                        className = {move === this.state.stepNumber ? 'make-bolder': ''}  // if current step is equal to the move number on the button then it will be bolder, when we clicked on a button the current step is already becoming the same number with the move number on the button that is clicked
                        onClick = {() => this.jumpAndMakeBold(move)}>                     
                            {desc}
                    </button>
                </li>
            );
        });
        if(this.state.asc === false){
            moves = moves.slice(1,moves.length-1).reverse();
        }
        
        let status;
        if(winner){
            status = 'Winner: ' + winner;
        }else{
            status = 'Winner: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return(
            <div className='game'>
                <div className='game-board'>
                    <Board
                        squares = {current.squares}
                        onClick = {(i) => this.handleClick(i)}
                    />
                </div>      
                <div className='game-info'>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>      

                <input type="checkbox" id="switch" className ="checkbox" onClick={()=>{
                    this.setState({asc:!this.state.asc});
                }}/>
                <label for="switch"
                    className="toggle">
                </label>
            </div>
        )
    }

}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game/>);

function calculateWinner(squares){
    const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}