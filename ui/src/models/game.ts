export interface GameObj
{
    gameID: string,
    player1Taken: boolean,
    player2Taken: boolean,
    offline: boolean,
    computer: boolean,
    mapID: number,
    botLevel: number
}