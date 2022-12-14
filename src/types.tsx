export type Face = {
    id: number,
    top: number,
    left: number,
    width: number,
    height: number,
    user: {
        id: string,
        username: string,
        name: string
    }
    centerX: number,
    centerY: number
}