import {Status} from './gamestatus';
import io from 'socket.io-client';
export class Gamelogic {
    
    public gamefield: Array<number> = [];

    currentTurn: number=0;

    gameStatus!: Status;

    private socket: any;

    dataSocket= {
        position: 0,
        value: 0
    };


    public constructor(){
        this.gameStatus= Status.STOP;
        this.gamefield = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        //this.socket = io("http://localhost:3000");
        /*this.socket.on("position", (data: any) =>{
            console.log(data);
            this.socketSetField(data.position, data.value);
        });*/
    }

    gameStart(): void{
        this.currentTurn = this.randomPlayerStart();
        this.gameStatus = Status.START;
    }

    randomPlayerStart(): number{
    const startPlayer = Math.floor(Math.random()*2) +1;
    return startPlayer;
    }

    setField(position: number, value: number): void{
        if(this.dataSocket.position != position && this.dataSocket.value != value){
        this.gamefield[position] = value;
    
        this.dataSocket.position = position;
        this.dataSocket.value = value;
        }
    }

    socketSetField(position: number, value: number): void{
        
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
        
        // Par Array
        const currentArray = [] as any;

        this.gamefield.forEach((subfield, index)=>{
            if(subfield !== this.currentTurn){
                currentArray[index] = 0;
            }
            else{
                currentArray[index] = subfield;
            }
        });

        // Par row ou line
        const checkRow = [] as any;
        //1
        /*1 1 1
          0 0 0
          0 0 0 * */

        for(let i=0; i<3; i++){
            checkRow[i] = currentArray[i];
        }
        if(this.arrayEquals(checkRow, [this.currentTurn, this.currentTurn, this.currentTurn])){
            isWinner = true;
        }
        //2
        /**0 0 0
         * 1 1 1
         * 0 0 0
        */
        for(let i=3; i<6; i++){
            checkRow[i-3] = currentArray[i];
        }
        if(this.arrayEquals(checkRow, [this.currentTurn, this.currentTurn, this.currentTurn])){
            isWinner = true;
        }
        //3
        /**0 0 0
         * 0 0 0
         * 1 1 1
         */
        for(let i=6; i<9; i++){
            checkRow[i-6] = currentArray[i];
        }
        if(this.arrayEquals(checkRow, [this.currentTurn, this.currentTurn, this.currentTurn])){
            isWinner = true;
        }

        //4
        /**1 0 0
         * 1 0 0
         * 1 0 0
         */
        for(let i=0; i<3; i++){
            checkRow[i] = currentArray[i*3];
        }
        if(this.arrayEquals(checkRow, [this.currentTurn, this.currentTurn, this.currentTurn])){
            isWinner = true;
        }
        //5
        /**0 1 0
         * 0 1 0
         * 0 1 0
         */
        for(let i=0; i<3; i++){
            checkRow[i] = currentArray[1+i*3];
        }
        if(this.arrayEquals(checkRow, [this.currentTurn, this.currentTurn, this.currentTurn])){
            isWinner = true;
        }
        //6
        /**0 0 1
         * 0 0 1
         * 0 0 1
         */
        for(let i=0; i<3; i++){
            checkRow[i] = currentArray[2+i*3];
        }
        if(this.arrayEquals(checkRow, [this.currentTurn, this.currentTurn, this.currentTurn])){
            isWinner = true;
        }
        //7
        /**1 0 0
         * 0 1 0
         * 0 0 1
         */
        for(let i=0; i<3; i++){
            checkRow[i] = currentArray[i*4];
        }
        if(this.arrayEquals(checkRow, [this.currentTurn, this.currentTurn, this.currentTurn])){
            isWinner = true;
        }
        //8
        /**0 0 1
         * 0 1 0
         * 1 0 0
         */
         for(let i=0; i<3; i++){
            checkRow[i] = currentArray[2+i*2];
        }
        if(this.arrayEquals(checkRow, [this.currentTurn, this.currentTurn, this.currentTurn])){
            isWinner = true;
        }

        if( isWinner ){
            this.gameEnd()
            return true;
        }
        else{
            return false;
        }

    }

    gameEnd(): void{
        this.gamefield = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.gameStatus = Status.STOP;
    }
}
