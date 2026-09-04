import {MRT_ColumnDef} from "mantine-react-table";
import {GroupI, RoleI} from "@/shared/types/userEditorI";
import {booleanLabelRu} from "@/shared/utils/translate";

export const roleEditorColumns: MRT_ColumnDef[] = [
    {
        accessorKey: 'id',
        header: 'Идентификатор',
        enableEditing: false
    },
    {
        accessorKey: 'name',
        header: 'Имя',
    },
    {
        accessorKey: 'is_active',
        header: 'Активен',
        accessorFn: (row) => {
            const is_active = (row as RoleI).is_active
            return booleanLabelRu(is_active)
        },
    }
]
