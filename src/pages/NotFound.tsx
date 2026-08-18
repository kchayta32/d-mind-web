import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors duration-300 p-4">
      <div className="text-center max-w-md bg-card border border-border p-8 rounded-3xl shadow-xl">
        <h1 className="text-6xl font-black mb-2 text-primary tracking-tight">404</h1>
        <p className="text-xl font-bold text-foreground mb-2">Oops! Page not found</p>
        <p className="text-sm text-muted-foreground mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2">
            <Home className="w-4 h-4" />
            {t('common.back')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

