export function formatMinutes(minutes) {
    if (minutes === 0) return '0時間0分';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}分`;
    if (mins === 0) return `${hours}時間`;

    return `${hours}時間${mins}分`;
}
