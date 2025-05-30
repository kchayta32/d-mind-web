import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import AppLogo from '@/components/AppLogo';

interface EmergencyContactProps {
  name: string;
  description: string;
  phoneNumber: string;
}

const thaiEmergencyContacts: EmergencyContactProps[] = [
  {
    name: "เบอร์ฉุกเฉิน",
    description: "เบอร์แจ้งเหตุฉุกเฉินทั่วไป",
    phoneNumber: "191"
  },
  {
    name: "แจ้งเหตุด่วนเหตุร้าย",
    description: "ศูนย์วิทยุ 191",
    phoneNumber: "191"
  },
  {
    name: "แจ้งเหตุเพลิงไหม้",
    description: "สถานีดับเพลิง",
    phoneNumber: "199"
  },
  {
    name: "หน่วยแพทย์ฉุกเฉิน",
    description: "ศูนย์นเรนทร",
    phoneNumber: "1669"
  },
  {
    name: "สายด่วนกรมป้องกันและบรรเทาสาธารณภัย",
    description: "แจ้งเหตุสาธารณภัย",
    phoneNumber: "1784"
  },
  {
    name: "มูลนิธิร่วมกตัญญู",
    description: "หน่วยกู้ภัย",
    phoneNumber: "1418"
  },
  {
    name: "ศูนย์เอราวัณ กทม.",
    description: "สำนักการแพทย์ กรุงเทพมหานคร",
    phoneNumber: "1646"
  },
  {
    name: "ศูนย์พิษวิทยา",
    description: "รามาธิบดี",
    phoneNumber: "1367"
  },
  {
    name: "สายด่วนสุขภาพจิต",
    description: "กรมสุขภาพจิต",
    phoneNumber: "1323"
  },
  {
    name: "กรมควบคุมโรค",
    description: "สายด่วนกรมควบคุมโรค",
    phoneNumber: "1422"
  }
];

const EmergencyContacts: React.FC = () => {
  const { toast } = useToast();
  
  const handleCallClick = (name: string, phoneNumber: string) => {
    toast({
      title: `กำลังโทรหา ${name}`,
      description: `เบอร์ ${phoneNumber} (ในแอปที่สมบูรณ์ จะทำการโทรออกจริง)`,
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-guardian-light-blue to-white">
      <div className="container max-w-md mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => window.history.back()} className="mr-2 p-2 hover:bg-guardian-light-blue/50">
            <ArrowLeft size={20} className="text-guardian-blue" />
          </Button>
          <AppLogo className="mr-3" />
          <h1 className="text-xl font-bold text-guardian-dark-blue">เบอร์โทรฉุกเฉิน</h1>
        </div>

        <div className="space-y-4">
          {thaiEmergencyContacts.map((contact, index) => (
            <Card key={index} className="shadow-md border border-guardian-light-blue/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-medium text-guardian-dark-blue">{contact.name}</h2>
                    <p className="text-sm text-muted-foreground">{contact.description}</p>
                    <p className="text-sm font-semibold text-guardian-blue mt-1">{contact.phoneNumber}</p>
                  </div>
                  <Button 
                    className="bg-guardian-blue hover:bg-guardian-dark-blue rounded-full h-10 w-10 p-0 shadow-md"
                    onClick={() => handleCallClick(contact.name, contact.phoneNumber)}
                  >
                    <Phone size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;
