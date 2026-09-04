import {FC, useRef, useState} from "react";

import { Button, Flex, Paper, Text} from "@mantine/core";
import {DatePickerInput, TimeInput} from "@mantine/dates";

import {formatDatesWithTimeRange} from "@/shared/utils/formatTime";

interface MonitoringFiltersI {
    setQuery: (start: string, end: string)=> void
}


export const ShiftEditorFilters: FC<MonitoringFiltersI> = ({setQuery}) => {
    const dateFrom = useRef<HTMLInputElement>(null)
    const dateTo = useRef<HTMLInputElement>(null)
    const [date, setDate] = useState<[Date | null, Date | null]>([null, null]);

    const handleSetQuery  = () => {
        const {formattedStartDate, formattedEndDate} = formatDatesWithTimeRange(date, dateFrom.current!.value, dateTo.current!.value)
        setQuery(formattedStartDate!, formattedEndDate!)
    }

    return (
        <Paper shadow="xs" radius="xs" withBorder p="xl" mb='2rem'>
            <Flex justify='space-between' mb='1rem' align='center'>
                <DatePickerInput
                    type="range"
                    placeholder="Выберите дату"
                    allowSingleDateInRange
                    value={date}
                    onChange={setDate}
                    clearable
                />
                <Text>C</Text>
                <TimeInput ref={dateFrom}/>
                <Text>По</Text>
                <TimeInput ref={dateTo}/>
                <Button onClick={handleSetQuery}>Найти</Button>
            </Flex>
        </Paper>
    )
}