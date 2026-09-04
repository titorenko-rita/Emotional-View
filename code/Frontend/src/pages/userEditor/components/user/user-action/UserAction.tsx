import {FC, useRef} from "react";

import {Button, Flex, TextInput} from "@mantine/core";


interface UserActionI {
    setQuery: (id: number) => void
}


export const UserAction: FC<UserActionI> = ({setQuery}) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const handleSubmit = () => {
        setQuery(Number(inputRef.current!.value))
    }

    return (
        <Flex direction='column'>
            <TextInput
            label='ID пользователя'
            ref={inputRef}
            mb='1rem'
            />
            <Button mb='2rem' onClick={handleSubmit}>Найти</Button>
        </Flex>
    )
}