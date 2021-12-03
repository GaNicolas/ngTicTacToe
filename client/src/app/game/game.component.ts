import { Component, ElementRef, OnInit } from '@angular/core';
import { Gamelogic } from '../gamelogic';
import io from 'socket.io-client';

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

  ngOnInit(): void {
  }

  startGame(idRoom : number): void{
    console.log(idRoom);
    this.game.gameStart();
    const currentPlayer = 'Current turn: Player' + this.game.currentTurn;
    const information = document.querySelector('.current-status');
    information!.innerHTML = currentPlayer;
    this.socket = io("http://localhost:3000");
    this.socket.on("position", (data: any) =>{
      this.clickSubfieldSocket(data);
    });
  }

  async clickSubfieldSocket(subfield: any):Promise<void>{
    if(this.game.gameStatus == 1){
      const position = subfield.position;
      const information = document.querySelector('.current-status');
      const elements = document.querySelector('.position'+position);
      console.log(elements);
      if(position != this.positionHold[0]){
        this.game.setField(position, this.game.currentTurn);
        const color = this.game.getPlayerColorClass();
        elements!.classList.add(color);
        await this.game.checkGameEndWinner().then((end: boolean) => {
          this.win = end;
            if(this.game.gameStatus === 0 && end) {
              information!.innerHTML = 'The winner is player number ' + this.game.currentTurn;
            }
          });
          if(!this.win){
        await this.game.checkGameEndFull().then((end: boolean) => {
            if(this.game.gameStatus === 0 && end) {
              information!.innerHTML = 'No winner, draw'
            }
          });
        }

          this.game.changePlayer();

        if(this.game.gameStatus === 1){

          const currentPlayer = 'Current turn: Player: ' + this.game.currentTurn;

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
    if(this.game.gameStatus == 1){
      const position = subfield.currentTarget.getAttribute('position');
      const information = document.querySelector('.current-status');
      if(position != this.positionHold[0]){
        this.subfieldSocket={
          'position': subfield.currentTarget.getAttribute('position'),
          'currentTarget': subfield.currentTarget
        }
        this.socket.emit("move", this.subfieldSocket);
        
        this.game.setField(position, this.game.currentTurn);
        const color = this.game.getPlayerColorClass();
        subfield.currentTarget.classList.add(color);
        await this.game.checkGameEndWinner().then((end: boolean) => {
          this.win = end;
            if(this.game.gameStatus === 0 && end) {
              information!.innerHTML = 'The winner is player number ' + this.game.currentTurn;
            }
          });
          if(!this.win){
        await this.game.checkGameEndFull().then((end: boolean) => {
            if(this.game.gameStatus === 0 && end) {
              information!.innerHTML = 'No winner, draw'
            }
          });
        }

          this.game.changePlayer();

        if(this.game.gameStatus === 1){

          const currentPlayer = 'Current turn: Player: ' + this.game.currentTurn;

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
