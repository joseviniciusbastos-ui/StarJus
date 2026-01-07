import { useCallback } from 'react';
import toast from 'react-hot-toast';

type NotificationType = 'deadline' | 'pomodoro' | 'financial' | 'email';

interface NotificationOptions {
    title: string;
    message: string;
    sound?: boolean;
}

export const useNotification = () => {
    const playSound = useCallback((type: NotificationType) => {
        // High-end sound URLs (placeholder for real enterprise assets)
        const sounds = {
            pomodoro: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3', // Gong-like
            deadline: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Alert
            financial: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Coins
            email: 'https://assets.mixkit.co/active_storage/sfx/1350/1350-preview.mp3' // Notification
        };

        const audio = new Audio(sounds[type]);
        audio.volume = 0.5;
        audio.play().catch(e => console.warn('Sound playback blocked by browser:', e));
    }, []);

    const notify = useCallback((type: NotificationType, options: NotificationOptions) => {
        // 1. Browser Notification (if permission granted)
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(options.title, { body: options.message });
        }

        // 2. Visual Toast
        toast(options.message, {
            icon: type === 'pomodoro' ? '⏱️' : type === 'deadline' ? '🚨' : type === 'financial' ? '💰' : '📧',
            style: {
                borderRadius: '1.5rem',
                background: '#000',
                color: '#fff',
                fontFamily: 'Inter',
                fontWeight: '800',
                textTransform: 'uppercase',
                fontSize: '11px',
                letterSpacing: '0.1em'
            }
        });

        // 3. Audio Alert
        if (options.sound !== false) {
            playSound(type);
        }
    }, [playSound]);

    return { notify, playSound };
};
