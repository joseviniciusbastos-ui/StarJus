import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface TimerContextType {
    time: number;
    isTimerActive: boolean;
    isPaused: boolean;
    start: () => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    formatTime: (s: number) => string;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [time, setTime] = useState(25 * 60);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<any>(null);

    const start = () => {
        setIsTimerActive(true);
        setIsPaused(false);
    };

    const pause = () => {
        setIsPaused(true);
    };

    const resume = () => {
        setIsPaused(false);
    };

    const stop = () => {
        setIsTimerActive(false);
        setIsPaused(false);
        setTime(25 * 60);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    useEffect(() => {
        if (isTimerActive && !isPaused && time > 0) {
            intervalRef.current = setInterval(() => {
                setTime((prev) => prev - 1);
            }, 1000);
        } else if (time === 0) {
            setIsTimerActive(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isTimerActive, isPaused, time]);

    const formatTime = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;

        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <TimerContext.Provider value={{ time, isTimerActive, isPaused, start, pause, resume, stop, formatTime }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => {
    const context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error('useTimer must be used within a TimerProvider');
    }
    return context;
};
