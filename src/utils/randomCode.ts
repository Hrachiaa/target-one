import { randomInt } from 'crypto';

export default function randomCode() {
    const num = randomInt(0, 10000);
    return num.toString().padStart(4, '0');
}
