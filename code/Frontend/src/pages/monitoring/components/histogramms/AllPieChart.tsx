import {FC, useCallback, useEffect, useState} from "react";
import {RatesQueryI} from "@/shared/tables/dateI";
import {AllPieRates} from "@/shared/types/rates";
import {useGetMonitoringData} from "@/hooks/useGetMonitoringData";
import {theme} from "@/app/theme";
import {Pie} from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getSatisfactionLabel } from "@/pages/monitoring/getSatisfactionLabel";

ChartJS.register(ArcElement, Tooltip, Legend);

export const AllPieChart: FC<RatesQueryI> = ({dates}) => {
    const [query, setQuery] = useState({
        date_from: '',
        date_to: ''
    });
    const [rates, setRates] = useState<AllPieRates[]>([]);

    useEffect(() => {
        setQuery({date_from: dates.date_from, date_to: dates.date_to});
    }, [dates]);

    const {handleGetAllRates} = useGetMonitoringData(query);

    const handleGetData = useCallback(async () => {
        const getData = await handleGetAllRates();
        setRates(getData ?? []);
    }, [handleGetAllRates]);

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

    const labels = rows.map((i) => getSatisfactionLabel(i.satisfaction));

    const data = {
        labels,
        datasets: [
            {
                label: 'Кол-во оценок',
                data: rows.map((i) => i.count),
                backgroundColor: rows.map((_, index) => theme.colors!.__green![Math.min(index + 2, 8)]),
                borderColor: theme.colors!.__green![9],
                borderWidth: 2,
            },
        ],
    };

    return (
        <Pie
            options={options}
            data={data}
        />
    );
};
