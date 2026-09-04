import {FC, useCallback, useEffect, useMemo, useState} from "react";

import {Alert, Box, Paper, Select, Stack, Text} from "@mantine/core";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from "chart.js";
import {Line} from "react-chartjs-2";

import {useGetMonitoringData} from "@/hooks/useGetMonitoringData";
import {getSatisfactionLabel} from "@/pages/monitoring/getSatisfactionLabel";
import {RatesQueryI} from "@/shared/tables/dateI";
import {EmotionPointI, EmotionSessionI} from "@/shared/types/monitoring";
import {formatDates, formatMoscowTime} from "@/shared/utils/formatTime";
import {emotionLabelsRu} from "@/shared/utils/translate";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const emotionColors: Record<string, string> = {
    Angry: "#df4029",
    Disgust: "#805328",
    Fear: "#794934",
    Happy: "#235347",
    Neutral: "#848484",
    Sad: "#3267a8",
    Surprise: "#8EB69B",
};

const buildEmotionOrder = (points: EmotionPointI[]): string[] => {
    const baseOrder = ["Angry", "Disgust", "Fear", "Sad", "Neutral", "Surprise", "Happy"];
    const emotions = new Set(points.map((point) => point.emotion));
    return [
        ...baseOrder.filter((emotion) => emotions.has(emotion)),
        ...Array.from(emotions).filter((emotion) => !baseOrder.includes(emotion)),
    ];
};

export const SessionEmotionChart: FC<RatesQueryI> = ({dates}) => {
    const [query, setQuery] = useState({
        date_from: '',
        date_to: ''
    });
    const [sessions, setSessions] = useState<EmotionSessionI[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

    useEffect(() => {
        setQuery({date_from: dates.date_from, date_to: dates.date_to});
    }, [dates]);

    const {handleGetEmotionSessions} = useGetMonitoringData(query);

    const handleGetData = useCallback(async () => {
        const getData = await handleGetEmotionSessions();
        const nextSessions = getData ?? [];
        setSessions(nextSessions);
        setSelectedSessionId((current) => current ?? nextSessions[0]?.id.toString() ?? null);
    }, [handleGetEmotionSessions]);

    useEffect(() => {
        handleGetData();
    }, [handleGetData]);

    const selectedSession = sessions.find((session) => session.id.toString() === selectedSessionId);
    const points = selectedSession?.json_satisfaction?.emot ?? [];

    const selectData = sessions.map((session) => {
        const {formattedFromDate, formattedToDate} = formatDates(session);
        return {
            value: session.id.toString(),
            label: `Сеанс ${session.id}: терминал ${session.id_raspberry}, ${formattedFromDate} - ${formattedToDate}`,
        };
    });

    const emotionOrder = useMemo(() => buildEmotionOrder(points), [points]);
    const timeLabels = points.map((point) => formatMoscowTime(point.time));

    const chartData = {
        labels: timeLabels,
        datasets: emotionOrder.map((emotion) => ({
            label: emotionLabelsRu[emotion] ?? emotion,
            data: points.map((point) => point.emotion === emotion ? emotionOrder.indexOf(emotion) : null),
            borderColor: emotionColors[emotion] ?? "#2f9e5f",
            backgroundColor: emotionColors[emotion] ?? "#2f9e5f",
            pointRadius: 7,
            pointHoverRadius: 9,
            pointStyle: "rectRounded" as const,
            showLine: false,
        })),
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const point = points[context.dataIndex];
                        return `${emotionLabelsRu[point?.emotion] ?? point?.emotion}: ${formatMoscowTime(point?.time)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Время сеанса",
                },
            },
            y: {
                min: -0.5,
                max: Math.max(emotionOrder.length - 0.5, 0.5),
                ticks: {
                    stepSize: 1,
                    callback: (value: string | number) => emotionLabelsRu[emotionOrder[Number(value)]] ?? emotionOrder[Number(value)] ?? "",
                },
                title: {
                    display: true,
                    text: "Эмоция",
                },
            },
        },
    };

    return (
        <Paper shadow="xs" radius="xs" withBorder p="xl">
            <Stack spacing="md">
                <Select
                    label="Сеанс клиента"
                    placeholder="Выберите сеанс"
                    data={selectData}
                    value={selectedSessionId}
                    onChange={setSelectedSessionId}
                    searchable
                    nothingFound="Сеансы не найдены"
                />
                {selectedSession && (
                    <Text size="sm" color="dimmed">
                        Итоговая оценка: {getSatisfactionLabel(selectedSession.satisfaction)}
                    </Text>
                )}
                {points.length ? (
                    <Box h={420}>
                        <Line data={chartData} options={options}/>
                    </Box>
                ) : (
                    <Alert color="yellow" title="Нет данных для графика">
                        Для выбранного сеанса не найдены покадровые эмоции.
                    </Alert>
                )}
            </Stack>
        </Paper>
    );
};
