export interface MainTableI {
    date_from: string,
    date_to: string,
    satisfaction: number | null,
    id_worker: number,
    id_raspberry: number,
    id_kassa: number
}

export interface JsonTableI {
    date_from: string,
    date_to: string,
    satisfaction: number | null,
    id_raspberry: number
}

export interface EmotionPointI {
    time: string
    emotion: string
    number?: number
}

export interface EmotionSessionI {
    id: number
    id_raspberry: number
    name_json: string
    json_satisfaction: {
        emot?: EmotionPointI[]
    }
    satisfaction: number | null
    date_from: string
    date_to: string
}

export enum MonitoringTableType  {
    MainTable = 'mainTable',
    Json = 'Json'
}
