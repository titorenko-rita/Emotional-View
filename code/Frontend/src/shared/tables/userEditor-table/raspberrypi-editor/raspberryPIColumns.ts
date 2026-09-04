import {MRT_ColumnDef} from "mantine-react-table";

import {RaspberryPII} from "@/shared/types/userEditorI";
import {booleanLabelRu} from "@/shared/utils/translate";

export const raspberryPIColumns: MRT_ColumnDef[] = [
        {
            accessorKey: 'id',
            header: 'Идентификатор',
            enableEditing: false
        },
        {
            accessorKey: 'id_group',
            header: 'ID группы терминалов',
        },
        {
            accessorKey: 'group_name',
            header: 'Название группы терминалов',
        },

        {
            accessorKey: 'mac',
            header: 'MAC-адрес',
        },
        {
            accessorKey: 'is_active',
            header: 'Активен',
            accessorFn: (row) => {
                const is_active = (row as RaspberryPII).is_active
                return booleanLabelRu(is_active)
            }
        },
    ]
