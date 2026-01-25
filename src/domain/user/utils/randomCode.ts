import { randomInt } from 'crypto';

export function randomCode(): string {
    const num = randomInt(0, 10000);
    return num.toString().padStart(4, '0');
}
