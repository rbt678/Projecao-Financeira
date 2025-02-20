// src/lib/uuid-fallback.ts

export const generateUUID = () => {
    let uuid = '';
    const chars = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('');
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case 'x':
                uuid += Math.floor(Math.random() * 16).toString(16);
                break;
            case 'y':
                uuid += (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
            case '-':
            case '4':
                uuid += chars[i];
                break;
        }
    }
    return uuid;
};