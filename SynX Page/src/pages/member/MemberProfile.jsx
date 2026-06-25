import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, KeyRound, MapPin, CreditCard, Check, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';

const MemberProfile = () => {
  const user = JSON.parse(localStorage.getItem('synx_user') || '{}');
  const [showPwForm, setShowPwForm] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      setMsg({ ok: false, text: 'Las contraseñas nuevas no coinciden.' });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      await api.put('/member/profile/password', form);
      setMsg({ ok: true, text: 'Contraseña actualizada correctamente.' });
      setForm({ current_password: '', password: '', password_confirmation: '' });
      setShowPwForm(false);
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.message || 'Error al cambiar la contraseña.' });
    } finally { setSaving(false); }
  };

  const infoItems = [
    { icon: User, label: 'Nombre Completo', value: user.name },
    { icon: Mail, label: 'Correo Electrónico', value: user.email },
    { icon: CreditCard, label: 'Carnet de Identidad', value: user.ci_number || 'No registrado' },
    { icon: MapPin, label: 'Sucursal', value: user.branch?.name || 'No asignada' },
  ];

  const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={fadeUp}>
        <h1 className="text-[22px] font-bold text-[#F8FAFC]">Mi Perfil</h1>
        <p className="text-[13px] text-[#D7DCE8]/50">Tus datos registrados en SynX.</p>
      </motion.div>

      {/* Avatar */}
      <motion.div variants={fadeUp} className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6D5DF6] to-[#3A4C8C] flex items-center justify-center text-white text-[26px] font-black shadow-[0_0_20px_rgba(109,93,246,0.3)]">
          {user.name?.charAt(0)}
        </div>
        <div>
          <p className="text-[17px] font-bold text-[#F8FAFC]">{user.name}</p>
          <span className="text-[11px] font-bold text-[#6D5DF6] bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 px-2.5 py-0.5 rounded-full capitalize">
            {user.role === 'member' ? 'Miembro' : user.role}
          </span>
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div variants={fadeUp}
        className="bg-[#12151D]/80 backdrop-blur-2xl border border-[#1E2330] rounded-[1.5rem] overflow-hidden">
        {infoItems.map((item, i) => (
          <div key={item.label}
            className={`flex items-center gap-4 px-5 py-4 ${i < infoItems.length - 1 ? 'border-b border-[#1E2330]/60' : ''}`}>
            <div className="w-9 h-9 rounded-xl bg-[#6D5DF6]/10 border border-[#6D5DF6]/15 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-4 h-4 text-[#6D5DF6]" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] text-[#D7DCE8]/35 font-black uppercase tracking-[0.2em]">{item.label}</p>
              <p className="text-[14px] font-semibold text-[#F8FAFC] truncate">{item.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Change Password */}
      <motion.div variants={fadeUp}
        className="bg-[#12151D]/80 backdrop-blur-2xl border border-[#1E2330] rounded-[1.5rem] overflow-hidden">
        <button onClick={() => setShowPwForm(!showPwForm)}
          className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#1E2330]/30 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-[#F39C12]/10 border border-[#F39C12]/15 flex items-center justify-center flex-shrink-0">
            <KeyRound className="w-4 h-4 text-[#F39C12]" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] text-[#D7DCE8]/35 font-black uppercase tracking-[0.2em]">Seguridad</p>
            <p className="text-[14px] font-semibold text-[#F8FAFC]">Cambiar Contraseña</p>
          </div>
          <span className="text-[12px] text-[#6D5DF6] font-bold">{showPwForm ? 'Cancelar' : 'Cambiar'}</span>
        </button>

        {showPwForm && (
          <motion.form onSubmit={handlePasswordChange} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="px-5 pb-5 space-y-3 border-t border-[#1E2330]">
            <div className="pt-4" />
            {[
              { key: 'current_password', label: 'Contraseña actual', placeholder: 'Tu contraseña actual' },
              { key: 'password', label: 'Nueva contraseña', placeholder: 'Mínimo 6 caracteres' },
              { key: 'password_confirmation', label: 'Confirmar contraseña', placeholder: 'Repite la nueva contraseña' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-[10px] font-bold text-[#D7DCE8]/50 uppercase tracking-wider mb-1.5">{f.label}</label>
                <div className="relative flex items-center border border-[#1E2330] bg-[#040508]/50 rounded-xl focus-within:border-[#6D5DF6]/40 transition-all">
                  <input type={showPw ? 'text' : 'password'} required value={form[f.key]}
                    onChange={e => setForm({...form, [f.key]: e.target.value})}
                    placeholder={f.placeholder}
                    className="flex-1 bg-transparent px-4 py-2.5 text-[13px] text-[#F8FAFC] focus:outline-none placeholder-[#D7DCE8]/20" />
                  {f.key === 'current_password' && (
                    <button type="button" onClick={() => setShowPw(!showPw)} className="pr-4 text-[#D7DCE8]/40 hover:text-white">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {msg && (
              <p className={`text-[12px] font-semibold p-3 rounded-xl border ${msg.ok ? 'text-[#2ECC71] bg-[#2ECC71]/10 border-[#2ECC71]/20' : 'text-[#FF4757] bg-[#FF4757]/10 border-[#FF4757]/20'}`}>
                {msg.text}
              </p>
            )}
            <motion.button type="submit" disabled={saving}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-[#6D5DF6] to-[#3A4C8C] text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(109,93,246,0.2)]">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Guardar nueva contraseña
            </motion.button>
          </motion.form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MemberProfile;
