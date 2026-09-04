import {FC, useRef, useState} from "react";

import {Button, Flex, TextInput} from "@mantine/core";
import {DatePickerInput, TimeInput} from "@mantine/dates";
import {useForm} from "@mantine/form";

import {PostShiftI} from "@/shared/types/api/shiftEditorApi";




interface CreateShiftFormI {
    handleSubmit: (data: PostShiftI)=> void
    close: () => void
}


export const CreateShiftForm: FC<CreateShiftFormI> = ({handleSubmit, close}) => {
    const dateFrom = useRef<HTMLInputElement>(null)
    const dateTo = useRef<HTMLInputElement>(null)
    const [date] = useState<[Date | null, Date | null]>([null, null]);


    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            id_raspberry: '',
            id_kassa: '',
            id_worker: '',
            data_range: date,
            time_from: '',
            time_to: ''
        },
        validate: {
            // username: value => loginRule(value),
            // password: value => passwordRule(value),
        },
    })


    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
                label="ID терминала"
                placeholder="номер терминала"
                type="text"
                mb={32}
                {...form.getInputProps('id_raspberry')}
            />
            <TextInput
                label="ID группы терминалов"
                placeholder="номер группы терминалов"
                mb={32}
                {...form.getInputProps('id_kassa')}
            />
            <TextInput
                label="ID сотрудника"
                placeholder="номер сотрудника"
                mb={32}
                {...form.getInputProps('id_worker')}
            />
            <Flex justify='space-between' mb='1rem' direction='column'>
                <DatePickerInput
                    withAsterisk
                    label="Диапазон дат"
                    type="range"
                    placeholder="Выберите дату"
                    allowSingleDateInRange
                    clearable
                    {...form.getInputProps('data_range')}
                />
                <TimeInput
                    label='C'
                    withAsterisk
                    ref={dateFrom}
                    {...form.getInputProps('time_from')}
                />
                <TimeInput
                    label="По"
                    withAsterisk
                    ref={dateTo}
                    {...form.getInputProps('time_to')}
                />
            </Flex>
            <Button onClick={close} fullWidth type="submit" mb={16}>
                Создать смену
            </Button>
        </form>
    )
}
