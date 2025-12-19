import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Home,
  Phone,
  Star,
  BookOpen,
  Info,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageProvider';

interface NavigationItem {
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  route?: string;
  href?: string;
  color: string;
}

const NavigationCards: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navigationItems: NavigationItem[] = [
    {
      icon: <Home className="w-8 h-8" />,
      titleKey: 'menu.home',
      descKey: 'navCards.homeDesc',
      route: '/',
      color: 'bg-blue-500'
    },
    {
      icon: <Phone className="w-8 h-8" />,
      titleKey: 'menu.emergency',
      descKey: 'navCards.emergencyDesc',
      route: '/contacts',
      color: 'bg-red-500'
    },
    {
      icon: <Star className="w-8 h-8" />,
      titleKey: 'menu.survey',
      descKey: 'navCards.surveyDesc',
      route: '/satisfaction-survey',
      color: 'bg-yellow-500'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      titleKey: 'menu.research',
      descKey: 'navCards.researchDesc',
      route: '/manual',
      color: 'bg-green-500'
    },
    {
      icon: <Info className="w-8 h-8" />,
      titleKey: 'menu.about',
      descKey: 'navCards.aboutDesc',
      href: 'https://d-mind.my.canva.site/',
      color: 'bg-purple-500'
    },
    {
      icon: <Mail className="w-8 h-8" />,
      titleKey: 'menu.contact',
      descKey: 'navCards.contactDesc',
      route: '/contactme',
      color: 'bg-indigo-500'
    }
  ];

  const handleNavigation = (item: NavigationItem) => {
    if (item.href) {
      window.open(item.href, '_blank');
    } else if (item.route) {
      navigate(item.route);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-secondary to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('navCards.mainMenu')}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t('navCards.selectService')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationItems.map((item, index) => (
              <Card
                key={index}
                className="group cursor-pointer card-hover border-0 overflow-hidden bg-card"
                onClick={() => handleNavigation(item)}
              >
                <CardContent className="p-8">
                  <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t(item.descKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NavigationCards;
