import {useRef, useState } from 'react';
import Tile from '../Tile/Tile';
import './ChessBoard.css';
import Referee from '../../referee/Referee';

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

export interface Piece{
    image: string;
    x: number;
    y: number;
    type: PieceType;
    team: TeamType;
}

export enum TeamType{
    DOITHU,
    NGUOICHOI
}

export enum PieceType {
    PAWN,
    BISHOP,
    KNIGHT,
    QUEEN,
    KING,
    ROOK
}

const initialBoardState: Piece[] = [];
for(let p = 0; p < 2; p++)
{
    const teamType = (p===0) ? TeamType.DOITHU : TeamType.NGUOICHOI;
    const type = (teamType === TeamType.DOITHU) ? "b" : "w";
    const y = (teamType === TeamType.DOITHU) ? 7 : 0;

    initialBoardState.push({image: `assets/images/rook_${type}.png`, x: 0, y, type: PieceType.ROOK, team: teamType});
    initialBoardState.push({image: `assets/images/rook_${type}.png`, x: 7, y, type: PieceType.ROOK, team: teamType})
    initialBoardState.push({image: `assets/images/knight_${type}.png`, x: 1, y, type: PieceType.KNIGHT, team: teamType})
    initialBoardState.push({image: `assets/images/knight_${type}.png`, x: 6, y, type: PieceType.KNIGHT, team: teamType})
    initialBoardState.push({image: `assets/images/bishop_${type}.png`, x: 2, y, type: PieceType.BISHOP, team: teamType})
    initialBoardState.push({image: `assets/images/bishop_${type}.png`, x: 5, y, type: PieceType.BISHOP, team: teamType})
    initialBoardState.push({image: `assets/images/queen_${type}.png`, x: 3, y, type: PieceType.QUEEN, team: teamType})
    initialBoardState.push({image: `assets/images/king_${type}.png`, x: 4, y, type: PieceType.KING, team: teamType})
}

for(let i = 0; i < 8; i++)
{
    initialBoardState.push({image: "assets/images/pawn_b.png", x: i, y: 6, type: PieceType.PAWN, team: TeamType.DOITHU})
}

for(let i = 0; i < 8; i++)
{
    initialBoardState.push({image: "assets/images/pawn_w.png", x: i, y: 1, type: PieceType.PAWN, team: TeamType.NGUOICHOI})
}

export default function ChessBoard(){
    const[activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null);
    const referee = new Referee();

    function grabPiece(e: React.MouseEvent){
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if(element.classList.contains("chess-piece") && chessboard){
            setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100));
            setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)));
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
        }
    }

    function movePiece(e: React.MouseEvent){
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard){
            const minX = chessboard.offsetLeft - 25;
            const minY = chessboard.offsetTop - 25;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            activePiece.style.position = "absolute";
            // activePiece.style.left = `${x}px`;
            // activePiece.style.top = `${y}px`;

            //Nếu x nhỏ hơn giá trị minX
            if(x < minX){
                activePiece.style.left = `${minX}px`;
            //Nếu x lớn hơn giá trị maxX
            }else if(x > maxX){
                activePiece.style.left = `${maxX}px`;
            }else{
                activePiece.style.left = `${x}px`;
            }

            if(y < minY){
                activePiece.style.top = `${minY}px`;
            }else if(y > maxY){
                activePiece.style.top = `${maxY}px`;
            }else{
                activePiece.style.top = `${y}px`;
            }

        }
    }

    function dropPiece(e: React.MouseEvent)
    {
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard){
            const x= Math.floor((e.clientX - chessboard.offsetLeft) / 100);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));



            //Cập nhật vị trí quân cờ
            setPieces((value) =>{
                const pieces = value.map(p=>{
                    if(p.x === gridX && p.y === gridY){
                        const validMove = referee.isValidMove(gridX, gridY, x, y, p.type, p.team, value);
                        if(validMove){
                            p.x = x;
                            p.y = y;
                        }else {
                            activePiece.style.position = 'relative';
                            activePiece.style.removeProperty('top');
                            activePiece.style.removeProperty('left');
                        }
                        
                    }
                    return p;
                });
                return pieces;
            });
            setActivePiece(null);
        }
    }
        let board = [];
        for(let j = verticalAxis.length - 1; j >= 0; j--)
        {
            for(let i = 0; i < horizontalAxis.length; i++)
            {
                const number = j + i + 2;
                let image = undefined;
                pieces.forEach(p => {
                    if(p.x === i && p.y === j)
                    {
                        image = p.image;
                    }
                })
                board.push(<Tile key = {`${j}, ${i}`}image = {image} number = {number}/>)
            }
        }
    
    return <div 
    onMouseMove = {e => movePiece(e)} 
    onMouseDown = {e => grabPiece(e)}
    onMouseUp = {e => dropPiece(e)}
    id="chessboard"
    ref = {chessboardRef}
    >
        {board}
    </div>
}

