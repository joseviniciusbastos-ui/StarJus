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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [officeId, setOfficeId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<'owner' | 'manager' | 'staff' | null>(null);
    const [officeName, setOfficeName] = useState<string | null>(null);

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
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserOffice = async (userId: string) => {
        const { data: memberData, error: memberError } = await (supabase
            .from('office_members')
            .select('office_id, role')
            .eq('user_id', userId)
            .single() as any);

        if (memberData) {
            setOfficeId((memberData as any).office_id);
            setUserRole((memberData as any).role as any);

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
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signOut, officeId, userRole, officeName }}>
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
