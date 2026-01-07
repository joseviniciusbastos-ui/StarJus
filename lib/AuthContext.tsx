import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    officeId: string | null;
    userRole: 'owner' | 'manager' | 'staff' | null;
    officeName: string | null;
    theme: string;
    setTheme: (t: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [officeId, setOfficeId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<'owner' | 'manager' | 'staff' | null>(null);
    const [officeName, setOfficeName] = useState<string | null>(null);
    const [theme, setThemeState] = useState<string>('midnight-gold');

    const applyThemeClass = (t: string) => {
        const root = document.documentElement;
        // Remove all previous theme classes
        const themeClasses = Array.from(root.classList).filter(c => c.startsWith('theme-'));
        themeClasses.forEach(c => root.classList.remove(c));

        // Add new one (unless it's the default midnight-gold which is just dark)
        if (t !== 'midnight-gold') {
            root.classList.add(`theme-${t}`);
        }

        // Sync with .dark class for basic dark mode support if needed
        const lightThemes = ['ivory-business', 'minimalist-slate', 'sunrise-law'];
        if (lightThemes.includes(t)) {
            root.classList.remove('dark');
        } else {
            root.classList.add('dark');
        }
    };

    const setTheme = (t: string) => {
        setThemeState(t);
        applyThemeClass(t);
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) fetchUserOffice(session.user.id);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserOffice(session.user.id);
            } else {
                setOfficeId(null);
                setUserRole(null);
                setOfficeName(null);
                setThemeState('midnight-gold');
                // Remove theme classes on logout
                const themeClasses = Array.from(document.documentElement.classList).filter(c => c.startsWith('theme-'));
                themeClasses.forEach(c => document.documentElement.classList.remove(c));
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserOffice = async (userId: string) => {
        const { data: memberData } = await (supabase
            .from('office_members')
            .select('office_id, role')
            .eq('user_id', userId)
            .single() as any);

        if (memberData) {
            setOfficeId((memberData as any).office_id);
            setUserRole((memberData as any).role as any);

            // Fetch Profile Theme
            const { data: profileData } = await (supabase
                .from('profiles')
                .select('theme_preference')
                .eq('id', userId)
                .single() as any);

            if (profileData) {
                const fetchedTheme = (profileData as any).theme_preference || 'midnight-gold';
                setThemeState(fetchedTheme);
                applyThemeClass(fetchedTheme);
            }

            // Fetch Office Name
            const { data: officeData } = await (supabase
                .from('offices')
                .select('name')
                .eq('id', (memberData as any).office_id)
                .single() as any);

            if (officeData) {
                setOfficeName((officeData as any).name);
            }
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setOfficeId(null);
        setUserRole(null);
        setOfficeName(null);
        setThemeState('midnight-gold');
        const themeClasses = Array.from(document.documentElement.classList).filter(c => c.startsWith('theme-'));
        themeClasses.forEach(c => document.documentElement.classList.remove(c));
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signOut, officeId, userRole, officeName, theme, setTheme }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
