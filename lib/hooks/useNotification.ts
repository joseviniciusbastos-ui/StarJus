import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../supabase';

type NotificationType = 'deadline' | 'pomodoro' | 'financial' | 'email';

interface NotificationOptions {
    title: string;
    message: string;
    sound?: boolean;
    userId?: string;
}

export const useNotification = () => {
    // Legacy sound function
    const playSound = useCallback((type: NotificationType) => {
        const sounds = {
            pomodoro: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
            deadline: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
            financial: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
            email: 'https://assets.mixkit.co/active_storage/sfx/1350/1350-preview.mp3'
        };

        const audio = new Audio(sounds[type]);
        audio.volume = 0.5;
        audio.play().catch(e => console.warn('Sound playback blocked:', e));
    }, []);

    // 1. Send Notification (Save to DB + Toast)
    const notify = useCallback(async (type: NotificationType, options: NotificationOptions) => {
        // Visual Toast
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

        // Audio
        if (options.sound !== false) playSound(type);

        // Save to DB (if user is provided)
        if (options.userId) {
            try {
                await supabase.from('notifications').insert({
                    user_id: options.userId,
                    title: options.title,
                    message: options.message,
                    type: type,
                    is_read: false
                });
            } catch (err) {
                console.error('Failed to save notification:', err);
            }
        }
    }, [playSound]);

    // 2. Fetch Notifications (Hook helper)
    const fetchNotifications = async (userId: string) => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error(error);
            return [];
        }
        return data;
    };

    const markAllRead = async (userId: string) => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId);
    };

    return { notify, playSound, fetchNotifications, markAllRead };
};
