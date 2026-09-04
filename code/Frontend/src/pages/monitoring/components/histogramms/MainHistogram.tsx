import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
} from 'chart.js';
import {
    Chart
} from 'react-chartjs-2';
import {FC, useCallback, useEffect, useState} from "react";
import {useGetMonitoringData} from "@/hooks/useGetMonitoringData";
import {MainTableRates} from "@/shared/types/rates";
import {theme} from "@/app/theme";
import {RatesQueryI} from "@/shared/tables/dateI";
import { getSatisfactionLabel } from "@/pages/monitoring/getSatisfactionLabel";

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip
);

export const MainHistogram: FC<RatesQueryI> = ({dates}) => {
    const [query, setQuery] = useState({
        date_from: '',
        date_to: ''
    });
    const [rates, setRates] = useState<MainTableRates[]>([]);

    useEffect(() => {
        setQuery({date_from: dates.date_from, date_to: dates.date_to});
    }, [dates]);

    const {handleGetMainRates} = useGetMonitoringData(query);

    const handleGetData = useCallback(async () => {
        const getData = await handleGetMainRates();
        setRates(getData ?? []);
    }, [handleGetMainRates]);

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

    const labels = rows.map((i) => `ID сотрудника ${i.id_worker}`);

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
