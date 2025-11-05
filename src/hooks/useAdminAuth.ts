
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { User, Session } from '@supabase/supabase-js';

interface AdminAuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  user: User | null;
}

export const useAdminAuth = () => {
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true,
    user: null
  });
  const { toast } = useToast();

  const checkAdminRole = async (userId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .eq('is_active', true)
      .single();

    return !error && !!data;
  };

  useEffect(() => {
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const isAdmin = await checkAdminRole(session.user.id);
          setAuthState({
            isAuthenticated: true,
            isAdmin,
            isLoading: false,
            user: session.user
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
            user: null
          });
        }
      }
    );

    // Check current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const isAdmin = await checkAdminRole(session.user.id);
        setAuthState({
          isAuthenticated: true,
          isAdmin,
          isLoading: false,
          user: session.user
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
          user: null
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "เข้าสู่ระบบไม่สำเร็จ",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        const isAdmin = await checkAdminRole(data.user.id);
        if (!isAdmin) {
          await supabase.auth.signOut();
          toast({
            title: "ไม่มีสิทธิ์เข้าถึง",
            description: "คุณไม่มีสิทธิ์ในการเข้าถึงระบบแอดมิน",
            variant: "destructive",
          });
          return false;
        }

        toast({
          title: "เข้าสู่ระบบสำเร็จ",
          description: "ยินดีต้อนรับสู่ระบบแอดมิน",
        });
        return true;
      }

      return false;
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "ออกจากระบบแล้ว",
      description: "คุณได้ออกจากระบบแอดมินแล้ว",
    });
  };

  return {
    ...authState,
    login,
    logout
  };
};
