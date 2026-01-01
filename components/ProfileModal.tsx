
import React from 'react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  onSubmit: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ userProfile, setUserProfile, onSubmit }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
      <div className="glass p-8 rounded-[3rem] w-full max-w-md border-yellow-500/20 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
         <h3 className="text-xl font-black mb-6 text-center text-yellow-400 tracking-tight">누구의 운명인가요?</h3>
         <div className="space-y-4">
           <div className="space-y-1.5">
             <label className="text-[10px] text-gray-500 font-bold ml-1">이름</label>
             <input 
               type="text" 
               placeholder="이름을 입력하세요" 
               className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white text-center text-lg font-bold focus:border-yellow-500/50 focus:outline-none" 
               value={userProfile.name} 
               onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} 
             />
           </div>
           <div className="space-y-1.5">
             <label className="text-[10px] text-gray-500 font-bold ml-1">태어난 날짜 8자리</label>
             <input 
               type="text" 
               maxLength={8} 
               placeholder="예: 19980512" 
               className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white text-center text-lg font-bold tracking-widest focus:border-yellow-500/50 focus:outline-none" 
               value={userProfile.birthDate} 
               onChange={(e) => setUserProfile({...userProfile, birthDate: e.target.value.replace(/\D/g, '')})} 
             />
           </div>
           <div className="flex gap-2.5">
              <button 
                onClick={() => setUserProfile({...userProfile, gender: 'female'})} 
                className={`flex-1 py-3.5 rounded-xl font-black border transition-all ${userProfile.gender === 'female' ? 'bg-red-700 border-red-500 shadow-lg' : 'bg-white/5 border-white/10'}`}
              >여성</button>
              <button 
                onClick={() => setUserProfile({...userProfile, gender: 'male'})} 
                className={`flex-1 py-3.5 rounded-xl font-black border transition-all ${userProfile.gender === 'male' ? 'bg-blue-700 border-blue-500 shadow-lg' : 'bg-white/5 border-white/10'}`}
              >남성</button>
           </div>
           <button 
             onClick={onSubmit} 
             className="w-full bg-gradient-to-r from-red-700 to-yellow-600 py-5 rounded-xl font-black text-lg shadow-2xl active:scale-95 transition-all mt-4"
           >준비 완료</button>
         </div>
      </div>
    </div>
  );
};

export default ProfileModal;
