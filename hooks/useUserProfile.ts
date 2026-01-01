
import { useState, useEffect } from 'react';
import { UserProfile } from '../types';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({ 
    name: '',
    birthDate: '', 
    birthTime: '', 
    isLunar: false,
    gender: 'female' 
  });
  const [showProfileInput, setShowProfileInput] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('cheonmyeong_profile');
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
  }, []);

  const saveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('cheonmyeong_profile', JSON.stringify(profile));
    setShowProfileInput(false);
  };

  return { userProfile, setUserProfile, showProfileInput, setShowProfileInput, saveProfile };
};
