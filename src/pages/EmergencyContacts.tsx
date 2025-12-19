import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, ArrowLeft, ShieldAlert, Heart, Flame, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface EmergencyContactProps {
  name: string;
  description: string;
  phoneNumber: string;
  icon?: React.ReactNode;
  color?: string;
}

const EmergencyContacts: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const thaiEmergencyContacts: EmergencyContactProps[] = [
    {
      name: "แจ้งเหตุด่วนเหตุร้าย",
      description: "ศูนย์วิทยุตำรวจ 191",
      phoneNumber: "191",
      icon: <ShieldAlert className="w-6 h-6 text-red-500" />,
      color: "bg-red-50 border-red-100"
    },
    {
      name: "แจ้งเหตุเพลิงไหม้",
      description: "สถานีดับเพลิง",
      phoneNumber: "199",
      icon: <Flame className="w-6 h-6 text-orange-500" />,
      color: "bg-orange-50 border-orange-100"
    },
    {
      name: "หน่วยแพทย์ฉุกเฉิน",
      description: "ศูนย์นเรนทร เจ็บป่วยฉุกเฉิน",
      phoneNumber: "1669",
      icon: <Heart className="w-6 h-6 text-pink-500" />,
      color: "bg-pink-50 border-pink-100"
    },
    {
      name: "กรมป้องกันและบรรเทาสาธารณภัย",
      description: "แจ้งเหตุสาธารณภัย",
      phoneNumber: "1784",
      icon: <Activity className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-50 border-blue-100"
    },
    // More contacts can be added here
    {
      name: "ตำรวจท่องเที่ยว",
      description: "แจ้งเหตุนักท่องเที่ยว",
      phoneNumber: "1155",
      icon: <Phone className="w-6 h-6 text-teal-500" />,
      color: "bg-teal-50 border-teal-100"
    },
    {
      name: "กรมทางหลวง",
      description: "สอบถามเส้นทางจราจร",
      phoneNumber: "1586",
      icon: <Phone className="w-6 h-6 text-slate-500" />,
      color: "bg-slate-50 border-slate-100"
    }
  ];

  const handleCallClick = (name: string, phoneNumber: string) => {
    // In a real mobile app, this would use window.open(`tel:${phoneNumber}`)
    toast({
      title: `กำลังโทรหา ${name}`,
      description: `เบอร์ ${phoneNumber}`,
    });
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => navigate(-1)} className="rounded-full w-10 h-10 p-0">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">เบอร์โทรฉุกเฉิน</h1>
              <p className="text-slate-500">รวมเบอร์โทรสำคัญสำหรับแจ้งเหตุและขอความช่วยเหลือ</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {thaiEmergencyContacts.map((contact, index) => (
              <Card
                key={index}
                className={`border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden group ${contact.color}`}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      {contact.icon || <Phone className="w-6 h-6 text-blue-500" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{contact.name}</h3>
                      <p className="text-slate-500 text-sm mb-1">{contact.description}</p>
                      <p className="text-2xl font-black text-slate-900 tracking-tight">{contact.phoneNumber}</p>
                    </div>
                  </div>

                  <Button
                    size="icon"
                    className="rounded-full bg-green-500 hover:bg-green-600 shadow-green-200 shadow-lg shrink-0 w-12 h-12"
                    onClick={() => handleCallClick(contact.name, contact.phoneNumber)}
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EmergencyContacts;
