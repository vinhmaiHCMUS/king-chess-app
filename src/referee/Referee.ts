import { PieceType, TeamType } from "../components/ChessBoard/ChessBoard";

export default class Referee{
    isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType) {
        if (type === PieceType.PAWN && team === TeamType.NGUOICHOI) {
          // Check if the pawn is at the starting position
          if (py === 1) {
            // Allow moving one or two squares forward
            if (px === x && (y - py === 1 || y - py === 2)) {
              return true;
            }
          } else {
            // Allow moving one square forward
            if (px === x && y - py === 1) {
              return true;
            }
          }
        }
        return false;
      }
      
}