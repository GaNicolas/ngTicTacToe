import { Component, ElementRef, OnInit } from '@angular/core';
import { Gamelogic } from '../gamelogic';

import io from 'socket.io-client';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [Gamelogic]
})
export class GameComponent implements OnInit {

  constructor(public game: Gamelogic, private elem: ElementRef) { }

  positionHold : Array<number> = [];
  win: boolean=false;
  subfieldSocket:any;
  socket: any;
  id: number=-1;
  isTurn: boolean = false;
  stateGame: string = 'Waiting for an opponent';
  playerOne: any;
  playerTwo: any;

  ngOnInit(): void {
  }

  startGame (idRoom: number): void{
    this.id = idRoom;
    this.game.gameStart();
    const currentPlayer =  'Waiting for an opponent';
    const information = document.querySelector('.current-status');

    information!.innerHTML = currentPlayer;
    this.socket = io("http://localhost:3000");
    this.socket.emit("joinRoom", idRoom);
    this.socket.on("position", (data: any)=>{
      this.clickSubfieldSocket(data);
    });
    this.socket.on("onStart", (Vrai:any) =>{
      this.setTurnHTML();
    });

    this.socket.on("isTurn",(_turn: any) => {
      if(_turn == true){
      this.isTurn = true;
      this.turn();
      const currentPlayer = this.stateGame;
      information!.innerHTML = currentPlayer;
      }else{
        this.turn();
        this.isTurn = false;
        const currentPlayer = this.stateGame;
        information!.innerHTML = currentPlayer;
      }
    });
  }

  async setTurnHTML(){
    if(this.isTurn == true){
    document.querySelector('.playerOne')!.innerHTML = 'You';
    document.querySelector('.playerTwo')!.innerHTML = 'Opponent';
  }

    else if(this.isTurn == false){
      document.querySelector('.playerOne')!.innerHTML = 'Opponent';
      document.querySelector('.playerTwo')!.innerHTML = 'You';
    }

  }

  turn(): void{
    console.log("turn");
    if(this.isTurn == true)
      this.stateGame = 'Your turn !';
    else
     this.stateGame = "Opponent's turn";
  }

  onSubmit(idRoom: NgForm): void{
    if(idRoom.value.idRoom >= 0){
    this.startGame(idRoom.value.idRoom);
    this.isTurn = false;
    this.stateGame = 'Waiting for an opponent';
  }
  }

  async clickSubfieldSocket(subfield: any):Promise<void>{
    if(this.game.gameStatus == 1){
      this.isTurn = true;
      this.turn();
      const position = subfield.position;
      const information = document.querySelector('.current-status');
      const elements = document.querySelector('.position'+position);
      if(position != this.positionHold[0]){
        this.game.setField(position, this.game.currentTurn);
        console.log(this.game.gamefield);
        const color = this.game.getPlayerColorClass();
        elements!.classList.add(color);
        await this.game.checkGameEndWinner().then((end: boolean) => {
          this.win = end;
            if(this.game.gameStatus === 0 && end) {
              if(this.isTurn == true){
              information!.innerHTML = 'You lost';
              this.socket.emit("leaveRoom", this.id);
            }
            }
          });
          if(!this.win){
        await this.game.checkGameEndFull().then((end: boolean) => {
            if(this.game.gameStatus === 0 && end) {
              information!.innerHTML = 'No winner, draw';
              this.socket.emit("leaveRoom", this.id);
            }
          });
        }

          this.game.changePlayer();

        if(this.game.gameStatus === 1){
          const currentPlayer = this.stateGame
          information!.innerHTML = currentPlayer;

        }
      }
      try{
        this.positionHold.pop();
        this.positionHold = [position];
      }
      catch (e){
        // Do nothing
      }

    }
  }

  async clickSubfield(subfield: any):Promise<void>{
    if(this.game.gameStatus == 1 && this.isTurn){
      const position = subfield.currentTarget.getAttribute('position');
      const information = document.querySelector('.current-status');
      if(this.game.gamefield[position] == 0){
      if(position != this.positionHold[0]){
        
        this.subfieldSocket={
          'position': subfield.currentTarget.getAttribute('position'),
          'currentTarget': subfield.currentTarget,
        }
        this.socket.emit("move", this.subfieldSocket,this.id);
        this.isTurn = false;
        this.turn();
        this.game.setField(position, this.game.currentTurn);
        console.log(this.game.gamefield);
        const color = this.game.getPlayerColorClass();
        subfield.currentTarget.classList.add(color);
        await this.game.checkGameEndWinner().then((end: boolean) => {
          this.win = end;
            if(this.game.gameStatus === 0 && end) {
              if(this.isTurn == false){
              information!.innerHTML = 'You won ! ';
              this.socket.emit("leaveRoom", this.id);
            }
            }
          });
          if(!this.win){
        await this.game.checkGameEndFull().then((end: boolean) => {
            if(this.game.gameStatus === 0 && end) {
              information!.innerHTML = 'No winner, draw'
              this.socket.emit("leaveRoom", this.id);

            }
          });
        }
          this.game.changePlayer();
        if(this.game.gameStatus === 1){
          const currentPlayer = this.stateGame;
          information!.innerHTML = currentPlayer;
        }
      }
      try{
        this.positionHold.pop();
        this.positionHold = [position];
      }
      catch (e){
        // Do nothing
      }

    }
  }
  }
}
