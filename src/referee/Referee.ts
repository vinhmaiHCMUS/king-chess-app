import { PieceType, TeamType, Piece } from "../components/ChessBoard/ChessBoard";

export default class Referee{
    tileIsOccupied(x: number, y:number, boardState: Piece[]): boolean{

        const piece = boardState.find(p => p.x === x && p.y === y)
        if(piece){
            return true;
        }else {
            return false;
        }
    }
    TileIsOccupiedByOpponent(x: number, y: number, boardState: Piece[], team: TeamType): boolean{
        const piece = boardState.find((p) => p.x === x && p.y === y && p.team !== team);
        if(piece){
            return true;
        } else{
            return false;
        }
    }
    isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType, boardState: Piece[]) {
        if(type === PieceType.PAWN){
            const specialRow = (team === TeamType.NGUOICHOI) ? 1 : 6;
            const pawnDirection = (team === TeamType.NGUOICHOI) ? 1 : -1;

            //Loigc về sự di chuyển của quân tốt
            if(px === x && py === specialRow && y - py === 2*pawnDirection){
                if(!this.tileIsOccupied(x, y, boardState) && !this.tileIsOccupied(x, y - pawnDirection, boardState)){
                    return true;
                }
            } else if(px === x && y - py === pawnDirection){
                if(!this.tileIsOccupied(x, y, boardState)){
                    return true;
                }
            }
            //Logic về ăn quân của quân tốt
            else if(x - px === -1 && y - py === pawnDirection){
                //Tấn công vào phía trên hoặc góc dưới trái
                if(this.TileIsOccupiedByOpponent(x, y, boardState, team)){
                    return true;
                }
            }else if(x - px === 1 && y - py === pawnDirection){
                //Tấn công phía trên phải hoặc góc dưới phải
                if(this.TileIsOccupiedByOpponent(x, y, boardState, team)){
                    return true;
                }
            }
        }

        return false;
    }     
}