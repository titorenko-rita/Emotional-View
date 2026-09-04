import {JsonTableI} from "@/shared/types/monitoring";

const MOSCOW_TIME_ZONE = "Europe/Moscow";

export function formatDatesWithTimeRange(dateArray: [Date | null, Date | null], startTime: string, endTime: string) {

        const formattedDates = dateArray.map(date => {
            if (date) {
                const year = date!.getFullYear();
                const month = (date!.getMonth() + 1).toString().padStart(2, '0');
                const day = date!.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day} ${startTime}:00`;
            }
        });

        if (Array.isArray(formattedDates) && formattedDates && formattedDates.length) {
            const formattedStartDate = formattedDates[0];
            const formattedEndDate = formattedDates[formattedDates.length - 1]?.replace(startTime, endTime);
            return {
                formattedStartDate,
                formattedEndDate
            }
        } else {
            return {
                formattedStartDate: '',
                formattedEndDate: ""
            }
        }

}


export function formatDates(row: JsonTableI): { formattedToDate: string; formattedFromDate: string } {
    const {date_from, date_to} = row

    return {
        formattedFromDate: formatMoscowDateTime(date_from),
        formattedToDate: formatMoscowDateTime(date_to)
    }
}

export function formatMoscowDateTime(value: string | Date): string {
    const parts = value instanceof Date ? getMoscowParts(value) : parseStoredDateTimeParts(value);

    return `${parts.year}-${parts.month}-${parts.day} ${parts.hours}:${parts.minutes}:${parts.seconds}`;
}

export function formatMoscowTime(value: string | Date): string {
    const parts = value instanceof Date ? getMoscowParts(value) : parseStoredDateTimeParts(value);

    return `${parts.hours}:${parts.minutes}:${parts.seconds}`;
}

function parseStoredDateTimeParts(value: string) {
    const dateTimeParts = value.trim().split(/\s+/);
    const normalizedDateTime = dateTimeParts[0]?.includes("T") ? dateTimeParts[0].split("T") : dateTimeParts;
    const datePart = normalizedDateTime[0];
    const rawTimePart = normalizedDateTime[1] ?? "00:00:00";
    const timePart = rawTimePart.replace(/[zZ]|[+-]\d{2}:?\d{2}$/, "");
    const [hours = "00", minutes = "00", seconds = "00"] = timePart.split(":");
    const cleanSeconds = seconds.split(".")[0] ?? "00";

    if (datePart.includes(".")) {
        const [day, month, year] = datePart.split(".");
        return {
            year,
            month: month.padStart(2, "0"),
            day: day.padStart(2, "0"),
            hours: hours.padStart(2, "0"),
            minutes: minutes.padStart(2, "0"),
            seconds: cleanSeconds.padStart(2, "0"),
        };
    }

    if (datePart.includes("-")) {
        const [year, month, day] = datePart.split("-");
        return {
            year,
            month: month.padStart(2, "0"),
            day: day.padStart(2, "0"),
            hours: hours.padStart(2, "0"),
            minutes: minutes.padStart(2, "0"),
            seconds: cleanSeconds.padStart(2, "0"),
        };
    }

    return getMoscowParts(new Date(value));
}

function getMoscowParts(date: Date) {
    const formatter = new Intl.DateTimeFormat("ru-RU", {
        timeZone: MOSCOW_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const getPart = (type: Intl.DateTimeFormatPartTypes): string => parts.find((part) => part.type === type)?.value ?? "00";

    return {
        year: getPart("year"),
        month: getPart("month"),
        day: getPart("day"),
        hours: getPart("hour"),
        minutes: getPart("minute"),
        seconds: getPart("second"),
    };
}
