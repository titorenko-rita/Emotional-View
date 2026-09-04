import {MRT_ColumnDef} from "mantine-react-table";

import {User} from "@/shared";
import {UserI} from "@/shared/types/userEditorI";
import {booleanLabelRu} from "@/shared/utils/translate";


export const userEditorColumns: MRT_ColumnDef[] = [
        {
            accessorKey: 'id',
            header: 'Идентификатор',
            enableEditing: false
        },
        {
            accessorKey: 'id_role',
            header: 'ID роли',
        },
        {
            accessorKey: 'id_group',
            header: 'ID группы терминалов',
        },
        {
            accessorKey: 'username',
            header: 'Логин',
        },
        {
            accessorKey: 'is_active',
            header: 'Активный пользователь',
            accessorFn: (row) => {
                const is_active = (row as UserI).is_superuser
                return booleanLabelRu(is_active)
            },
        },
        {
            accessorKey: 'is_superuser',
            header: 'Суперпользователь',
            accessorFn: (row) => {
                const is_superuser = (row as UserI).is_superuser
                return booleanLabelRu(is_superuser)
            },
        },
        {
            accessorKey: 'is_verified',
            header: 'Верифицирован',
            accessorFn: (row) => {
                const is_verified = (row as User).is_verified
                return booleanLabelRu(is_verified)
            },
        },
    ]
