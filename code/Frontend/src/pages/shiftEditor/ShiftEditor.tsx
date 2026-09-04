import {useCallback, useEffect, useState} from "react";

import {Button, Flex, Modal,Text} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";

import {useDeleteShiftMutation, usePatchShiftMutation, usePostShiftMutation} from "@/app/redux";
import {TableWrapper} from "@/components/monitoring-wrapper";
import {useShiftEditor} from "@/hooks/useShiftEditor";
import {ShiftEditorTable} from "@/pages/shiftEditor/components";
import {CreateShiftForm} from "@/pages/shiftEditor/components/form-create-shift";
import {ShiftEditorFilters} from "@/pages/shiftEditor/components/shift-editor-filters";
import {PatchShiftEditorI, PostShiftI, ShiftEditorI} from "@/shared/types/api/shiftEditorApi/shiftEditorApi";
import {formatDatesWithTimeRange} from "@/shared/utils/formatTime";


export const ShiftEditor = ()=> {
    const {handleGetShift} = useShiftEditor({count: 1,
    date_from: '',
    date_to: ''
    })
    const [shift, setShift] = useState<ShiftEditorI[]>()
    const [opened, { open, close }] = useDisclosure(false);
    const [postShift] = usePostShiftMutation()
    const [patchShift] = usePatchShiftMutation()
    const [deleteShift] = useDeleteShiftMutation()


    const [dates, setDates] = useState({
        date_from: '',
        date_to: ''
    })

    const handleGetShiftElements = useCallback(async ()=> {
        const getShift = await handleGetShift()
        setShift(getShift)
    }, [handleGetShift])

    const setDatesQuery = (start: string, end: string) => {
        setDates({date_from: start, date_to: end})
    }

    const handleCreateShift = async (data: PostShiftI) => {
        const {id_raspberry, id_kassa, id_worker,time_from,data_range, time_to} = data
        const {formattedStartDate, formattedEndDate} = formatDatesWithTimeRange(data_range, time_from, time_to)

        await postShift({
                id_raspberry: Number(id_raspberry),
                id_kassa: Number(id_kassa),
                id_worker: Number(id_worker),
                date_from: formattedStartDate!,
                date_to: formattedEndDate!
        })
        handleGetShiftElements()
    }

    const handlePatchShift = async (data: PatchShiftEditorI) => {
        await patchShift(data)
        handleGetShiftElements()
    }
    const handleDeleteShift = async (id: number) => {
        await deleteShift(id)
        handleGetShiftElements()
    }

    useEffect(()=> {
        handleGetShiftElements()
    }, [handleGetShiftElements])

    return (
        <TableWrapper formId='shiftEditor' width='98%' height=''>
            <Flex justify='center' mb='2rem'>
                <Text size='xl'>Редактор смены</Text>
            </Flex>
            <Flex justify='center' direction='column'>
                <Button mb='2rem' onClick={open}>Создать смену</Button>
                <ShiftEditorFilters setQuery={setDatesQuery}/>
            </Flex>
            <Modal opened={opened} onClose={close}>
                <CreateShiftForm 
                    handleSubmit={handleCreateShift}
                    close={close}
                />
            </Modal>
            {
                shift
                    ? <ShiftEditorTable
                        handlePatchShift={handlePatchShift}
                        handleDeleteShift={handleDeleteShift}
                        dates={dates}
                    /> :
                    <Flex h='50vh' justify='center' align='center'>
                        <Text color='__black'>
                            Нет данных
                        </Text>
                    </Flex>
            }
        </TableWrapper>
    )
}

