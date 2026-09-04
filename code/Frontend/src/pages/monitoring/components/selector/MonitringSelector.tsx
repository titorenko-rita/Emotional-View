import {FC} from "react";

import {Button, Flex} from "@mantine/core";

import {MonitoringActiveTab} from "@/shared/types/activeTabs";

interface UserEditorSelectorI {
    setTable: (x: MonitoringActiveTab)=> void
}


export const MonitoringSelector: FC<UserEditorSelectorI> = ({setTable}) => {

    const handleSetMainTable = () => {
        setTable(MonitoringActiveTab.mainTable)
    }

    const handleSetJsonTable = () => {
        setTable(MonitoringActiveTab.jsonTable)
    }

    const handleSetMainHistogram = () => {
        setTable(MonitoringActiveTab.mainHistogram)
    }

    const handleSetJsonHistogram = () => {
        setTable(MonitoringActiveTab.jsonHistogram)
    }

    const handleSetAllPieChart = () => {
        setTable(MonitoringActiveTab.allPieChart)
    }

    const handleSetSessionEmotionChart = () => {
        setTable(MonitoringActiveTab.sessionEmotionChart)
    }

    return (
        <Flex justify='space-around' mb='2rem' gap="sm" wrap="wrap">
            <Button onClick={handleSetMainTable}>Таблица сотрудников</Button>
            <Button onClick={handleSetJsonTable}>Таблица терминалов</Button>
            <Button onClick={handleSetMainHistogram}>Диаграмма сотрудников</Button>
            <Button onClick={handleSetJsonHistogram}>Диаграмма терминалов</Button>
            <Button onClick={handleSetAllPieChart}>Сводная диаграмма</Button>
            <Button onClick={handleSetSessionEmotionChart}>Поведение за сеанс</Button>
        </Flex>
    )
}
