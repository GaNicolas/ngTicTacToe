import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
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
  win: boolean=false;

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
