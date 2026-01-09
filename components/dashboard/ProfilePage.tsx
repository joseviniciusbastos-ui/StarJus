import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { logAudit } from '../../lib/utils/audit';

import { ProfileTabs } from './profile/ProfileTabs';
import { ProfileForm } from './profile/ProfileForm';
import { OfficeSettingsForm } from './profile/OfficeSettingsForm';
import { ExperienceCenter } from './profile/ExperienceCenter';
import { AccountSideStats } from './profile/AccountSideStats';

interface OfficeMember {
    user_id: string;
    role: string;
    joined_at: string;
    profiles: {
        full_name: string;
        avatar_url: string;
    };
}

export const ProfilePage: React.FC = () => {
    const { session, officeId, signOut, userRole, theme, setTheme } = useAuth();

    const [activeTab, setActiveTab] = useState<'profile' | 'office' | 'experience'>('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Profile State
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [credentials, setCredentials] = useState('');
    const [initialFullName, setInitialFullName] = useState('');

    // Office State
    const [officeName, setOfficeName] = useState('');
    const [officeEmail, setOfficeEmail] = useState('');
    const [primaryColor, setPrimaryColor] = useState('#D4AF37');
    const [logoUrl, setLogoUrl] = useState('');
    const [members, setMembers] = useState<OfficeMember[]>([]);

    // Notifications State
    const [notifSound, setNotifSound] = useState(true);
    const [notifEmail, setNotifEmail] = useState(true);
    const [pomodoroSound, setPomodoroSound] = useState('gongo');

    useEffect(() => {
        if (officeId) {
            fetchInitialData();
        }
    }, [officeId]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // 1. Profile Data
            const { data: profile } = await (supabase
                .from('profiles')
                .select('*')
                .eq('id', session?.user?.id)
                .single() as any);

            if (profile) {
                setFullName(profile.full_name || '');
                setInitialFullName(profile.full_name || '');
                setBio(profile.bio || '');
                setCredentials(profile.credentials || '');
                if (profile.notification_settings) {
                    setNotifSound(profile.notification_settings.sound !== false);
                    setNotifEmail(profile.notification_settings.email !== false);
                    setPomodoroSound(profile.notification_settings.timer_sound || 'gongo');
                }
            }

            // 2. Office Data
            const { data: office } = await (supabase
                .from('offices')
                .select('*')
                .eq('id', officeId)
                .single() as any);

            if (office) {
                setOfficeName(office.name || '');
                setOfficeEmail(office.institutional_email || '');
                setPrimaryColor(office.primary_color || '#D4AF37');
                setLogoUrl(office.logo_url || '');
            }

            // 3. Members
            const { data: membersList } = await (supabase
                .from('office_members')
                .select('user_id, role, joined_at, profiles:user_id(full_name, avatar_url)')
                .eq('office_id', officeId) as any);

            setMembers(membersList || []);
        } catch (error) {
            console.error('Error fetching profile data:', error);
            // toast.error('Erro ao carregar');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const { error } = await (supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    theme_preference: theme,
                    notification_settings: {
                        sound: notifSound,
                        email: notifEmail,
                        timer_sound: pomodoroSound
                    },
                    bio: bio,
                    credentials: credentials
                } as any)
                .eq('id', session?.user?.id) as any);

            if (error) throw error;

            await logAudit({
                userId: session?.user?.id || '',
                officeId: officeId || '',
                action: 'UPDATE_PROFILE',
                entityType: 'USER',
                entityId: session?.user?.id,
                oldData: { full_name: initialFullName },
                newData: { full_name: fullName, bio, credentials }
            });

            setInitialFullName(fullName);
            toast.success('Perfil atualizado com sucesso!');
        } catch (error) {
            toast.error('Erro ao sincronizar dados.');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveOffice = async () => {
        if (userRole !== 'owner' && userRole !== 'manager') {
            toast.error('Apenas gestores podem alterar dados do escritório.');
            return;
        }
        setSaving(true);
        try {
            const { error } = await (supabase
                .from('offices')
                .update({
                    name: officeName,
                    institutional_email: officeEmail,
                    primary_color: primaryColor,
                    logo_url: logoUrl
                } as any)
                .eq('id', officeId) as any);

            if (error) throw error;
            toast.success('Escritório atualizado com sucesso!');
        } catch (error) {
            toast.error('Erro ao salvar dados institucionais.');
        } finally {
            setSaving(false);
        }
    };

    const handleThemeChange = (id: string) => {
        setTheme(id);
        const color = ['#D4AF37', '#8B7355', '#00AFB9', '#10B981', '#D946EF'].find((_, i) => i === 0); // Mock color find
        toast.success(`Tema ${id.replace('-', ' ')} ativado`, {
            style: { border: `1px solid ${color}` }
        });
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin shadow-2xl" />
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <ProfileTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userRole={userRole}
                onSignOut={signOut}
                onSave={activeTab === 'office' ? handleSaveOffice : handleSaveProfile}
                isSaving={saving}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                <div className="xl:col-span-2 space-y-12">
                    {activeTab === 'profile' && (
                        <ProfileForm
                            fullName={fullName}
                            setFullName={setFullName}
                            bio={bio}
                            setBio={setBio}
                            credentials={credentials}
                            setCredentials={setCredentials}
                            email={session?.user?.email}
                            userRole={userRole}
                        />
                    )}

                    {activeTab === 'office' && (
                        <OfficeSettingsForm
                            officeName={officeName} setOfficeName={setOfficeName}
                            officeEmail={officeEmail} setOfficeEmail={setOfficeEmail}
                            primaryColor={primaryColor} setPrimaryColor={setPrimaryColor}
                            logoUrl={logoUrl} setLogoUrl={setLogoUrl}
                        />
                    )}

                    {activeTab === 'experience' && (
                        <ExperienceCenter
                            theme={theme} handleThemeChange={handleThemeChange}
                            notifSound={notifSound} setNotifSound={setNotifSound}
                            notifEmail={notifEmail} setNotifEmail={setNotifEmail}
                            pomodoroSound={pomodoroSound} setPomodoroSound={setPomodoroSound}
                        />
                    )}
                </div>

                <AccountSideStats members={members} />
            </div>
        </div>
    );
};
