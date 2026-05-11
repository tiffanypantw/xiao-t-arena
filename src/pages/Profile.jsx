import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Save } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function Profile() {
  const navigate = useNavigate();
  const { user, userData, refreshUserData } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    if (userData?.displayName) {
      setDisplayName(userData.displayName);
    }
  }, [userData]);

  const handleSave = async () => {
    const trimmed = displayName.trim();
    if (trimmed.length < 1) {
      setSavedMessage('名字不能空白');
      return;
    }
    if (trimmed.length > 20) {
      setSavedMessage('名字最多 20 個字');
      return;
    }
    
    setSaving(true);
    setSavedMessage('');
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: trimmed,
      });
      await refreshUserData();
      setSavedMessage('✓ 已儲存');
      setTimeout(() => setSavedMessage(''), 2000);
    } catch (err) {
      console.error('儲存失敗', err);
      setSavedMessage('儲存失敗、請再試一次');
    }
    setSaving(false);
  };

  if (!user || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="text-xs text-muted-foreground">個人資料</p>
            <p className="text-sm font-black text-foreground">我的 Profile</p>
          </div>
        </div>

        {/* 頭像 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 mb-4 text-center"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet-200 to-amber-200 flex items-center justify-center mb-3 overflow-hidden">
            {userData.photoURL ? (
              <img 
                src={userData.photoURL} 
                alt="頭像" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-10 h-10 text-violet-600" />
            )}
          </div>
          <p className="text-sm font-bold text-foreground">
            {userData.displayName || '尚未設定名字'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {userData.email}
          </p>
        </motion.div>

        {/* 編輯區 */}
        <div className="bg-white rounded-2xl p-5 space-y-4">
          <div>
            <h2 className="font-black text-foreground mb-1">我想叫什麼名字？</h2>
            <p className="text-xs text-muted-foreground">
              這是 Tiffany 老師和其他人會看到的名字
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="輸入你想呈現的名字"
              maxLength={20}
              className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-foreground"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {displayName.length} / 20 字
              </span>
              {savedMessage && (
                <span className={`text-xs font-semibold ${
                  savedMessage.startsWith('✓') ? 'text-green-600' : 'text-red-500'
                }`}>
                  {savedMessage}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !displayName.trim()}
            className="w-full bg-violet-600 text-white font-black rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? '儲存中...' : '儲存'}
          </button>
        </div>

        {/* 帳號資訊（唯讀） */}
        <div className="bg-white/50 rounded-2xl p-4 mt-4 space-y-2">
          <p className="text-xs text-muted-foreground font-semibold">📧 帳號資訊</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Email</span>
              <span className="text-xs text-foreground">{userData.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">註冊時間</span>
              <span className="text-xs text-foreground">
                {userData.createdAt?.seconds
                  ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString('zh-TW')
                  : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}