const { db } = require('./config/firebase');
const bcrypt = require('bcrypt');

async function seed() {
    console.log('🌱 Starting Firebase Firestore Database Seed...');

    const defaultPassword = await bcrypt.hash('password123', 10);

    const usersData = [
        {
            id: 1,
            full_name: 'Abrar Junaed',
            email: 'abrarjunaed22@gmail.com',
            password: defaultPassword,
            bio: 'Full Stack Engineer exploring React 19, TypeScript, and modern AI systems.',
            profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
            cover_image: null,
            is_verified: true,
            created_at: new Date(Date.now() - 3600000 * 24 * 30).toISOString()
        },
        {
            id: 2,
            full_name: 'Nusrat Jahan',
            email: 'nusrat@gmail.com',
            password: defaultPassword,
            bio: 'Senior Product Designer. Passionate about design tokens, micro-interactions, and accessible UI.',
            profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
            cover_image: null,
            is_verified: true,
            created_at: new Date(Date.now() - 3600000 * 24 * 25).toISOString()
        },
        {
            id: 3,
            full_name: 'Rakib Hasan',
            email: 'rakib@gmail.com',
            password: defaultPassword,
            bio: 'Machine Learning Researcher & Python backend developer. Love neural networks and PyTorch.',
            profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
            cover_image: null,
            is_verified: true,
            created_at: new Date(Date.now() - 3600000 * 24 * 20).toISOString()
        },
        {
            id: 4,
            full_name: 'Farhana Kabir',
            email: 'farhana@gmail.com',
            password: defaultPassword,
            bio: 'IELTS trainer and communication strategist. Seeking video editing and motion graphics exchange.',
            profile_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
            cover_image: null,
            is_verified: true,
            created_at: new Date(Date.now() - 3600000 * 24 * 15).toISOString()
        },
        {
            id: 5,
            full_name: 'Tanvir Ahmed',
            email: 'tanvir@gmail.com',
            password: defaultPassword,
            bio: 'Cross-platform Mobile Developer specializing in Flutter and Dart.',
            profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
            cover_image: null,
            is_verified: true,
            created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString()
        }
    ];

    console.log('Writing users to Firestore...');
    for (const u of usersData) {
        await db.collection('users').doc(String(u.id)).set(u);
    }

    const skillsData = [
        // Abrar (1)
        { id: 1, user_id: 1, skill_name: 'React 19 & Next.js', skill_type: 'teach' },
        { id: 2, user_id: 1, skill_name: 'TypeScript & Tailwind CSS', skill_type: 'teach' },
        { id: 3, user_id: 1, skill_name: 'Figma UI/UX Design', skill_type: 'learn' },
        { id: 4, user_id: 1, skill_name: 'Python & PyTorch', skill_type: 'learn' },

        // Nusrat (2)
        { id: 5, user_id: 2, skill_name: 'Figma UI/UX Design', skill_type: 'teach' },
        { id: 6, user_id: 2, skill_name: 'Design Systems', skill_type: 'teach' },
        { id: 7, user_id: 2, skill_name: 'React 19 & Next.js', skill_type: 'learn' },

        // Rakib (3)
        { id: 8, user_id: 3, skill_name: 'Python & PyTorch', skill_type: 'teach' },
        { id: 9, user_id: 3, skill_name: 'FastAPI Backend', skill_type: 'teach' },
        { id: 10, user_id: 3, skill_name: 'Flutter App Development', skill_type: 'learn' },

        // Farhana (4)
        { id: 11, user_id: 4, skill_name: 'Professional English & Public Speaking', skill_type: 'teach' },
        { id: 12, user_id: 4, skill_name: 'Content Strategy', skill_type: 'teach' },
        { id: 13, user_id: 4, skill_name: 'Video Editing (Premiere Pro)', skill_type: 'learn' },

        // Tanvir (5)
        { id: 14, user_id: 5, skill_name: 'Flutter App Development', skill_type: 'teach' },
        { id: 15, user_id: 5, skill_name: 'FastAPI Backend', skill_type: 'learn' }
    ];

    console.log('Writing skills to Firestore...');
    for (const s of skillsData) {
        await db.collection('skills').doc(String(s.id)).set(s);
    }

    const requestsData = [
        {
            id: 1,
            sender_id: 2,
            receiver_id: 1,
            offered_skill: 'Figma UI/UX Design',
            requested_skill: 'React 19 & Next.js',
            message: 'Hello Abrar, I would love to learn React from you and teach you Figma UI design systems!',
            status: 'Pending',
            created_at: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
            id: 2,
            sender_id: 1,
            receiver_id: 3,
            offered_skill: 'React 19 & Next.js',
            requested_skill: 'Python & PyTorch',
            message: 'Hi Rakib! Interested in exchanging frontend development for PyTorch deep learning coaching.',
            status: 'Accepted',
            created_at: new Date(Date.now() - 3600000 * 48).toISOString()
        }
    ];

    console.log('Writing exchange requests to Firestore...');
    for (const r of requestsData) {
        await db.collection('exchange_requests').doc(String(r.id)).set(r);
    }

    const sessionsData = [
        {
            id: 1,
            request_id: 2,
            scheduled_at: new Date(Date.now() + 3600000 * 24).toISOString(),
            duration_minutes: 60,
            meeting_link: 'https://meet.jit.si/SkillBinimoy-Rakib-Session-2',
            status: 'Upcoming',
            created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
            id: 2,
            request_id: 2,
            scheduled_at: new Date(Date.now() - 3600000 * 72).toISOString(),
            duration_minutes: 45,
            meeting_link: 'https://meet.jit.si/SkillBinimoy-Intro-Call',
            status: 'Completed',
            created_at: new Date(Date.now() - 3600000 * 96).toISOString()
        }
    ];

    console.log('Writing sessions to Firestore...');
    for (const sess of sessionsData) {
        await db.collection('sessions').doc(String(sess.id)).set(sess);
    }

    const messagesData = [
        {
            id: 1,
            sender_id: 3,
            receiver_id: 1,
            message: 'Hello Abrar! Excited for our upcoming PyTorch session.',
            is_read: true,
            created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
            id: 2,
            sender_id: 1,
            receiver_id: 3,
            message: 'Same here Rakib! I reviewed the documentation and have my environment ready.',
            is_read: true,
            created_at: new Date(Date.now() - 3600000 * 1).toISOString()
        }
    ];

    console.log('Writing messages to Firestore...');
    for (const m of messagesData) {
        await db.collection('messages').doc(String(m.id)).set(m);
    }

    const reviewsData = [
        {
            id: 1,
            reviewer_id: 3,
            reviewed_id: 1,
            rating: 5,
            comment: 'Abrar is an outstanding mentor. Guided me step-by-step through React 19 architecture and clean hooks!',
            skill_exchanged: 'React 19 & Next.js',
            created_at: new Date(Date.now() - 3600000 * 48).toISOString()
        },
        {
            id: 2,
            reviewer_id: 4,
            reviewed_id: 1,
            rating: 5,
            comment: 'Super knowledgeable in TypeScript and modern frontend practices. Highly recommended exchange partner.',
            skill_exchanged: 'TypeScript & Tailwind CSS',
            created_at: new Date(Date.now() - 3600000 * 72).toISOString()
        },
        {
            id: 3,
            reviewer_id: 2,
            reviewed_id: 1,
            rating: 5,
            comment: 'Very polite, prompt, and dedicated. The exchange went very smoothly!',
            skill_exchanged: 'Frontend Architecture',
            created_at: new Date(Date.now() - 3600000 * 96).toISOString()
        },
        {
            id: 4,
            reviewer_id: 1,
            reviewed_id: 3,
            rating: 5,
            comment: 'Rakib has deep knowledge in Machine Learning and PyTorch. Excellent teacher.',
            skill_exchanged: 'Python & PyTorch',
            created_at: new Date(Date.now() - 3600000 * 48).toISOString()
        }
    ];

    console.log('Writing reviews to Firestore...');
    for (const rev of reviewsData) {
        await db.collection('reviews').doc(String(rev.id)).set(rev);
    }

    console.log('Updating counters...');
    await db.collection('counters').doc('users').set({ current: 5 }, { merge: true });
    await db.collection('counters').doc('skills').set({ current: 15 }, { merge: true });
    await db.collection('counters').doc('exchange_requests').set({ current: 2 }, { merge: true });
    await db.collection('counters').doc('sessions').set({ current: 2 }, { merge: true });
    await db.collection('counters').doc('messages').set({ current: 2 }, { merge: true });
    await db.collection('counters').doc('reviews').set({ current: 4 }, { merge: true });

    console.log('Updating user review ratings in Firestore...');
    await db.collection('users').doc('1').update({ rating: 5.0, review_count: 3 });
    await db.collection('users').doc('3').update({ rating: 5.0, review_count: 1 });

    console.log('✅ Firebase Firestore Seed Completed Successfully!');
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed error:', err);
    process.exit(1);
});
