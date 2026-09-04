export interface MainTableRates {
    count: number,
    id_worker: number,
    satisfaction: number | null
}

export interface JsonTableRates {
    id_raspberry: number,
    satisfaction: number | null,
    count: number
}

export interface AllPieRates {
    satisfaction: number | null,
    count: number
}