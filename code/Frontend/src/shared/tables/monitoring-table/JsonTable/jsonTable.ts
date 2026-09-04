import {MRT_ColumnDef} from "mantine-react-table";

import {JsonTableI} from "@/shared/types/monitoring";
import {formatDates} from "@/shared/utils/formatTime";
import { getSatisfactionLabel } from "@/pages/monitoring/getSatisfactionLabel";

export const jsonTableColumns: MRT_ColumnDef[] = [
    {
        accessorKey: 'id_raspberry',
        header: 'ID терминала',
    },
    {
        accessorKey: 'satisfaction',
        header: 'Удовлетворенность клиента',
        accessorFn: (row) => {
            return getSatisfactionLabel((row as JsonTableI).satisfaction);
        }
    },
    {
        accessorKey: 'date_from',
        header: 'С',
        accessorFn: (row) => {
            const {formattedFromDate} = formatDates(row as JsonTableI);
            return formattedFromDate;
        }
    },
    {
        accessorKey: 'date_to',
        header: 'По',
        accessorFn: (row) => {
            const {formattedToDate} = formatDates(row as JsonTableI);
            return formattedToDate;
        }
    },
];
