import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, ArrowLeft, ShieldAlert, Heart, Flame, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageProvider';

interface EmergencyContactItem {
  nameKey: string;
  descKey: string;
  phoneNumber: string;
  icon: React.ReactNode;
  colorClass: string;
  iconBgClass: string;
}

const EmergencyContacts: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const emergencyContactsList: EmergencyContactItem[] = [
    {
      nameKey: 'contacts.police191',
      descKey: 'contacts.police191Desc',
      phoneNumber: '191',
      icon: <ShieldAlert className="w-6 h-6 text-red-500" />,
      colorClass: 'bg-red-50/70 dark:bg-red-950/20 border-red-200 dark:border-red-900/40',
      iconBgClass: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    },
    {
      nameKey: 'contacts.fire199',
      descKey: 'contacts.fire199Desc',
      phoneNumber: '199',
      icon: <Flame className="w-6 h-6 text-orange-500" />,
      colorClass: 'bg-orange-50/70 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/40',
      iconBgClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
    },
    {
      nameKey: 'contacts.medical1669',
      descKey: 'contacts.medical1669Desc',
      phoneNumber: '1669',
      icon: <Heart className="w-6 h-6 text-pink-500" />,
      colorClass: 'bg-pink-50/70 dark:bg-pink-950/20 border-pink-200 dark:border-pink-900/40',
      iconBgClass: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
    },
    {
      nameKey: 'contacts.disaster1784',
      descKey: 'contacts.disaster1784Desc',
      phoneNumber: '1784',
      icon: <Activity className="w-6 h-6 text-blue-500" />,
      colorClass: 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40',
      iconBgClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    },
    {
      nameKey: 'contacts.tourist1155',
      descKey: 'contacts.tourist1155Desc',
      phoneNumber: '1155',
      icon: <Phone className="w-6 h-6 text-teal-500" />,
      colorClass: 'bg-teal-50/70 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/40',
      iconBgClass: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
    },
    {
      nameKey: 'contacts.highway1586',
      descKey: 'contacts.highway1586Desc',
      phoneNumber: '1586',
      icon: <Phone className="w-6 h-6 text-slate-500" />,
      colorClass: 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800',
      iconBgClass: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
    }
  ];

  const handleCallClick = (name: string, phoneNumber: string) => {
    toast({
      title: t('contacts.calling', { name }),
      description: t('contacts.callNumber', { number: phoneNumber }),
    });
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-12 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="rounded-full w-10 h-10 p-0 border-border bg-card hover:bg-muted text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                {t('contacts.title')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('contacts.subtitle')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyContactsList.map((contact, index) => {
              const name = t(contact.nameKey);
              const desc = t(contact.descKey);

              return (
                <Card
                  key={index}
                  className={`border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden group ${contact.colorClass}`}
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl shadow-sm group-hover:scale-110 transition-transform ${contact.iconBgClass}`}>
                        {contact.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-lg leading-snug">{name}</h3>
                        <p className="text-muted-foreground text-xs mb-1.5">{desc}</p>
                        <p className="text-2xl font-black text-foreground tracking-tight">{contact.phoneNumber}</p>
                      </div>
                    </div>

                    <Button
                      size="icon"
                      className="rounded-full bg-green-500 hover:bg-green-600 text-white shadow-green-500/20 shadow-lg shrink-0 w-12 h-12"
                      onClick={() => handleCallClick(name, contact.phoneNumber)}
                      title={t('contacts.callNow')}
                    >
                      <Phone className="w-5 h-5 fill-white" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EmergencyContacts;

