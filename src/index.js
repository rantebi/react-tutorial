import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button className={props.isWinning? 'square winning':'square'} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const isWinning = (this.props.winningLine && this.props.winningLine.includes(i));
    return (
      <Square 
        value={this.props.squares[i]}
        key={i}
        isWinning={isWinning}
        onClick={() => {this.props.onClick(i)}}
      />
    );
  }

  render() {
    const rows = [];

    for (let row = 0; row < 3; row++){
      const cols = [];

      for (let col = 0; col < 3; col++){
        const cell = 3 * row + col;
        cols.push(this.renderSquare(cell));
      }
      rows.push(<div className="board-row" key={row}>
          {cols}
      </div>);
    }

    return (
      <div>
        {rows}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: null,
        winner: null,
        winningLine: null,
      }],
      stepNumber: 0,
      isStepsInAscendingOrder: true,
      xIsNext: true,
    }
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const calculateWinnerResult = calculateWinner(squares);
    if (calculateWinnerResult.winner || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext? 'X' : 'O';
    const currentCalculateWinnerResult = calculateWinner(squares);
    this.setState({
      history: history.concat([{
        squares: squares,
        move: i,
        winner: currentCalculateWinnerResult.winner,
        winningLine: currentCalculateWinnerResult.winningLine
      }]),
      stepNumber: history.length,
      isStepsInAscendingOrder: this.state.isStepsInAscendingOrder,
      xIsNext: !this.state.xIsNext,
    })
  }

  changeOrder(){
    this.setState({isStepsInAscendingOrder: !this.state.isStepsInAscendingOrder});
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const currentOrder = this.state.isStepsInAscendingOrder? 'ASC' : 'DESC';
    const winner = current.winner;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (' + (Math.floor(step.move / 3) + 1)  + ', ' + ((step.move % 3) + 1) + ')':
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={(move === this.state.stepNumber? 'current-move':'other-move')}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner){
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winningLine={current.winningLine}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><button onClick={() => this.changeOrder()}>{currentOrder}</button></div>
          <ol>{this.state.isStepsInAscendingOrder? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
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

  let winner = null;
  let winningLine = null;
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winner = squares[a];
      winningLine = [a, b, c];
      break;
    }
  }
  return {
    winner: winner,
    winningLine: winningLine
  };
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

