import {FC, useCallback, useEffect, useState} from "react";
import {JsonTableRates} from "@/shared/types/rates";
import {useGetMonitoringData} from "@/hooks/useGetMonitoringData";
import {Chart} from "react-chartjs-2";
import {theme} from "@/app/theme";
import {RatesQueryI} from "@/shared/tables/dateI";
import { getSatisfactionLabel } from "@/pages/monitoring/getSatisfactionLabel";

export const JsonHistogram: FC<RatesQueryI> = ({dates}) => {
    const [query, setQuery] = useState({
        date_from: '',
        date_to: ''
    });
    const [rates, setRates] = useState<JsonTableRates[]>([]);

    useEffect(() => {
        setQuery({date_from: dates.date_from, date_to: dates.date_to});
    }, [dates]);

    const {handleGetJsonRates} = useGetMonitoringData(query);

    const handleGetData = useCallback(async () => {
        const getData = await handleGetJsonRates();
        setRates(getData ?? []);
    }, [handleGetJsonRates]);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    const rows = rates ?? [];

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const labels = rows.map((i) => `ID терминала ${i.id_raspberry}`);

    const data = {
        labels,
        datasets: [
            {
                type: 'bar' as const,
                label: getSatisfactionLabel(2),
                backgroundColor: theme.colors!.__green![6],
                borderColor: theme.colors!.__green![8],
                borderWidth: 1,
                data: rows.map((i) => i.satisfaction === 2 ? i.count : 0),
            },
            {
                type: 'bar' as const,
                label: getSatisfactionLabel(1),
                backgroundColor: theme.colors!.__green![4],
                borderColor: theme.colors!.__green![7],
                borderWidth: 1,
                data: rows.map((i) => i.satisfaction === 1 ? i.count : 0),
            },
            {
                type: 'bar' as const,
                label: getSatisfactionLabel(0),
                backgroundColor: theme.colors!.__green![2],
                borderColor: theme.colors!.__green![5],
                borderWidth: 1,
                data: rows.map((i) => i.satisfaction === 0 ? i.count : 0),
            },
            {
                type: 'bar' as const,
                label: getSatisfactionLabel(null),
                backgroundColor: theme.colors!.__black![2],
                borderColor: theme.colors!.__black![5],
                borderWidth: 1,
                data: rows.map((i) => i.satisfaction == null ? i.count : 0),
            },
        ],
    };

    return (
        <Chart
            type='bar'
            options={options}
            data={data}
        />
    );
};
