import {useRef, useState} from "react";

import {Flex, Text} from "@mantine/core";
import {DatePickerInput, TimeInput} from "@mantine/dates";


export const TimeSelector = () => {
    const dateFrom = useRef<HTMLInputElement>(null)
    const dateTo = useRef<HTMLInputElement>(null)
    const [date, setDate] = useState<[Date | null, Date | null]>([null, null]);

    return (
        <Flex justify='space-between' mb='1rem' align='center'>
            <DatePickerInput
                type="range"
                placeholder="Выберите дату"
                value={date}
                onChange={setDate}
                clearable
            />
            <Text>C</Text>
            <TimeInput ref={dateFrom}/>
            <Text>По</Text>
            <TimeInput ref={dateTo}/>
        </Flex>
    )
}