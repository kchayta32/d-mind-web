import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, BarChart3, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SurveyForm from '@/components/survey/SurveyForm';
import SurveyResults from '@/components/survey/SurveyResults';
import { useLanguage } from '@/contexts/LanguageProvider';

const SatisfactionSurvey: React.FC = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmitSurvey = (surveyData: any) => {
    console.log('Survey submitted:', surveyData);
    toast({
      title: t('survey.thankYou'),
      description: t('survey.thankYouDesc'),
      duration: 5000,
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-secondary/30 py-12">
        <div className="container max-w-4xl mx-auto px-4">

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-yellow-100 rounded-full mb-4">
              <Star className="w-8 h-8 text-yellow-600 fill-yellow-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t('survey.title')}</h1>
            <p className="text-muted-foreground">{t('survey.subtitle')}</p>
          </div>

          <Tabs defaultValue="survey" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-card shadow-sm border p-1 rounded-full h-auto">
                <TabsTrigger
                  value="survey"
                  className="rounded-full py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t('survey.tabSurvey')}
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="rounded-full py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {t('survey.tabResults')}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="survey" className="space-y-6">
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-border">
                  <CardTitle className="text-center text-xl text-card-foreground">
                    {t('survey.formTitle')}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {t('survey.formDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <SurveyForm onSubmit={handleSubmitSurvey} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-border">
                  <CardTitle className="text-center text-xl text-card-foreground">
                    {t('survey.statsTitle')}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {t('survey.statsDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <SurveyResults />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default SatisfactionSurvey;
