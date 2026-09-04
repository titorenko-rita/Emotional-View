import {MRT_ColumnDef} from "mantine-react-table";
import {GroupI} from "@/shared/types/userEditorI";
import {booleanLabelRu} from "@/shared/utils/translate";

export const groupEditorColumns: MRT_ColumnDef[] = [
        {
            accessorKey: 'id',
            header: 'Идентификатор',
            enableEditing: false
        },
        {
            accessorKey: 'name',
            header: 'Название',
            enableEditing: true
        },
        {
            accessorKey: 'location',
            header: 'Расположение',
            enableEditing: true
        },
        {
            accessorKey: 'is_active',
            header: 'Активен',
            accessorFn: (row) => {
                const is_active = (row as GroupI).is_active
                return booleanLabelRu(is_active)
            },
        },
    ]
