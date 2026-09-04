import {MRT_ColumnDef} from "mantine-react-table";
import {formatDates} from "@/shared/utils/formatTime";
import {JsonTableI} from "@/shared/types/monitoring";

export const shiftEditorColumns: MRT_ColumnDef[] = [
        {
            accessorKey: 'id',
            header: 'ID смены',
            enableEditing: false
        },
        {
            accessorKey: 'id_raspberry',
            header: 'ID терминала',
        },
        {
            accessorKey: 'id_kassa',
            header: 'ID группы терминалов',
        },
        {
            accessorKey: 'id_worker',
            header: 'ID сотрудника',
        },
        {
            accessorKey: 'date_from',
            header: 'С',
            accessorFn: (row) => {
                const {formattedFromDate} = formatDates(row as JsonTableI)
                return formattedFromDate
            }
        },
        {
            accessorKey: 'date_to',
            header: 'По',
            accessorFn: (row) => {
                const {formattedToDate} = formatDates(row as JsonTableI)
                return formattedToDate
            }
        },
    ]

