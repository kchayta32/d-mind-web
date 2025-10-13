import React from 'react';
import { Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactSection: React.FC = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 text-foreground">Contact</h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Phone */}
            <div className="text-center p-8 rounded-2xl bg-card hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-card-foreground">Phone</h3>
              <a 
                href="tel:+6664-312-4573" 
                className="text-lg text-primary hover:underline"
              >
                (66) 64-312-4573
              </a>
            </div>

            {/* Email */}
            <div className="text-center p-8 rounded-2xl bg-card hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center">
                <Mail className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-card-foreground">Email</h3>
              <a 
                href="mailto:sgtkchayta@gmail.com" 
                className="text-lg text-primary hover:underline break-all"
              >
                sgtkchayta@gmail.com
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Follow Us</h3>
            <div className="flex justify-center gap-6">
              <a
                href="https://www.facebook.com/sgtton.tongkhee.9"
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Facebook className="w-8 h-8 text-white" />
              </a>
              <a
                href="https://www.instagram.com/kchayta"
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Instagram className="w-8 h-8 text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
