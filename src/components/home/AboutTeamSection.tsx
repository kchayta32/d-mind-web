import React from 'react';

const AboutTeamSection: React.FC = () => {
  const teamMembers = [
    { name: 'กิตติ ชัยตา', role: 'Trainer', emoji: '👨‍🏫' },
    { name: 'พิชญธิดา ปิยะสอน', role: 'Innovator 1', emoji: '👩‍💻' },
    { name: 'สุกัญญา พ้นทุกข์', role: 'Innovator 2', emoji: '👩‍💻' },
    { name: 'สิรภพ ทองอยู', role: 'Innovator 3', emoji: '👨‍💻' },
  ];

  const mentors = [
    { name: 'อ.กานต์ เจริญจิตร', role: 'Mentor', emoji: '👨‍🏫' },
  ];

  const supportTeam = [
    { name: 'ศตวรรษ อินทรักษ์', role: 'วิศวกรรมคอมพิวเตอร์ มรภ.สวนสุนันทา', emoji: '👨‍💻' },
    { name: 'ธนกฤษ วรรณรังษี', role: 'วิศวกรรมคอมพิวเตอร์ มรภ.สวนสุนันทา', emoji: '👨‍💻' },
    { name: 'ศักดิ์นรินทร์ ศรีจันทร์', role: 'วิศวกรรมคอมพิวเตอร์ มรภ.สวนสุนันทา', emoji: '👨‍💻' },
    { name: 'อภิชัย ประมาณ', role: 'วิศวกรรมคอมพิวเตอร์ มรภ.สวนสุนันทา', emoji: '👨‍💻' },
    { name: 'ธนภร วิรัชมงคลชัย', role: 'วิศวกรรมคอมพิวเตอร์ มรภ.สวนสุนันทา', emoji: '👨‍💻' },
  ];

  return (
    <section className="py-20">
      {/* About the Team */}
      <div className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-3xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-8xl">👥</div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-5xl font-bold mb-6 text-foreground">
                About the<br />team
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                จุดเริ่มต้นของ D-MIND มาจากความมุ่งมั่นของกลุ่มนักพัฒนาใน โครงการ Super AI Engineer Season 5 (Track: AI INNOVATOR) ที่ต้องการใช้เทคโนโลยี AI แก้ปัญหาการรับมือภัยพิบัติที่สังคมไทยเผชิญอยู่
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                ความสำเร็จนี้จะเกิดขึ้นไม่ได้เลยหากปราศจากแรงสนับสนุนอันล้ำค่า เราขอขอบคุณ เมนเทอร์ ทุกท่านที่มอบคำแนะนำและแนวทาง, สมาชิกทีม Secret ที่ทุ่มเททำงานร่วมกันอย่างหนัก และกำลังใจอันดีเยี่ยมจากเพื่อนๆ พี่น้องชาววิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยราชภัฏสวนสุนันทา
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Team - Core Team */}
      <div className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16">Meet the Team</h2>
          
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-5xl">
                  {member.emoji}
                </div>
                <h3 className="font-bold text-xl mb-2">{member.name}</h3>
                <p className="text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>

          {/* Mentor */}
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-8">Mentor</h3>
            {mentors.map((mentor, index) => (
              <div key={index} className="inline-block">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-5xl">
                  {mentor.emoji}
                </div>
                <h3 className="font-bold text-xl mb-2">{mentor.name}</h3>
                <p className="text-gray-400">{mentor.role}</p>
              </div>
            ))}
          </div>

          {/* Support Team */}
          <div>
            <h3 className="text-3xl font-bold text-center mb-8">Meet the Support Team</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
              {supportTeam.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-4xl">
                    {member.emoji}
                  </div>
                  <h4 className="font-bold text-lg mb-1">{member.name}</h4>
                  <p className="text-gray-400 text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeamSection;
