import { MarketplaceUser, TrendingSkill, Skill } from '../types/skill';
import { ExchangeRequest } from '../types/request';
import { Session } from '../types/session';
import { ChatFriend, ChatMessage } from '../types/chat';

export const MOCK_TRENDING_SKILLS: TrendingSkill[] = [
  { id: 1, name: 'React & Next.js', category: 'Web Development', learners_count: 342, teachers_count: 85 },
  { id: 2, name: 'UI/UX Design (Figma)', category: 'Design', learners_count: 289, teachers_count: 64 },
  { id: 3, name: 'Python & Machine Learning', category: 'Data Science', learners_count: 412, teachers_count: 92 },
  { id: 4, name: 'Mobile Dev (Flutter)', category: 'App Development', learners_count: 198, teachers_count: 47 },
  { id: 5, name: 'Digital Marketing & SEO', category: 'Marketing', learners_count: 175, teachers_count: 38 },
  { id: 6, name: 'Spoken English & Communication', category: 'Languages', learners_count: 520, teachers_count: 110 },
  { id: 7, name: 'Cybersecurity & Ethical Hacking', category: 'Security', learners_count: 230, teachers_count: 41 },
  { id: 8, name: 'Video Editing & Motion Graphics', category: 'Multimedia', learners_count: 310, teachers_count: 59 },
];

export const MOCK_MARKETPLACE_USERS: MarketplaceUser[] = [
  {
    id: 101,
    full_name: 'Tanvir Ahmed',
    email: 'tanvir@gmail.com',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Senior Frontend Engineer passionate about React, TypeScript, and micro-interactions. Looking to improve my graphic design skills.',
    rating: 4.9,
    review_count: 28,
    skills_offered: [
      { id: 'so1', skill_name: 'React.js & Tailwind CSS', skill_type: 'offered', proficiency_level: 'Expert', category: 'Web Development' },
      { id: 'so2', skill_name: 'TypeScript & Vite', skill_type: 'offered', proficiency_level: 'Advanced', category: 'Web Development' },
    ],
    skills_wanted: [
      { id: 'sw1', skill_name: 'Figma UI/UX Design', skill_type: 'wanted', proficiency_level: 'Beginner', category: 'Design' },
      { id: 'sw2', skill_name: 'Motion Graphics', skill_type: 'wanted', proficiency_level: 'Beginner', category: 'Multimedia' },
    ],
  },
  {
    id: 102,
    full_name: 'Nusrat Jahan',
    email: 'nusrat@gmail.com',
    profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    bio: 'Product Designer at a FinTech firm. Love creating intuitive design systems. Want to learn Python for data analysis.',
    rating: 5.0,
    review_count: 34,
    skills_offered: [
      { id: 'so3', skill_name: 'Figma Design Systems', skill_type: 'offered', proficiency_level: 'Expert', category: 'Design' },
      { id: 'so4', skill_name: 'User Research & Wireframing', skill_type: 'offered', proficiency_level: 'Advanced', category: 'Design' },
    ],
    skills_wanted: [
      { id: 'sw3', skill_name: 'Python for Beginners', skill_type: 'wanted', proficiency_level: 'Beginner', category: 'Data Science' },
      { id: 'sw4', skill_name: 'SQL Basics', skill_type: 'wanted', proficiency_level: 'Beginner', category: 'Database' },
    ],
  },
  {
    id: 103,
    full_name: 'Rakib Hasan',
    email: 'rakib@gmail.com',
    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'AI researcher and Python backend developer. Happy to teach machine learning in exchange for Flutter app development.',
    rating: 4.8,
    review_count: 19,
    skills_offered: [
      { id: 'so5', skill_name: 'Machine Learning & PyTorch', skill_type: 'offered', proficiency_level: 'Expert', category: 'Data Science' },
      { id: 'so6', skill_name: 'FastAPI & Python', skill_type: 'offered', proficiency_level: 'Advanced', category: 'Backend' },
    ],
    skills_wanted: [
      { id: 'sw5', skill_name: 'Flutter & Dart', skill_type: 'wanted', proficiency_level: 'Intermediate', category: 'App Development' },
    ],
  },
  {
    id: 104,
    full_name: 'Farhana Kabir',
    email: 'farhana@gmail.com',
    profile_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    bio: 'Content strategist & spoken English coach. Eager to master social media video editing and CapCut/Premiere Pro.',
    rating: 4.95,
    review_count: 42,
    skills_offered: [
      { id: 'so7', skill_name: 'Spoken English & IELTS Prep', skill_type: 'offered', proficiency_level: 'Expert', category: 'Languages' },
      { id: 'so8', skill_name: 'Copywriting & Content Strategy', skill_type: 'offered', proficiency_level: 'Advanced', category: 'Marketing' },
    ],
    skills_wanted: [
      { id: 'sw6', skill_name: 'Adobe Premiere Pro', skill_type: 'wanted', proficiency_level: 'Beginner', category: 'Multimedia' },
      { id: 'sw7', skill_name: 'Canva Pro Design', skill_type: 'wanted', proficiency_level: 'Beginner', category: 'Design' },
    ],
  }
];

