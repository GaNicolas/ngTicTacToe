import {Status} from './gamestatus';
export class Gamelogic {
    
    gamefield: Array<number> = [];

    currentTurn: number=0;

    gameStatus!: Status;

    winSituationsOne: Array<Array<number>> = [
        [1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 1, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1],
        [0, 0, 1, 0, 1, 0, 1, 0, 0]
    ];

    winSituationsTwo: Array<Array<number>> = [
        [2, 2, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 2, 2, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 2, 2, 2],
        [2, 0, 0, 2, 0, 0, 2, 0, 0],
        [0, 2, 0, 0, 2, 0, 0, 2, 0],
        [0, 0, 2, 0, 0, 2, 0, 0, 2],
        [2, 0, 0, 0, 2, 0, 0, 0, 2],
        [0, 0, 2, 0, 2, 0, 2, 0, 0]
    ];

    public constructor(){
        this.gameStatus= Status.STOP;
        this.gamefield = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    }

    gameStart(): void{
        this.gamefield = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.currentTurn = this.randomPlayerStart();
        this.gameStatus = Status.START;
    }

    randomPlayerStart(): number{
    const startPlayer = Math.floor(Math.random()*2) +1;
    return startPlayer;
    }

    setField(position: number, value: number): void{
        this.gamefield[position] = value;
    }

    getPlayerColorClass(): string{
        const colorClass = (this.currentTurn === 2) ? 'player-two' : 'player-one';
        return colorClass;
    }

    changePlayer():void{
        this.currentTurn = (this.currentTurn === 2) ? 1 : 2;
    }

    async checkGameEndFull(): Promise<boolean>{
        let isFull = true;

        if(this.gamefield.includes(0)){
            isFull = false;
        }
        if( isFull ){
            this.gameEnd()
            return true;
        }
        else{
            return false;
        }

    }

    arrayEquals(a: Array<any>, b:Array<any>): boolean{
        return Array.isArray(a) && Array.isArray(b) && a.length === b.length &&
        a.every((value, index) => value === b[index]);
    }

    async checkGameEndWinner(): Promise<boolean>{
        let isWinner = false;

        const checkArray = (this.currentTurn === 1) ? this.winSituationsOne : this.winSituationsTwo;

         const currentArray = [] as any;

        this.gamefield.forEach((subfield, index)=>{
            if(subfield !== this.currentTurn){
                currentArray[index] = 0;
            }
            else{
                currentArray[index] = subfield;
            }
        });

        checkArray.forEach((checkfield, checkindex)=>{
            if(this.arrayEquals(checkfield, currentArray)){
                isWinner = true;
            }

        });

        if( isWinner ){
            this.gameEnd()
            return true;
        }
        else{
            return false;
        }

    }

    gameEnd(): void{
        this.gameStatus = Status.STOP;
    }
}
