import { Component, OnInit } from '@angular/core';
import { Gamelogic } from '../gamelogic';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [Gamelogic]
})
export class GameComponent implements OnInit {

  constructor(public game: Gamelogic) { }

  positionHold : Array<number> = [];

  ngOnInit(): void {
  }

  startGame(): void{
    this.game.gameStart();
    const currentPlayer = 'Current turn: Player' + this.game.currentTurn;
    const information = document.querySelector('.current-status');
    information!.innerHTML = currentPlayer;
  }

  async clickSubfield(subfield: any):Promise<void>{
    if(this.game.gameStatus == 1){
      const position = subfield.currentTarget.getAttribute('position');
      const information = document.querySelector('.current-status');

      if(position != this.positionHold[0]){
      this.game.setField(position, this.game.currentTurn);
      const color = this.game.getPlayerColorClass();
      subfield.currentTarget.classList.add(color);
      
      await this.game.checkGameEndWinner().then((end: boolean) =>{
        if(this.game.gameStatus === 0 && end){
          information!.innerHTML = 'The Winner is Player ' + this.game.currentTurn;
        }
      });;

      await this.game.checkGameEndFull().then((end: boolean) =>{
        if(this.game.gameStatus === 0 && end){
          information!.innerHTML = 'No Winner, Draw';
        }
      });;



      this.game.changePlayer();

      if(this.game.gameStatus === 1){
        const currentPlayer = 'Current turn: Player: ' + this.game.currentTurn;
        information!.innerHTML = currentPlayer;
      }
      try {
        this.positionHold.pop();
        this.positionHold = [position];
      } catch (error) {
        //Prout pas bon
      }
      }
    }
  }

}