export const MOCK_REQUESTS: ExchangeRequest[] = [
  {
    id: 1,
    sender_id: 102,
    sender_name: 'Nusrat Jahan',
    sender_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    receiver_id: 1,
    offered_skill_name: 'Figma Design Systems',
    requested_skill_name: 'React.js & Tailwind CSS',
    message: 'Hey! I would love to teach you design systems in Figma in exchange for learning modern React hooks and Tailwind.',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 2,
    sender_id: 1,
    receiver_id: 103,
    receiver_name: 'Rakib Hasan',
    receiver_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    offered_skill_name: 'Frontend Development',
    requested_skill_name: 'Machine Learning & PyTorch',
    message: 'Hello Rakib, looking forward to learning the basics of ML models!',
    status: 'accepted',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export const MOCK_SESSIONS: Session[] = [
  {
    id: 1,
    partner_id: 103,
    partner_name: 'Rakib Hasan',
    partner_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    skill_name: 'Machine Learning & PyTorch',
    scheduled_time: new Date(Date.now() + 3600000 * 24).toISOString(),
    duration_minutes: 60,
    meeting_link: 'https://meet.jit.si/SkillBinimoy-Rakib-Session-103',
    status: 'scheduled',
    notes: 'Introductory session: Setting up PyTorch and understanding neural networks.',
  },
  {
    id: 2,
    partner_id: 104,
    partner_name: 'Farhana Kabir',
    partner_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    skill_name: 'Professional English Communication',
    scheduled_time: new Date(Date.now() - 3600000 * 48).toISOString(),
    duration_minutes: 45,
    meeting_link: 'https://meet.jit.si/SkillBinimoy-Farhana-Session-104',
    status: 'completed',
    notes: 'Great conversation practice and email etiquette advice.',
  },
];

export const MOCK_CHAT_FRIENDS: ChatFriend[] = [
  {
    id: 103,
    full_name: 'Rakib Hasan',
    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    online: true,
    last_message: 'Sounds great! See you tomorrow on Jitsi Meet.',
    last_message_time: '10:45 AM',
    unread_count: 0,
  },
  {
    id: 102,
    full_name: 'Nusrat Jahan',
    profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    online: false,
    last_message: 'I checked your profile, your React projects look awesome!',
    last_message_time: 'Yesterday',
    unread_count: 1,
  },
];

export const MOCK_MESSAGES: Record<number, ChatMessage[]> = {
  103: [
    { id: 1, sender_id: 103, message: 'Hey! Ready for our ML session tomorrow?', timestamp: '10:30 AM' },
    { id: 2, sender_id: 1, message: 'Yes! I have PyTorch installed and Jupyter lab running.', timestamp: '10:35 AM' },
    { id: 3, sender_id: 103, message: 'Sounds great! See you tomorrow on Jitsi Meet.', timestamp: '10:45 AM' },
  ]
};
