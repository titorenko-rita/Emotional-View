
import React, {useState} from "react";

import {Button, Flex, Text} from "@mantine/core";

import {TableWrapper} from "@/components/monitoring-wrapper";
import {JsonTable, MainTable, MonitoringFilters} from "@/pages/monitoring/components";
import { MonitoringTableType} from "@/shared/types/monitoring";
import {MonitoringSelector} from "@/pages/monitoring/components/selector";
import {MonitoringActiveTab, UserEditorActiveTab} from "@/shared/types/activeTabs";
import {UserContainer} from "@/pages/userEditor/components/user/user-container";
import {RoleContainer} from "@/pages/userEditor/components/role/role-container";
import {GroupContainer} from "@/pages/userEditor/components/group/group-container";
import {RpiContainer} from "@/pages/userEditor/components/rpi/rpi-container";
import {AllUsersContainer} from "@/pages/userEditor/components/allUsers/allUsers-container";
import {AllPieChart, JsonHistogram, MainHistogram, SessionEmotionChart} from "@/pages/monitoring/components/histogramms";


export const Monitoring =  () => {
    const [table, setTable] = useState(MonitoringActiveTab.mainTable)

    const [dates, setDates] = useState({
        date_from: '',
        date_to: ''
    })

    const setDatesQuery = (start: string, end: string) => {
        setDates({date_from: start, date_to: end})
    }

    const handleSwitchTable = () => {
        return (() => {
            switch (table) {
                case (MonitoringActiveTab.mainTable):
                    return <MainTable dates={dates}/>
                case (MonitoringActiveTab.jsonTable):
                    return <JsonTable dates={dates}/>
                case (MonitoringActiveTab.mainHistogram):
                    return <MainHistogram dates={dates}/>
                case (MonitoringActiveTab.jsonHistogram):
                    return <JsonHistogram dates={dates}/>
                case (MonitoringActiveTab.allPieChart):
                    return <AllPieChart dates={dates}/>
                case (MonitoringActiveTab.sessionEmotionChart):
                    return <SessionEmotionChart dates={dates}/>
            }
        })()
    };


    return (
        <TableWrapper formId='monitoring' width='90%' height=''>
            <Text ta='center' size='xl' mb='1rem'>Выберите временной диапазон</Text>
            <MonitoringFilters
                setQuery={setDatesQuery}
            />
            <MonitoringSelector setTable={setTable}/>
            {
               handleSwitchTable()
            }
        </TableWrapper>
    )
}
