export const satisfactionFn = (number: number) => {
    if (number === 0) {
        return "Неудовлетворён"
    }
    if (number === 1) {
        return "Частично удовлетворён"
    }
    if (number === 2) {
        return "Полностью удовлетворён"
    }
}