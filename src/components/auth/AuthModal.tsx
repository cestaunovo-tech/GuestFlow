import React, { useState } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { UserRole } from '../../types';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  signOut
} from '../../lib/firebase';
import { saveUserProfileToFirestore } from '../../services/firebaseDb';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Building,
  CheckCircle2,
  LogOut,
  Sparkles,
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    currentHotel,
    currentRole,
    setCurrentRole,
    currentUser,
    setCurrentUser,
  } = useGuestFlow();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('RECEPCION');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const getDeptForRole = (role: UserRole) => {
    if (role === 'HOUSEKEEPING') return 'HOUSEKEEPING' as const;
    if (role === 'ROOM_SERVICE') return 'ROOM_SERVICE' as const;
    if (role === 'MANTENIMIENTO') return 'MANTENIMIENTO' as const;
    return 'RECEPCION' as const;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (mode === 'login') {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCred.user;
        setCurrentUser({
          id: fbUser.uid,
          hotelId: currentHotel.id,
          name: fbUser.displayName || email.split('@')[0],
          email: fbUser.email || email,
          role: selectedRole,
          department: getDeptForRole(selectedRole),
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          online: true,
        });
        setCurrentRole(selectedRole);
        setSuccessMsg('¡Sesión iniciada con éxito vía Firebase Auth!');
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCred.user;
        const newProfile = {
          id: fbUser.uid,
          hotelId: currentHotel.id,
          name: name || email.split('@')[0],
          email: fbUser.email || email,
          role: selectedRole,
          department: getDeptForRole(selectedRole),
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          online: true,
        };
        await saveUserProfileToFirestore(newProfile);
        setCurrentUser(newProfile);
        setCurrentRole(selectedRole);
        setSuccessMsg('¡Cuenta registrada y guardada en Firestore!');
      }

      try {
        confetti({ particleCount: 30, spread: 50 });
      } catch {
        // ignore
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al autenticar con Firebase.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const userProfile = {
        id: fbUser.uid,
        hotelId: currentHotel.id,
        name: fbUser.displayName || 'Usuario Google',
        email: fbUser.email || '',
        role: selectedRole,
        department: getDeptForRole(selectedRole),
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        online: true,
      };
      await saveUserProfileToFirestore(userProfile);
      setCurrentUser(userProfile);
      setCurrentRole(selectedRole);
      setSuccessMsg('¡Autenticado con Google en Firebase!');

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al iniciar con Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setCurrentRole('GUEST');
      setSuccessMsg('Sesión cerrada correctamente.');
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const quickRoles: Array<{ role: UserRole; label: string; badge: string; desc: string }> = [
    { role: 'GERENCIA', label: 'Gerencia General', badge: 'bg-indigo-100 text-indigo-800', desc: 'KPIs, reportes ejecutivos e inteligencia' },
    { role: 'RECEPCION', label: 'Front Desk / Recepción', badge: 'bg-emerald-100 text-emerald-800', desc: 'Atención 24/7, llamadas y bellboy' },
    { role: 'HOUSEKEEPING', label: 'Housekeeping', badge: 'bg-amber-100 text-amber-800', desc: 'Cartel de puertas, toallas y limpieza' },
    { role: 'ROOM_SERVICE', label: 'Room Service', badge: 'bg-rose-100 text-rose-800', desc: 'Comandero de cocina y entrega' },
    { role: 'MANTENIMIENTO', label: 'Mantenimiento', badge: 'bg-cyan-100 text-cyan-800', desc: 'Incidencias técnicas y climatización' },
    { role: 'HOTEL_ADMIN', label: 'Hotel Admin', badge: 'bg-blue-100 text-blue-800', desc: 'Configuración, catálogo e integraciones' },
    { role: 'SUPER_ADMIN', label: 'Super Admin', badge: 'bg-purple-100 text-purple-800', desc: 'Gestión global de todos los hoteles SaaS' },
  ];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Autenticación &amp; Roles de Personal</h3>
              <p className="text-xs text-teal-200/80">
                Firebase Auth &amp; Firestore Multi-Tenant (RBAC)
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 max-h-[80vh]">
          {/* Active User Status Banner */}
          {currentUser ? (
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                  <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-teal-200 text-teal-900">
                    Rol: {currentUser.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Conectado a Firebase Auth en el hotel <strong>{currentHotel.name}</strong>.</span>
            </div>
          )}

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Role Switcher for Operational Demo */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>Seleccionar Rol Operativo (RBAC)</span>
              <span className="text-[10px] text-slate-400 font-normal">Acceso inmediato</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickRoles.map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(item.role);
                    setCurrentRole(item.role);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex items-start justify-between gap-2 ${
                    currentRole === item.role
                      ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{item.label}</span>
                    <span className="text-[10px] text-slate-500 line-clamp-1">{item.desc}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${item.badge}`}>
                    {item.role.slice(0, 4)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Firebase Email/Password Form */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800">
                {mode === 'login' ? 'Iniciar Sesión con Credenciales' : 'Registrar Nuevo Miembro'}
              </span>
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-xs text-teal-700 font-semibold hover:underline"
              >
                {mode === 'login' ? '¿Crear cuenta nueva?' : '¿Ya tienes cuenta? Entrar'}
              </button>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-3">
              {mode === 'register' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Nombre Completo</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Sofía Martínez"
                      className="w-full text-xs rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-slate-800"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Correo Institucional</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="personal@hotel.com"
                    className="w-full text-xs rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Contraseña</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{loading ? 'Procesando...' : mode === 'login' ? 'Entrar a la Plataforma' : 'Crear Cuenta'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                  title="Acceder con Google"
                >
                  <span>Google</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
