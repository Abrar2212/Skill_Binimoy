const { db, getNextId } = require('../config/firebase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const JWT_SECRET = process.env.JWT_SECRET || 'skillBinimoySecret2026XYZ';

// ==========================================
// REGISTER USER
// ==========================================
exports.registerUser = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;
        if (!full_name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Gmail validation
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(email)) {
            return res.status(400).json({ message: 'Only @gmail.com addresses are allowed' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if email already registered in Firestore
        const existingSnap = await db.collection('users').where('email', '==', email.toLowerCase()).limit(1).get();
        if (!existingSnap.empty) {
            return res.status(409).json({ message: 'Email already registered. Please login.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        const userId = await getNextId('users');
        const userDoc = {
            id: userId,
            full_name: full_name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            bio: '',
            profile_image: null,
            cover_image: null,
            is_verified: false,
            verification_code: verificationCode,
            verification_expires: verificationExpires.toISOString(),
            created_at: new Date().toISOString()
        };

        await db.collection('users').doc(String(userId)).set(userDoc);

        console.log(`\n========================================\n🔑 Verification Code for ${email}: ${verificationCode}\n========================================\n`);

        try {
            await sendEmail(
                email,
                'Verify your Skill Binimoy account',
                `Your verification code is: ${verificationCode}. It expires in 10 minutes.`
            );
            return res.status(201).json({
                message: 'Account created! Please check your Gmail for the verification code.',
                email
            });
        } catch (emailErr) {
            console.error('Email error:', emailErr.message);
            return res.status(201).json({
                message: 'Account created, but failed to send verification email. Please try resending the code.',
                email
            });
        }
    } catch (e) {
        console.error('Register error:', e);
        return res.status(500).json({ message: 'Server error: ' + e.message });
    }
};

// ==========================================
// VERIFY EMAIL
// ==========================================
exports.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) return res.status(400).json({ message: 'Email and code are required' });

        const userSnap = await db.collection('users').where('email', '==', email.toLowerCase().trim()).limit(1).get();
        if (userSnap.empty) return res.status(404).json({ message: 'User not found' });

        const userDocRef = userSnap.docs[0].ref;
        const user = userSnap.docs[0].data();

        if (user.is_verified) return res.status(400).json({ message: 'Email already verified' });
        if (user.verification_code !== code.trim()) return res.status(400).json({ message: 'Invalid verification code' });
        if (new Date() > new Date(user.verification_expires)) {
            return res.status(400).json({ message: 'Verification code expired' });
        }

        await userDocRef.update({
            is_verified: true,
            verification_code: null,
            verification_expires: null
        });

        return res.status(200).json({ message: 'Email verified successfully! You can now login.' });
    } catch (err) {
        console.error('Verify email error:', err);
        return res.status(500).json({ message: 'Verification failed' });
    }
};

// ==========================================
// FORGOT PASSWORD
// ==========================================
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const successMsg = { message: 'If that email is registered, a reset code has been sent.' };
        const userSnap = await db.collection('users').where('email', '==', email.toLowerCase().trim()).limit(1).get();
        if (userSnap.empty) return res.status(200).json(successMsg);

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        await userSnap.docs[0].ref.update({
            reset_code: resetCode,
            reset_code_expires: resetExpires.toISOString()
        });

        console.log(`\n========================================\n🔑 Reset Code for ${email}: ${resetCode}\n========================================\n`);

        try {
            await sendEmail(
                email,
                'Password Reset Code - Skill Binimoy',
                `Your password reset code is: ${resetCode}. It expires in 10 minutes.`
            );
            return res.status(200).json(successMsg);
        } catch (emailErr) {
            console.error('Send reset email error:', emailErr.message);
            return res.status(500).json({ message: 'Failed to send email. Try again later.' });
        }
    } catch (err) {
        console.error('Forgot password error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// RESET PASSWORD
// ==========================================
exports.resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const userSnap = await db.collection('users').where('email', '==', email.toLowerCase().trim()).limit(1).get();
        if (userSnap.empty) return res.status(400).json({ message: 'Invalid email or code' });

        const userDocRef = userSnap.docs[0].ref;
        const user = userSnap.docs[0].data();

        if (user.reset_code !== code.trim()) return res.status(400).json({ message: 'Invalid reset code' });
        if (new Date() > new Date(user.reset_code_expires)) return res.status(400).json({ message: 'Reset code expired' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userDocRef.update({
            password: hashedPassword,
            reset_code: null,
            reset_code_expires: null
        });

        return res.status(200).json({ message: 'Password reset successfully! You can now login.' });
    } catch (err) {
        console.error('Reset password error:', err);
        return res.status(500).json({ message: 'Failed to reset password' });
    }
};

// ==========================================
// RESEND CODE
// ==========================================
exports.resendCode = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const userSnap = await db.collection('users')
            .where('email', '==', email.toLowerCase().trim())
            .where('is_verified', '==', false)
            .limit(1)
            .get();

        if (userSnap.empty) {
            return res.status(404).json({ message: 'User not found or already verified' });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 10 * 60 * 1000);

        await userSnap.docs[0].ref.update({
            verification_code: verificationCode,
            verification_expires: verificationExpires.toISOString()
        });

        console.log(`\n========================================\n🔑 Resent Verification Code for ${email}: ${verificationCode}\n========================================\n`);

        try {
            await sendEmail(
                email,
                'Your New Verification Code',
                `Your new verification code is: ${verificationCode}. It expires in 10 minutes.`
            );
            return res.status(200).json({ message: 'New code sent to your Gmail!' });
        } catch (emailErr) {
            return res.status(500).json({ message: 'Failed to send email. Try again.' });
        }
    } catch (err) {
        console.error('Resend code error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// LOGIN USER
// ==========================================
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

        const userSnap = await db.collection('users').where('email', '==', email.toLowerCase().trim()).limit(1).get();
        if (userSnap.empty) return res.status(401).json({ message: 'Invalid email or password' });

        const user = userSnap.docs[0].data();

        // Check verification status
        if (!user.is_verified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.', email: user.email });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                profile_image: user.profile_image || null,
                cover_image: user.cover_image || null,
                headline: user.headline || '',
                location: user.location || '',
                website: user.website || '',
                github: user.github || '',
                linkedin: user.linkedin || '',
                phone: user.phone || '',
                rating: user.rating || 5.0,
                review_count: user.review_count || 0
            }
        });
    } catch (e) {
        console.error('Login error:', e);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// ==========================================
// GET PROFILE
// ==========================================
exports.getProfile = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        let userDoc = await db.collection('users').doc(String(userId)).get();
        if (!userDoc.exists && req.user.email) {
            const snap = await db.collection('users').where('email', '==', req.user.email.toLowerCase().trim()).limit(1).get();
            if (!snap.empty) {
                userDoc = snap.docs[0];
            }
        }
        if (!userDoc.exists) {
            const initialDoc = {
                id: userId || 1,
                full_name: 'Member',
                email: req.user.email || '',
                bio: '',
                profile_image: null,
                cover_image: null,
                headline: '',
                location: '',
                website: '',
                github: '',
                linkedin: '',
                phone: '',
                is_verified: true,
                created_at: new Date().toISOString()
            };
            await db.collection('users').doc(String(userId || 1)).set(initialDoc, { merge: true });
            userDoc = await db.collection('users').doc(String(userId || 1)).get();
        }

        const userData = userDoc.data();
        const user = {
            id: userData.id,
            full_name: userData.full_name,
            email: userData.email,
            bio: userData.bio || '',
            profile_image: userData.profile_image || null,
            cover_image: userData.cover_image || null,
            headline: userData.headline || '',
            location: userData.location || '',
            website: userData.website || '',
            github: userData.github || '',
            linkedin: userData.linkedin || '',
            phone: userData.phone || '',
            is_verified: userData.is_verified || false,
            created_at: userData.created_at
        };

        // 1. Get user skills
        const skillsSnap = await db.collection('skills').where('user_id', '==', userId).get();
        const skillMap = new Map();
        skillsSnap.docs.forEach(doc => {
            const d = doc.data();
            const sid = d.id !== undefined ? d.id : doc.id;
            if (!skillMap.has(sid)) {
                skillMap.set(sid, {
                    id: sid,
                    skill_name: d.skill_name,
                    skill_type: d.skill_type
                });
            }
        });
        const skills = Array.from(skillMap.values());

        user.skills_teach = skills.filter(s => s.skill_type === 'teach');
        user.skills_learn = skills.filter(s => s.skill_type === 'learn');

        // 2. Compute Active Sessions & Pending Proposals
        const senderReqs = await db.collection('exchange_requests').where('sender_id', '==', userId).get();
        const receiverReqs = await db.collection('exchange_requests').where('receiver_id', '==', userId).get();

        const userReqIds = new Set();
        let pendingRequestsCount = 0;

        senderReqs.forEach(doc => {
            userReqIds.add(doc.data().id);
        });
        receiverReqs.forEach(doc => {
            userReqIds.add(doc.data().id);
            if (doc.data().status === 'Pending') {
                pendingRequestsCount += 1;
            }
        });

        let activeSessionsCount = 0;
        if (userReqIds.size > 0) {
            const sessionsSnap = await db.collection('sessions').get();
            sessionsSnap.forEach(doc => {
                const s = doc.data();
                if (userReqIds.has(s.request_id) && s.status !== 'Completed' && s.status !== 'Cancelled') {
                    activeSessionsCount += 1;
                }
            });
        }

        // 3. Compute Reputation & Reviews
        const reviewsSnap = await db.collection('reviews').where('reviewed_id', '==', userId).get();
        const totalReviews = reviewsSnap.size;
        let avgRating = 5.0;
        if (totalReviews > 0) {
            let sum = 0;
            reviewsSnap.forEach(doc => {
                sum += Number(doc.data().rating) || 5;
            });
            avgRating = Math.round((sum / totalReviews) * 10) / 10;
        }

        user.rating = avgRating;
        user.review_count = totalReviews;

        const stats = {
            skills_shared: user.skills_teach.length,
            skills_learned: user.skills_learn.length,
            active_sessions: activeSessionsCount,
            total_reviews: totalReviews,
            average_rating: avgRating,
            pending_proposals: pendingRequestsCount
        };

        return res.status(200).json({ user, stats });
    } catch (err) {
        console.error('Get profile error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// UPDATE PROFILE
// ==========================================
exports.updateProfile = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const { full_name, bio, profile_image, cover_image, headline, location, website, github, linkedin, phone } = req.body;

        if (!full_name || full_name.trim().length < 2) {
            return res.status(400).json({ message: 'Full name must be at least 2 characters' });
        }

        const updateData = {
            id: userId,
            full_name: full_name.trim(),
            bio: bio !== undefined ? bio : ''
        };

        if (profile_image !== undefined) updateData.profile_image = profile_image;
        if (cover_image !== undefined) updateData.cover_image = cover_image;
        if (headline !== undefined) updateData.headline = headline.trim();
        if (location !== undefined) updateData.location = location.trim();
        if (website !== undefined) updateData.website = website.trim();
        if (github !== undefined) updateData.github = github.trim();
        if (linkedin !== undefined) updateData.linkedin = linkedin.trim();
        if (phone !== undefined) updateData.phone = phone.trim();

        let userDocRef = db.collection('users').doc(String(userId));
        let userDoc = await userDocRef.get();
        if (!userDoc.exists && req.user.email) {
            const snap = await db.collection('users').where('email', '==', req.user.email.toLowerCase().trim()).limit(1).get();
            if (!snap.empty) {
                userDocRef = snap.docs[0].ref;
            }
        }

        await userDocRef.set(updateData, { merge: true });

        const updatedDoc = await userDocRef.get();
        const userData = updatedDoc.data();

        const returnUser = {
            id: userData.id || userId,
            full_name: userData.full_name,
            email: userData.email || req.user.email,
            bio: userData.bio || '',
            profile_image: userData.profile_image || null,
            cover_image: userData.cover_image || null,
            headline: userData.headline || '',
            location: userData.location || '',
            website: userData.website || '',
            github: userData.github || '',
            linkedin: userData.linkedin || '',
            phone: userData.phone || '',
            is_verified: userData.is_verified !== undefined ? userData.is_verified : true,
            created_at: userData.created_at || new Date().toISOString()
        };

        return res.status(200).json({
            message: 'Profile updated successfully!',
            user: returnUser
        });
    } catch (err) {
        console.error('Update profile error:', err);
        return res.status(500).json({ message: 'Failed to update profile' });
    }
};

// ==========================================
// ADD SKILL
// ==========================================
exports.addSkill = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const { skill_name, skill_type } = req.body;

        if (!skill_name || !skill_type) return res.status(400).json({ message: 'Skill name and type required' });
        if (!['teach', 'learn'].includes(skill_type)) return res.status(400).json({ message: 'skill_type must be teach or learn' });

        const skillId = await getNextId('skills');
        const skillData = {
            id: skillId,
            user_id: userId,
            skill_name: skill_name.trim(),
            skill_type,
            created_at: new Date().toISOString()
        };

        await db.collection('skills').doc(String(skillId)).set(skillData);

        return res.status(201).json({
            message: 'Skill added!',
            skill: { id: skillId, skill_name: skill_name.trim(), skill_type }
        });
    } catch (err) {
        console.error('Add skill error:', err);
        return res.status(500).json({ message: 'Failed to add skill' });
    }
};

// ==========================================
// DELETE SKILL
// ==========================================
exports.deleteSkill = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const skillId = parseInt(req.params.id);

        const skillRef = db.collection('skills').doc(String(skillId));
        const skillDoc = await skillRef.get();

        if (!skillDoc.exists || skillDoc.data().user_id !== userId) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        await skillRef.delete();
        return res.status(200).json({ message: 'Skill deleted!' });
    } catch (err) {
        console.error('Delete skill error:', err);
        return res.status(500).json({ message: 'Failed to delete skill' });
    }
};

// ==========================================
// GET ALL USERS (Marketplace)
// ==========================================
exports.getAllUsers = async (req, res) => {
    try {
        let currentUserId = null;
        if (req.user && req.user.id) {
            currentUserId = parseInt(req.user.id);
        } else {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                try {
                    const token = authHeader.split(' ')[1];
                    const decoded = jwt.verify(token, JWT_SECRET);
                    currentUserId = decoded.id;
                } catch (e) {}
            }
        }

        // Fetch all users
        const usersSnap = await db.collection('users').get();
        const users = [];
        const userIds = [];

        usersSnap.forEach(doc => {
            const u = doc.data();
            if (u.id !== currentUserId) {
                users.push({
                    id: u.id,
                    full_name: u.full_name,
                    email: u.email,
                    bio: u.bio || '',
                    profile_image: u.profile_image || null,
                    rating: u.rating || 5.0,
                    review_count: u.review_count || 0,
                    skills_teach: [],
                    skills_learn: []
                });
                userIds.push(u.id);
            }
        });

        if (users.length === 0) return res.status(200).json({ users: [] });

        // Fetch all skills
        const skillsSnap = await db.collection('skills').get();
        const skillsByUser = new Map();

        skillsSnap.forEach(doc => {
            const s = doc.data();
            if (!skillsByUser.has(s.user_id)) {
                skillsByUser.set(s.user_id, { teach: [], learn: [] });
            }
            if (s.skill_type === 'teach') skillsByUser.get(s.user_id).teach.push(s.skill_name);
            else if (s.skill_type === 'learn') skillsByUser.get(s.user_id).learn.push(s.skill_name);
        });

        const currentUserSkills = skillsByUser.get(currentUserId) || { teach: [], learn: [] };
        const myTeach = currentUserSkills.teach || [];
        const myLearn = currentUserSkills.learn || [];

        users.forEach(u => {
            const userSkills = skillsByUser.get(u.id);
            if (userSkills) {
                u.skills_teach = userSkills.teach;
                u.skills_learn = userSkills.learn;
            }

            // AI Match calculation based on profile
            const canTeachMe = (u.skills_teach || []).filter(st => 
                myLearn.some(ml => ml.toLowerCase().includes(st.toLowerCase()) || st.toLowerCase().includes(ml.toLowerCase()))
            );
            const wantsFromMe = (u.skills_learn || []).filter(sl => 
                myTeach.some(mt => mt.toLowerCase().includes(sl.toLowerCase()) || sl.toLowerCase().includes(mt.toLowerCase()))
            );
            const isReciprocal = canTeachMe.length > 0 && wantsFromMe.length > 0;

            let score = 0;
            let matchType = 'none';
            if (isReciprocal) {
                score = 98;
                matchType = 'reciprocal';
            } else if (canTeachMe.length > 0) {
                score = 85;
                matchType = 'mentor';
            } else if (wantsFromMe.length > 0) {
                score = 70;
                matchType = 'learner';
            }

            u.ai_match = {
                score,
                match_type: matchType,
                is_reciprocal: isReciprocal,
                can_teach_me: canTeachMe,
                wants_from_me: wantsFromMe,
                reason: isReciprocal 
                    ? `100% Reciprocal Trade: Offers ${canTeachMe[0]} and wants ${wantsFromMe[0]}!`
                    : canTeachMe.length > 0
                    ? `Teaches your wishlist skill: ${canTeachMe[0]}`
                    : wantsFromMe.length > 0
                    ? `Looking for what you teach: ${wantsFromMe[0]}`
                    : null
            };
        });

        return res.status(200).json({ users, my_profile_ready: myTeach.length > 0 && myLearn.length > 0 });
    } catch (err) {
        console.error('Get all users error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// GET TRADE POSTS (Marketplace Posts)
// ==========================================
exports.getTradePosts = async (req, res) => {
    try {
        let currentUserId = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, JWT_SECRET);
                currentUserId = decoded.id;
            } catch (e) {}
        }

        const [postsSnap, usersSnap, skillsSnap] = await Promise.all([
            db.collection('trade_posts').get(),
            db.collection('users').get(),
            db.collection('skills').get()
        ]);

        const usersMap = new Map();
        usersSnap.forEach(doc => {
            const u = doc.data();
            usersMap.set(u.id, {
                name: u.full_name,
                image: u.profile_image || null,
                rating: u.rating || 5.0,
                headline: u.headline || '',
                review_count: u.review_count || 0
            });
        });

        const skillsByUser = new Map();
        skillsSnap.forEach(d => {
            const s = d.data();
            if (!skillsByUser.has(s.user_id)) skillsByUser.set(s.user_id, { teach: [], learn: [] });
            if (s.skill_type === 'teach') skillsByUser.get(s.user_id).teach.push(s.skill_name);
            else if (s.skill_type === 'learn') skillsByUser.get(s.user_id).learn.push(s.skill_name);
        });

        const mySkills = currentUserId ? (skillsByUser.get(currentUserId) || { teach: [], learn: [] }) : { teach: [], learn: [] };
        const myTeach = mySkills.teach || [];
        const myLearn = mySkills.learn || [];

        const posts = [];
        postsSnap.forEach(doc => {
            const p = doc.data();
            const userInfo = usersMap.get(p.user_id) || { name: 'Community Member', image: null, rating: 5.0, headline: '', review_count: 0 };
            
            // Calculate AI match based on user's profile
            const offersWhatIWant = myLearn.some(l => 
                l.toLowerCase().includes(p.offered_skill.toLowerCase()) || p.offered_skill.toLowerCase().includes(l.toLowerCase())
            );
            const wantsWhatIOffer = myTeach.some(t => 
                t.toLowerCase().includes(p.requested_skill.toLowerCase()) || p.requested_skill.toLowerCase().includes(t.toLowerCase())
            );
            const isReciprocal = offersWhatIWant && wantsWhatIOffer;

            let aiScore = 0;
            let matchType = 'none';
            if (isReciprocal) {
                aiScore = 98;
                matchType = 'reciprocal';
            } else if (offersWhatIWant) {
                aiScore = 85;
                matchType = 'wishlist';
            } else if (wantsWhatIOffer) {
                aiScore = 75;
                matchType = 'offer';
            }

            posts.push({
                ...p,
                user_name: userInfo.name,
                user_image: userInfo.image,
                user_rating: userInfo.rating,
                user_headline: userInfo.headline,
                user_review_count: userInfo.review_count,
                is_own_post: currentUserId ? p.user_id === currentUserId : false,
                ai_match: {
                    score: aiScore,
                    match_type: matchType,
                    is_reciprocal: isReciprocal,
                    reason: isReciprocal 
                        ? `✨ 100% AI Reciprocal Match: Offers ${p.offered_skill} (which you want), seeks ${p.requested_skill} (which you teach)!`
                        : offersWhatIWant
                        ? `🎯 Teaches a skill on your wishlist: ${p.offered_skill}`
                        : wantsWhatIOffer
                        ? `💡 Wants a skill you can teach: ${p.requested_skill}`
                        : null
                }
            });
        });

        // Default sort: highest AI match first, then newest
        posts.sort((a, b) => {
            if ((b.ai_match?.score || 0) !== (a.ai_match?.score || 0)) {
                return (b.ai_match?.score || 0) - (a.ai_match?.score || 0);
            }
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        return res.status(200).json({ posts, my_profile_ready: myTeach.length > 0 && myLearn.length > 0 });
    } catch (err) {
        console.error('Get trade posts error:', err);
        return res.status(500).json({ message: 'Failed to fetch trade posts' });
    }
};

// ==========================================
// CREATE TRADE POST (Marketplace)
// ==========================================
exports.createTradePost = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const { title, offered_skill, requested_skill, description, availability } = req.body;

        if (!title || !title.trim()) return res.status(400).json({ message: 'Trade title is required' });
        if (!offered_skill || !offered_skill.trim()) return res.status(400).json({ message: 'Offered skill is required' });
        if (!requested_skill || !requested_skill.trim()) return res.status(400).json({ message: 'Requested skill is required' });

        const postId = await getNextId('trade_posts');
        const postDoc = {
            id: postId,
            user_id: userId,
            title: title.trim(),
            offered_skill: offered_skill.trim(),
            requested_skill: requested_skill.trim(),
            description: description ? description.trim() : '',
            availability: availability ? availability.trim() : 'Flexible schedule',
            status: 'Open',
            created_at: new Date().toISOString()
        };

        await db.collection('trade_posts').doc(String(postId)).set(postDoc);

        // Ensure user's offered_skill and requested_skill are recorded in user profile
        const existingSkills = await db.collection('skills').where('user_id', '==', userId).get();
        const hasTeach = existingSkills.docs.some(d => d.data().skill_type === 'teach' && d.data().skill_name.toLowerCase() === offered_skill.trim().toLowerCase());
        const hasLearn = existingSkills.docs.some(d => d.data().skill_type === 'learn' && d.data().skill_name.toLowerCase() === requested_skill.trim().toLowerCase());

        if (!hasTeach) {
            const sid = await getNextId('skills');
            await db.collection('skills').doc(String(sid)).set({
                id: sid,
                user_id: userId,
                skill_name: offered_skill.trim(),
                skill_type: 'teach',
                created_at: new Date().toISOString()
            });
        }
        if (!hasLearn) {
            const sid = await getNextId('skills');
            await db.collection('skills').doc(String(sid)).set({
                id: sid,
                user_id: userId,
                skill_name: requested_skill.trim(),
                skill_type: 'learn',
                created_at: new Date().toISOString()
            });
        }

        return res.status(201).json({ message: 'Trade offer published successfully!', post: postDoc });
    } catch (err) {
        console.error('Create trade post error:', err);
        return res.status(500).json({ message: 'Failed to create trade post' });
    }
};

// ==========================================
// DELETE TRADE POST
// ==========================================
exports.deleteTradePost = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const postId = String(req.params.id);

        const postRef = db.collection('trade_posts').doc(postId);
        const postDoc = await postRef.get();

        if (!postDoc.exists) return res.status(404).json({ message: 'Trade post not found' });
        if (postDoc.data().user_id !== userId) return res.status(403).json({ message: 'Not authorized to delete this trade post' });

        await postRef.delete();
        return res.status(200).json({ message: 'Trade post deleted successfully' });
    } catch (err) {
        console.error('Delete trade post error:', err);
        return res.status(500).json({ message: 'Failed to delete trade post' });
    }
};

// ==========================================
// SEND REQUEST
// ==========================================
exports.sendRequest = async (req, res) => {
    try {
        const sender_id = parseInt(req.user.id);
        const { receiver_id, offered_skill, requested_skill, message } = req.body;

        if (!receiver_id) return res.status(400).json({ message: 'Receiver required' });
        const targetReceiverId = parseInt(receiver_id);

        // Check duplicate pending request
        const dupSnap = await db.collection('exchange_requests')
            .where('sender_id', '==', sender_id)
            .where('receiver_id', '==', targetReceiverId)
            .where('status', '==', 'Pending')
            .limit(1)
            .get();

        if (!dupSnap.empty) {
            return res.status(409).json({ message: 'Request already sent to this user' });
        }

        const requestId = await getNextId('exchange_requests');
        const requestData = {
            id: requestId,
            sender_id,
            receiver_id: targetReceiverId,
            offered_skill: offered_skill || '',
            requested_skill: requested_skill || '',
            message: message || '',
            status: 'Pending',
            created_at: new Date().toISOString()
        };

        await db.collection('exchange_requests').doc(String(requestId)).set(requestData);
        return res.status(201).json({ message: 'Request sent successfully!' });
    } catch (err) {
        console.error('Send request error:', err);
        return res.status(500).json({ message: 'Failed to send request' });
    }
};

// ==========================================
// GET MY REQUESTS (Both incoming & outgoing)
// ==========================================
exports.getRequests = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);

        const [recvSnap, sentSnap] = await Promise.all([
            db.collection('exchange_requests').where('receiver_id', '==', userId).get(),
            db.collection('exchange_requests').where('sender_id', '==', userId).get()
        ]);

        const requestsMap = new Map();
        recvSnap.forEach(doc => requestsMap.set(String(doc.data().id), doc.data()));
        sentSnap.forEach(doc => requestsMap.set(String(doc.data().id), doc.data()));

        const requests = Array.from(requestsMap.values());
        requests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // Collect all distinct user IDs
        const userIds = new Set();
        requests.forEach(r => {
            if (r.sender_id) userIds.add(r.sender_id);
            if (r.receiver_id) userIds.add(r.receiver_id);
        });

        // Parallel fetch all needed user docs in one batch
        const userDocs = await Promise.all(
            Array.from(userIds).map(uid => db.collection('users').doc(String(uid)).get())
        );
        const userMap = new Map();
        userDocs.forEach(doc => {
            if (doc.exists) {
                const d = doc.data();
                userMap.set(d.id, {
                    name: d.full_name || 'Community Member',
                    image: d.profile_image || null
                });
            }
        });

        for (const r of requests) {
            const senderInfo = userMap.get(r.sender_id) || { name: 'Community Member', image: null };
            const receiverInfo = userMap.get(r.receiver_id) || { name: 'Community Member', image: null };

            r.sender_name = senderInfo.name;
            r.sender_image = senderInfo.image;
            r.receiver_name = receiverInfo.name;
            r.receiver_image = receiverInfo.image;

            // Attach partner info relative to current user
            if (r.sender_id === userId) {
                r.partner_name = receiverInfo.name;
                r.partner_image = receiverInfo.image;
                r.direction = 'outgoing';
            } else {
                r.partner_name = senderInfo.name;
                r.partner_image = senderInfo.image;
                r.direction = 'incoming';
            }
        }

        return res.status(200).json({ requests });
    } catch (err) {
        console.error('Get requests error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// UPDATE REQUEST STATUS
// ==========================================
exports.updateRequest = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const requestId = parseInt(req.params.id);
        const { status } = req.body;

        if (!['Accepted', 'Rejected', 'Cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const reqRef = db.collection('exchange_requests').doc(String(requestId));
        const reqDoc = await reqRef.get();

        if (!reqDoc.exists) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const reqData = reqDoc.data();

        // If cancelling, must be the sender
        if (status === 'Cancelled' && reqData.sender_id !== userId) {
            return res.status(403).json({ message: 'Only sender can cancel a request' });
        }

        // If accepting/rejecting, must be the receiver
        if (['Accepted', 'Rejected'].includes(status) && reqData.receiver_id !== userId) {
            return res.status(403).json({ message: 'Only receiver can accept or reject a request' });
        }

        await reqRef.update({ status });
        return res.status(200).json({ message: `Request ${status}` });
    } catch (err) {
        console.error('Update request error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// GET SESSIONS
// ==========================================
exports.getSessions = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);

        // 1. Fetch exchange requests in parallel
        const [senderReqs, receiverReqs, sessionsSnap] = await Promise.all([
            db.collection('exchange_requests').where('sender_id', '==', userId).get(),
            db.collection('exchange_requests').where('receiver_id', '==', userId).get(),
            db.collection('sessions').limit(30).get()
        ]);

        const requestsMap = new Map();
        senderReqs.forEach(doc => requestsMap.set(doc.data().id, doc.data()));
        receiverReqs.forEach(doc => requestsMap.set(doc.data().id, doc.data()));

        if (requestsMap.size === 0) return res.status(200).json({ sessions: [] });

        const relevantSessions = [];
        const seenSessionIds = new Set();
        sessionsSnap.forEach(doc => {
            const s = doc.data();
            const sid = s.id !== undefined ? s.id : doc.id;
            if (requestsMap.has(s.request_id) && !seenSessionIds.has(sid)) {
                seenSessionIds.add(sid);
                relevantSessions.push({ ...s, id: sid });
            }
        });

        // Collect distinct user IDs
        const userIds = new Set();
        relevantSessions.forEach(s => {
            const er = requestsMap.get(s.request_id);
            if (er) {
                if (er.sender_id) userIds.add(er.sender_id);
                if (er.receiver_id) userIds.add(er.receiver_id);
            }
        });

        // Parallel fetch all needed user docs
        const userDocs = await Promise.all(
            Array.from(userIds).map(uid => db.collection('users').doc(String(uid)).get())
        );
        const userMap = new Map();
        userDocs.forEach(doc => {
            if (doc.exists) {
                userMap.set(doc.data().id, doc.data().full_name || 'Member');
            }
        });

        // Join data
        for (const s of relevantSessions) {
            const er = requestsMap.get(s.request_id);
            s.offered_skill = er.offered_skill;
            s.requested_skill = er.requested_skill;
            s.sender_id = er.sender_id;
            s.receiver_id = er.receiver_id;

            s.sender_name = userMap.get(er.sender_id) || 'Member';
            s.receiver_name = userMap.get(er.receiver_id) || 'Member';
            s.partner_name = er.sender_id === userId ? s.receiver_name : s.sender_name;
        }

        relevantSessions.sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at));
        return res.status(200).json({ sessions: relevantSessions });
    } catch (err) {
        console.error('Get sessions error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// CREATE SESSION (after accept)
// ==========================================
exports.createSession = async (req, res) => {
    try {
        const { request_id, scheduled_at, duration_minutes, meeting_link } = req.body;
        if (!request_id || !scheduled_at) {
            return res.status(400).json({ message: 'request_id and scheduled_at required' });
        }

        const sessionId = await getNextId('sessions');
        const sessionData = {
            id: sessionId,
            request_id: parseInt(request_id),
            scheduled_at,
            duration_minutes: duration_minutes ? parseInt(duration_minutes) : 60,
            meeting_link: meeting_link || '',
            status: 'Upcoming',
            created_at: new Date().toISOString()
        };

        await db.collection('sessions').doc(String(sessionId)).set(sessionData);
        return res.status(201).json({ message: 'Session scheduled!', session_id: sessionId });
    } catch (err) {
        console.error('Create session error:', err);
        return res.status(500).json({ message: 'Failed to create session' });
    }
};

// ==========================================
// GET MESSAGES
// ==========================================
exports.getMessages = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const otherUserId = parseInt(req.params.userId);

        // Fetch messages where (sender == user && receiver == other) OR (sender == other && receiver == user)
        const [snap1, snap2] = await Promise.all([
            db.collection('messages')
                .where('sender_id', '==', userId)
                .where('receiver_id', '==', otherUserId)
                .get(),
            db.collection('messages')
                .where('sender_id', '==', otherUserId)
                .where('receiver_id', '==', userId)
                .get()
        ]);

        const messages = [];
        const unreadBatch = db.batch();

        snap1.forEach(doc => messages.push(doc.data()));
        snap2.forEach(doc => {
            const data = doc.data();
            messages.push(data);
            if (!data.is_read) {
                unreadBatch.update(doc.ref, { is_read: true });
            }
        });

        await unreadBatch.commit();

        messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        // Fetch sender names in parallel
        const senderIds = Array.from(new Set(messages.map(m => m.sender_id)));
        const senderDocs = await Promise.all(
            senderIds.map(uid => db.collection('users').doc(String(uid)).get())
        );
        const senderMap = new Map();
        senderDocs.forEach(doc => {
            if (doc.exists) senderMap.set(doc.data().id, doc.data().full_name);
        });

        messages.forEach(m => {
            m.sender_name = senderMap.get(m.sender_id) || 'Member';
        });

        return res.status(200).json({ messages });
    } catch (err) {
        console.error('Get messages error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// SEND MESSAGE
// ==========================================
exports.sendMessage = async (req, res) => {
    try {
        const sender_id = parseInt(req.user.id);
        const { receiver_id, message } = req.body;

        if (!receiver_id || !message) return res.status(400).json({ message: 'receiver_id and message required' });

        const msgId = await getNextId('messages');
        const messageData = {
            id: msgId,
            sender_id,
            receiver_id: parseInt(receiver_id),
            message: message.trim(),
            is_read: false,
            created_at: new Date().toISOString()
        };

        await db.collection('messages').doc(String(msgId)).set(messageData);
        return res.status(201).json({ message: 'Message sent!', id: msgId });
    } catch (err) {
        console.error('Send message error:', err);
        return res.status(500).json({ message: 'Failed to send message' });
    }
};

// ==========================================
// GET CHAT USERS
// ==========================================
exports.getChatUsers = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);

        const [sentSnap, recvSnap] = await Promise.all([
            db.collection('messages').where('sender_id', '==', userId).get(),
            db.collection('messages').where('receiver_id', '==', userId).get()
        ]);

        const partnerIds = new Set();
        sentSnap.forEach(d => partnerIds.add(d.data().receiver_id));
        recvSnap.forEach(d => partnerIds.add(d.data().sender_id));
        partnerIds.delete(userId);

        if (partnerIds.size === 0) {
            return res.status(200).json({ users: [] });
        }

        const userResults = await Promise.all(
            Array.from(partnerIds).map(async (pId) => {
                const [uDoc, unreadSnap] = await Promise.all([
                    db.collection('users').doc(String(pId)).get(),
                    db.collection('messages')
                        .where('receiver_id', '==', userId)
                        .where('sender_id', '==', pId)
                        .where('is_read', '==', false)
                        .get()
                ]);
                if (!uDoc.exists) return null;
                const u = uDoc.data();
                return {
                    id: u.id,
                    full_name: u.full_name,
                    profile_image: u.profile_image || null,
                    unread: unreadSnap.size
                };
            })
        );

        return res.status(200).json({ users: userResults.filter(Boolean) });
    } catch (err) {
        console.error('Get chat users error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// ==========================================
// GET REVIEWS
// ==========================================
exports.getReviews = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId || req.user.id);
        const reviewsSnap = await db.collection('reviews')
            .where('reviewed_id', '==', userId)
            .get();

        const reviewMap = new Map();
        reviewsSnap.docs.forEach(doc => {
            const d = doc.data();
            const rid = d.id !== undefined ? d.id : doc.id;
            if (!reviewMap.has(rid)) {
                reviewMap.set(rid, { ...d, id: rid });
            }
        });
        const reviews = Array.from(reviewMap.values());
        reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const reviewerIds = Array.from(new Set(reviews.map(r => r.reviewer_id).filter(Boolean)));
        const userDocs = await Promise.all(
            reviewerIds.map(uid => db.collection('users').doc(String(uid)).get())
        );
        const userMap = new Map();
        userDocs.forEach(doc => {
            if (doc.exists) {
                const u = doc.data();
                userMap.set(u.id, {
                    name: u.full_name || 'Member',
                    image: u.profile_image || null
                });
            }
        });

        for (const r of reviews) {
            const u = userMap.get(r.reviewer_id);
            r.reviewer_name = u ? u.name : 'Member';
            r.reviewer_image = u ? u.image : null;
        }

        return res.status(200).json({ reviews });
    } catch (err) {
        console.error('Get reviews error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// ADD REVIEW
// ==========================================
exports.addReview = async (req, res) => {
    try {
        const reviewer_id = parseInt(req.user.id);
        const { reviewed_id, rating, comment, skill_exchanged } = req.body;

        if (!reviewed_id || !rating) {
            return res.status(400).json({ message: 'reviewed_id and rating are required' });
        }

        const reviewId = await getNextId('reviews');
        const reviewData = {
            id: reviewId,
            reviewer_id,
            reviewed_id: parseInt(reviewed_id),
            rating: Number(rating),
            comment: comment || '',
            skill_exchanged: skill_exchanged || '',
            created_at: new Date().toISOString()
        };

        await db.collection('reviews').doc(String(reviewId)).set(reviewData);

        // Update target user's aggregated rating in users doc
        const revSnap = await db.collection('reviews').where('reviewed_id', '==', parseInt(reviewed_id)).get();
        let sum = 0;
        revSnap.forEach(d => { sum += Number(d.data().rating) || 5; });
        const avg = revSnap.size > 0 ? Math.round((sum / revSnap.size) * 10) / 10 : Number(rating);

        await db.collection('users').doc(String(reviewed_id)).update({
            rating: avg,
            review_count: revSnap.size
        });

        return res.status(201).json({ message: 'Review submitted successfully', review: reviewData });
    } catch (err) {
        console.error('Add review error:', err);
        return res.status(500).json({ message: 'Failed to submit review' });
    }
};

// ==========================================
// GET FRIENDS (accepted exchange requests only)
// ==========================================
exports.getFriends = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);

        const [snap1, snap2] = await Promise.all([
            db.collection('exchange_requests')
                .where('sender_id', '==', userId)
                .where('status', '==', 'Accepted')
                .get(),
            db.collection('exchange_requests')
                .where('receiver_id', '==', userId)
                .where('status', '==', 'Accepted')
                .get()
        ]);

        const friendIds = new Set();
        snap1.forEach(d => friendIds.add(d.data().receiver_id));
        snap2.forEach(d => friendIds.add(d.data().sender_id));
        friendIds.delete(userId);

        const friendDocs = await Promise.all(
            Array.from(friendIds).map(fId => db.collection('users').doc(String(fId)).get())
        );

        const friends = [];
        friendDocs.forEach(uDoc => {
            if (uDoc.exists) {
                const u = uDoc.data();
                friends.push({
                    id: u.id,
                    full_name: u.full_name,
                    profile_image: u.profile_image || null
                });
            }
        });

        return res.status(200).json({ friends });
    } catch (err) {
        console.error('Get friends error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// CREATE GROUP
// ==========================================
exports.createGroup = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const { group_name, member_ids } = req.body;

        if (!group_name || !member_ids || !member_ids.length) {
            return res.status(400).json({ message: 'Group name and members required' });
        }

        const groupId = await getNextId('groups');
        const groupData = {
            id: groupId,
            name: group_name.trim(),
            created_by: userId,
            created_at: new Date().toISOString()
        };

        await db.collection('groups').doc(String(groupId)).set(groupData);

        // Add creator + all members
        const allMembers = [...new Set([userId, ...member_ids.map(Number)])];
        const batch = db.batch();

        for (const mId of allMembers) {
            const memberRef = db.collection('group_members').doc(`${groupId}_${mId}`);
            batch.set(memberRef, {
                group_id: groupId,
                user_id: mId,
                joined_at: new Date().toISOString()
            });
        }

        await batch.commit();
        return res.status(201).json({ message: 'Group created!', group_id: groupId });
    } catch (err) {
        console.error('Create group error:', err);
        return res.status(500).json({ message: 'Failed to create group' });
    }
};

// ==========================================
// GET MY GROUPS
// ==========================================
exports.getGroups = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);

        const memSnap = await db.collection('group_members').where('user_id', '==', userId).get();
        if (memSnap.empty) return res.status(200).json({ groups: [] });

        const groupIds = Array.from(new Set(memSnap.docs.map(doc => doc.data().group_id)));

        const groupResults = await Promise.all(
            groupIds.map(async (gId) => {
                const [gDoc, allMembersSnap, msgSnap] = await Promise.all([
                    db.collection('groups').doc(String(gId)).get(),
                    db.collection('group_members').where('group_id', '==', gId).get(),
                    db.collection('group_messages').where('group_id', '==', gId).get()
                ]);

                if (!gDoc.exists) return null;
                const gData = gDoc.data();

                let lastMessage = null;
                if (!msgSnap.empty) {
                    const allMsgs = msgSnap.docs.map(d => d.data());
                    allMsgs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    lastMessage = allMsgs[0].message;
                }

                return {
                    id: gData.id,
                    name: gData.name,
                    created_by: gData.created_by,
                    created_at: gData.created_at,
                    member_count: allMembersSnap.size,
                    last_message: lastMessage
                };
            })
        );

        const groups = groupResults.filter(Boolean);
        groups.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return res.status(200).json({ groups });
    } catch (err) {
        console.error('Get groups error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// GET GROUP MESSAGES
// ==========================================
exports.getGroupMessages = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const groupId = parseInt(req.params.groupId);

        // Check if member
        const memDoc = await db.collection('group_members').doc(`${groupId}_${userId}`).get();
        if (!memDoc.exists) {
            return res.status(403).json({ message: 'Not a member of this group' });
        }

        const msgSnap = await db.collection('group_messages')
            .where('group_id', '==', groupId)
            .get();

        const messages = msgSnap.docs.map(d => d.data());
        messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        const senderIds = Array.from(new Set(messages.map(m => m.sender_id)));
        const senderDocs = await Promise.all(
            senderIds.map(uid => db.collection('users').doc(String(uid)).get())
        );
        const senderMap = new Map();
        senderDocs.forEach(doc => {
            if (doc.exists) {
                const u = doc.data();
                senderMap.set(u.id, {
                    name: u.full_name,
                    image: u.profile_image || null
                });
            }
        });

        for (const m of messages) {
            const sender = senderMap.get(m.sender_id);
            m.sender_name = sender ? sender.name : 'Member';
            m.sender_image = sender ? sender.image : null;
        }

        return res.status(200).json({ messages });
    } catch (err) {
        console.error('Get group messages error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// SEND GROUP MESSAGE
// ==========================================
exports.sendGroupMessage = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const groupId = parseInt(req.params.groupId);
        const { message } = req.body;

        if (!message) return res.status(400).json({ message: 'Message required' });

        const memDoc = await db.collection('group_members').doc(`${groupId}_${userId}`).get();
        if (!memDoc.exists) {
            return res.status(403).json({ message: 'Not a member of this group' });
        }

        const msgId = await getNextId('group_messages');
        const msgData = {
            id: msgId,
            group_id: groupId,
            sender_id: userId,
            message: message.trim(),
            created_at: new Date().toISOString()
        };

        await db.collection('group_messages').doc(String(msgId)).set(msgData);
        return res.status(201).json({ message: 'Sent!', id: msgId });
    } catch (err) {
        console.error('Send group message error:', err);
        return res.status(500).json({ message: 'Failed to send message' });
    }
};

// ==========================================
// GET GROUP MEMBERS
// ==========================================
exports.getGroupMembers = async (req, res) => {
    try {
        const groupId = parseInt(req.params.groupId);
        const memSnap = await db.collection('group_members').where('group_id', '==', groupId).get();

        const uIds = Array.from(new Set(memSnap.docs.map(doc => doc.data().user_id)));
        const userDocs = await Promise.all(
            uIds.map(uid => db.collection('users').doc(String(uid)).get())
        );

        const members = [];
        userDocs.forEach(uDoc => {
            if (uDoc.exists) {
                const u = uDoc.data();
                members.push({
                    id: u.id,
                    full_name: u.full_name,
                    profile_image: u.profile_image || null
                });
            }
        });

        return res.status(200).json({ members });
    } catch (err) {
        console.error('Get group members error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// AI CHATBOT (Binimoy AI Assistant - Dynamic & Concise)
// ==========================================
exports.chatWithBot = async (req, res) => {
    const { message, history } = req.body;
    if (!message || !message.trim()) {
        return res.status(400).json({ message: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(200).json({
            reply: "Please set your `GEMINI_API_KEY` in `backend/.env` to chat with the AI assistant."
        });
    }

    // Resolve User Identity
    let currentUserId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            currentUserId = decoded.id;
        } catch (e) {}
    }
    if (!currentUserId && req.body.userId) {
        currentUserId = parseInt(req.body.userId);
    }

    // Fetch live community members, skills, requests, and sessions from Firestore
    let allUsers = [];
    let currentUser = null;
    let peers = [];
    let userRequests = [];

    try {
        const [usersSnap, skillsSnap] = await Promise.all([
            db.collection('users').get(),
            db.collection('skills').get()
        ]);

        const skillsByUser = new Map();
        skillsSnap.forEach(d => {
            const s = d.data();
            if (!skillsByUser.has(s.user_id)) skillsByUser.set(s.user_id, { teach: [], learn: [] });
            if (s.skill_type === 'teach') skillsByUser.get(s.user_id).teach.push(s.skill_name);
            else if (s.skill_type === 'learn') skillsByUser.get(s.user_id).learn.push(s.skill_name);
        });

        usersSnap.forEach(d => {
            const u = d.data();
            const skills = skillsByUser.get(u.id) || { teach: [], learn: [] };
            allUsers.push({
                id: u.id,
                full_name: u.full_name,
                bio: u.bio || '',
                rating: u.rating || 5.0,
                skills_teach: skills.teach,
                skills_learn: skills.learn
            });
        });

        if (currentUserId) {
            currentUser = allUsers.find(u => u.id === currentUserId) || null;
            const [sentSnap, recvSnap] = await Promise.all([
                db.collection('exchange_requests').where('sender_id', '==', currentUserId).get(),
                db.collection('exchange_requests').where('receiver_id', '==', currentUserId).get()
            ]);
            sentSnap.forEach(d => userRequests.push(d.data()));
            recvSnap.forEach(d => userRequests.push(d.data()));
        }
        peers = allUsers.filter(u => currentUser && u.id !== currentUser.id);
    } catch (dbErr) {
        console.warn('Chatbot directory fetch error:', dbErr.message);
    }

    const userTeaches = currentUser ? currentUser.skills_teach : [];
    const userLearns = currentUser ? currentUser.skills_learn : [];

    // Helper: Find a peer by name
    const findPeer = (nameStr) => {
        if (!nameStr) return null;
        const q = nameStr.toLowerCase().trim();
        return peers.find(p => p.full_name.toLowerCase().includes(q) || q.includes(p.full_name.toLowerCase())) || null;
    };

    try {
        const systemInstruction = `You are Binimoy AI, the powerful and concise AI assistant for "Skill Binimoy" (a peer-to-peer skill barter platform where users exchange knowledge for free).

CURRENT LOGGED-IN USER:
- Name: ${currentUser ? currentUser.full_name : 'Guest User'}
- Skills to Learn: ${userLearns.length > 0 ? userLearns.join(', ') : 'None added yet'}
- Skills to Teach: ${userTeaches.length > 0 ? userTeaches.join(', ') : 'None added yet'}

LIVE COMMUNITY PEERS & AVAILABLE TRADERS:
${peers.map(p => `- ${p.full_name} (${p.rating}★) | Teaches: [${p.skills_teach.join(', ')}] | Wants: [${p.skills_learn.join(', ')}]`).join('\n')}

ACTIVE USER REQUESTS:
${userRequests.map(r => `- Request #${r.id} with Partner ID ${r.sender_id === currentUserId ? r.receiver_id : r.sender_id}: Status [${r.status}] (${r.offered_skill} ↔ ${r.requested_skill})`).join('\n') || 'None'}

PLATFORM ACTIONS YOU CAN TRIGGER:
You have real-time website integration to execute user commands:
1. SEND AN EXCHANGE REQUEST:
   If the user asks to send a request, propose a trade, contact, or barter with someone (e.g. "Send request to Nusrat", "Propose trade with Rakib"):
   Add this tag at the very end of your response:
   [[ACTION:SEND_REQUEST|PeerName|OfferedSkill|RequestedSkill]]

2. SCHEDULE A 1-ON-1 VIDEO SESSION:
   If the user asks to schedule a video session, create a video call, or meet with a partner (e.g. "Schedule session with Nusrat", "Start video call"):
   Add this tag at the very end of your response:
   [[ACTION:SCHEDULE_SESSION|PartnerName|Topic]]

3. SUGGEST A BARTER ACTION BUTTON:
   Whenever you recommend a specific peer to the user:
   Add this tag at the very end of your response so the user gets an instant 1-click barter button:
   [[ACTION:SUGGEST_BARTER|PeerName|OfferedSkill|RequestedSkill]]

RULES & CONSTRAINTS:
1. Identify the best reciprocal matches where peer teaches what user wants, and peer wants what user teaches.
2. ULTRA-CONCISE: Answers must be short, punchy (2-4 sentences max). No long essays or walls of text!
3. If user has not added skills yet, ask which skill they want to learn and can teach.`;

        const contents = [];
        if (Array.isArray(history)) {
            const validHistory = history.slice(-6);
            for (const item of validHistory) {
                if (item.role && item.text) {
                    contents.push({
                        role: item.role === 'user' ? 'user' : 'model',
                        parts: [{ text: item.text }]
                    });
                }
            }
        }
        contents.push({
            role: 'user',
            parts: [{ text: message.trim() }]
        });

        // Model Hierarchy: Prioritize configured Pro model, then robust fallbacks
        const candidateModels = [];
        if (process.env.GEMINI_MODEL) {
            candidateModels.push(process.env.GEMINI_MODEL);
        }
        candidateModels.push(
            'gemini-3.1-pro-preview',
            'gemini-pro-latest',
            'gemini-2.5-pro',
            'gemini-3.5-flash-lite',
            'gemini-3.1-flash-lite',
            'gemini-3.8-flash',
            'gemini-flash-lite-latest',
            'gemini-flash-latest'
        );

        const uniqueModels = [...new Set(candidateModels)];
        let replyText = null;

        for (const model of uniqueModels) {
            try {
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 12000);

                const response = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    signal: controller.signal,
                    body: JSON.stringify({
                        system_instruction: {
                            parts: [{ text: systemInstruction }]
                        },
                        contents,
                        generationConfig: {
                            temperature: 0.5,
                            maxOutputTokens: 250
                        }
                    })
                });
                clearTimeout(timeoutId);

                const data = await response.json();
                if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                    replyText = data.candidates[0].content.parts[0].text;
                    break;
                } else {
                    console.warn(`Model ${model} issue:`, data?.error?.message || response.statusText);
                }
            } catch (modelErr) {
                console.warn(`Model ${model} request error:`, modelErr.message);
            }
        }

        // Action detection & execution
        let actionResult = null;
        const msgLower = message.toLowerCase();

        // 1. Check for action tag in Gemini reply
        const actionMatch = replyText ? replyText.match(/\[\[ACTION:(SEND_REQUEST|SCHEDULE_SESSION|SUGGEST_BARTER)\|([^|]+)\|?([^|]*)?\|?([^\]]*)?\]\]/) : null;

        let actionType = actionMatch ? actionMatch[1] : null;
        let actionPeerName = actionMatch ? actionMatch[2]?.trim() : null;
        let actionParam1 = actionMatch ? actionMatch[3]?.trim() : null;
        let actionParam2 = actionMatch ? actionMatch[4]?.trim() : null;

        // Fallback intent detection if Gemini didn't use the tag
        if (!actionType) {
            const peerMentioned = peers.find(p => msgLower.includes(p.full_name.toLowerCase()) || msgLower.includes(p.full_name.split(' ')[0].toLowerCase()));
            if (peerMentioned) {
                if (msgLower.includes('send request') || msgLower.includes('propose') || msgLower.includes('contact') || msgLower.includes('trade with')) {
                    actionType = 'SEND_REQUEST';
                    actionPeerName = peerMentioned.full_name;
                    actionParam1 = userTeaches[0] || 'Skill Barter';
                    actionParam2 = peerMentioned.skills_teach[0] || 'Learning Session';
                } else if (msgLower.includes('session') || msgLower.includes('video call') || msgLower.includes('schedule') || msgLower.includes('meet')) {
                    actionType = 'SCHEDULE_SESSION';
                    actionPeerName = peerMentioned.full_name;
                    actionParam1 = peerMentioned.skills_teach[0] || '1-on-1 Video Session';
                }
            }
        }

        // Clean action tag from text
        if (replyText) {
            replyText = replyText.replace(/\[\[ACTION:[^\]]+\]\]/g, '').trim();
        }

        // Execute action if detected
        if (actionType === 'SEND_REQUEST' && actionPeerName) {
            const targetPeer = findPeer(actionPeerName);
            if (!currentUser) {
                replyText = (replyText ? replyText + '\n\n' : '') + 'Please log in to your account first so I can send the exchange request on your behalf.';
            } else if (targetPeer) {
                const offered = actionParam1 || userTeaches[0] || 'Skill Exchange';
                const requested = actionParam2 || targetPeer.skills_teach[0] || 'Skill Exchange';

                // Check existing pending request
                const existing = userRequests.find(r => 
                    (r.sender_id === targetPeer.id || r.receiver_id === targetPeer.id) && r.status === 'Pending'
                );

                if (existing) {
                    replyText = (replyText ? replyText + '\n\n' : '') + `You already have a pending exchange request with ${targetPeer.full_name} in your Requests tab!`;
                    actionResult = {
                        type: 'request_sent',
                        data: {
                            requestId: existing.id,
                            partnerName: targetPeer.full_name,
                            offeredSkill: existing.offered_skill || offered,
                            requestedSkill: existing.requested_skill || requested,
                            alreadyPending: true
                        }
                    };
                } else {
                    const requestId = await getNextId('exchange_requests');
                    const requestData = {
                        id: requestId,
                        sender_id: currentUser.id,
                        receiver_id: targetPeer.id,
                        offered_skill: offered,
                        requested_skill: requested,
                        message: `Hi ${targetPeer.full_name.split(' ')[0]}! I would love to barter skills with you (Proposed via Skill Binimoy AI Assistant).`,
                        status: 'Pending',
                        created_at: new Date().toISOString()
                    };
                    await db.collection('exchange_requests').doc(String(requestId)).set(requestData);

                    replyText = (replyText ? replyText + '\n\n' : '') + `✅ Exchange proposal sent to ${targetPeer.full_name}! Offering ${offered} for ${requested}. It is now live in your Requests section.`;
                    actionResult = {
                        type: 'request_sent',
                        data: {
                            requestId,
                            partnerName: targetPeer.full_name,
                            offeredSkill: offered,
                            requestedSkill: requested
                        }
                    };
                }
            }
        } else if (actionType === 'SCHEDULE_SESSION' && actionPeerName) {
            const targetPeer = findPeer(actionPeerName);
            if (!currentUser) {
                replyText = (replyText ? replyText + '\n\n' : '') + 'Please log in to your account first to schedule a video session.';
            } else if (targetPeer) {
                const topic = actionParam1 || targetPeer.skills_teach[0] || 'Skill Exchange';
                const acceptedReq = userRequests.find(r => 
                    r.status === 'Accepted' && (r.sender_id === targetPeer.id || r.receiver_id === targetPeer.id)
                );

                if (acceptedReq) {
                    const sessionId = await getNextId('sessions');
                    const meetingLink = `https://meet.jit.si/skillbinimoy-session-${sessionId}`;
                    const sessionData = {
                        id: sessionId,
                        request_id: acceptedReq.id,
                        scheduled_at: new Date(Date.now() + 3600000).toISOString(),
                        duration_minutes: 60,
                        meeting_link: meetingLink,
                        status: 'Upcoming',
                        created_at: new Date().toISOString()
                    };
                    await db.collection('sessions').doc(String(sessionId)).set(sessionData);

                    replyText = (replyText ? replyText + '\n\n' : '') + `🎥 Video session booked with ${targetPeer.full_name} for ${topic}! It is now added to your Sessions section.`;
                    actionResult = {
                        type: 'session_created',
                        data: {
                            sessionId,
                            partnerName: targetPeer.full_name,
                            meetingLink,
                            topic
                        }
                    };
                } else {
                    const instantLink = `https://meet.jit.si/skillbinimoy-room-${Date.now()}`;
                    replyText = (replyText ? replyText + '\n\n' : '') + `🎥 Instant video room created! You can join now to meet with ${targetPeer.full_name}. (Note: To schedule an official appointment in Sessions, an exchange request must first be accepted.)`;
                    actionResult = {
                        type: 'join_call',
                        data: {
                            partnerName: targetPeer.full_name,
                            meetingLink: instantLink
                        }
                    };
                }
            }
        } else if (actionType === 'SUGGEST_BARTER' && actionPeerName) {
            const targetPeer = findPeer(actionPeerName);
            if (targetPeer) {
                actionResult = {
                    type: 'suggest_barter',
                    data: {
                        peerId: targetPeer.id,
                        partnerName: targetPeer.full_name,
                        offeredSkill: actionParam1 || userTeaches[0] || 'Skill Exchange',
                        requestedSkill: actionParam2 || targetPeer.skills_teach[0] || 'Skill Exchange'
                    }
                };
            }
        }

        if (replyText) {
            return res.status(200).json({ reply: replyText, action: actionResult });
        }

        return res.status(200).json({
            reply: "I'm having a little trouble connecting to Gemini right now. Please try again in a moment!"
        });
    } catch (err) {
        console.error('Chatbot error:', err.message);
        return res.status(500).json({
            reply: "Sorry, an unexpected error occurred while processing your request."
        });
    }
};

// ==========================================
// GET TRENDING SKILLS
// ==========================================
exports.getTrendingSkills = async (req, res) => {
    try {
        const skillsSnap = await db.collection('skills').get();
        const skillCounts = new Map();

        skillsSnap.forEach(doc => {
            const s = doc.data();
            const name = s.skill_name;
            if (!name) return;

            if (!skillCounts.has(name)) {
                skillCounts.set(name, { skill_name: name, total_count: 0, teach_count: 0, learn_count: 0 });
            }
            const item = skillCounts.get(name);
            item.total_count += 1;
            if (s.skill_type === 'teach') item.teach_count += 1;
            if (s.skill_type === 'learn') item.learn_count += 1;
        });

        const trending = Array.from(skillCounts.values());
        trending.sort((a, b) => b.total_count - a.total_count || a.skill_name.localeCompare(b.skill_name));

        return res.status(200).json({ trending: trending.slice(0, 10) });
    } catch (err) {
        console.error('Trending skills error:', err);
        return res.status(500).json({ message: 'Failed to get trending skills' });
    }
};

// ==========================================
// GENERATE VIDEO ROOM (Jitsi Meet)
// ==========================================
exports.generateVideoRoom = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const { type, targetId } = req.body;

        if (!type || !targetId) {
            return res.status(400).json({ message: 'Call type and targetId are required' });
        }

        if (type === 'session') {
            const sDoc = await db.collection('sessions').doc(String(targetId)).get();
            if (!sDoc.exists) return res.status(403).json({ message: 'Session not found' });
            const session = sDoc.data();

            const erDoc = await db.collection('exchange_requests').doc(String(session.request_id)).get();
            if (!erDoc.exists) return res.status(403).json({ message: 'Exchange request not found' });
            const er = erDoc.data();

            if (er.sender_id !== userId && er.receiver_id !== userId) {
                return res.status(403).json({ message: 'Session unauthorized' });
            }

            const u1Doc = await db.collection('users').doc(String(er.sender_id)).get();
            const u2Doc = await db.collection('users').doc(String(er.receiver_id)).get();
            const senderName = u1Doc.exists ? u1Doc.data().full_name : 'Member';
            const receiverName = u2Doc.exists ? u2Doc.data().full_name : 'Member';
            const partnerName = er.sender_id === userId ? receiverName : senderName;

            return res.status(200).json({
                roomName: `skillbinimoy-session-${session.id}`,
                durationMinutes: 20, // Enforced 20-minute maximum limit for sessions
                title: `${er.offered_skill} ↔ ${er.requested_skill}`,
                partnerName
            });
        } else if (type === 'direct') {
            const otherUserId = parseInt(targetId);

            // Verify friendship (accepted request)
            const snap1 = await db.collection('exchange_requests')
                .where('sender_id', '==', userId)
                .where('receiver_id', '==', otherUserId)
                .where('status', '==', 'Accepted')
                .limit(1)
                .get();

            const snap2 = await db.collection('exchange_requests')
                .where('sender_id', '==', otherUserId)
                .where('receiver_id', '==', userId)
                .where('status', '==', 'Accepted')
                .limit(1)
                .get();

            if (snap1.empty && snap2.empty) {
                return res.status(403).json({ message: 'You can only video call accepted friends' });
            }

            const otherUserDoc = await db.collection('users').doc(String(otherUserId)).get();
            const partnerName = otherUserDoc.exists ? otherUserDoc.data().full_name : 'Friend';

            const minId = Math.min(userId, otherUserId);
            const maxId = Math.max(userId, otherUserId);
            const roomName = `skillbinimoy-call-${minId}-${maxId}`;

            return res.status(200).json({
                roomName,
                durationMinutes: null,
                title: `Video Call with ${partnerName}`,
                partnerName
            });
        } else if (type === 'group') {
            const groupId = parseInt(targetId);
            const memDoc = await db.collection('group_members').doc(`${groupId}_${userId}`).get();
            if (!memDoc.exists) return res.status(403).json({ message: 'Not a member of this group' });

            const gDoc = await db.collection('groups').doc(String(groupId)).get();
            const groupName = gDoc.exists ? gDoc.data().name : 'Group';

            return res.status(200).json({
                roomName: `skillbinimoy-group-${groupId}`,
                durationMinutes: null,
                title: `Group Call: ${groupName}`,
                partnerName: groupName
            });
        } else {
            return res.status(400).json({ message: 'Invalid call type' });
        }
    } catch (err) {
        console.error('Generate video room error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// REAL-TIME CALL REGISTRY (Messenger-style)
// ==========================================
const activeCalls = new Map();

// Periodic cleanup of stale calls (older than 60 seconds)
setInterval(() => {
    const now = Date.now();
    for (const [callId, call] of activeCalls.entries()) {
        if (now - call.createdAt > 60000 || ['rejected', 'cancelled', 'ended'].includes(call.status)) {
            activeCalls.delete(callId);
        }
    }
}, 30000);

// INITIATE CALL (User A calls User B - Video or Audio)
exports.initiateCall = async (req, res) => {
    try {
        const callerId = parseInt(req.user.id);
        const { receiverId, callType, offer } = req.body;

        if (!receiverId) return res.status(400).json({ message: 'Receiver ID required' });
        const targetUserId = parseInt(receiverId);

        if (callerId === targetUserId) {
            return res.status(400).json({ message: 'You cannot call yourself' });
        }

        // Fetch Target User & Caller info from Firestore
        const targetDoc = await db.collection('users').doc(String(targetUserId)).get();
        if (!targetDoc.exists) return res.status(404).json({ message: 'User not found' });
        const targetUser = targetDoc.data();

        const callerDoc = await db.collection('users').doc(String(callerId)).get();
        if (!callerDoc.exists) return res.status(404).json({ message: 'Caller not found' });
        const callerUser = callerDoc.data();

        // Clear any existing active calls for this pair
        for (const [existingId, existingCall] of activeCalls.entries()) {
            if (existingCall.callerId === callerId || existingCall.receiverId === callerId) {
                if (existingCall.status === 'ringing') {
                    existingCall.status = 'cancelled';
                }
            }
        }

        const minId = Math.min(callerId, targetUserId);
        const maxId = Math.max(callerId, targetUserId);
        const roomName = `skillbinimoy-call-${minId}-${maxId}`;
        const callId = `call_${callerId}_${targetUserId}_${Date.now()}`;

        const callData = {
            callId,
            callerId,
            callerName: callerUser.full_name,
            callerImage: callerUser.profile_image || '',
            receiverId: targetUserId,
            receiverName: targetUser.full_name,
            receiverImage: targetUser.profile_image || '',
            roomName,
            callType: (callType === 'audio') ? 'audio' : 'video',
            offer: offer || null,
            answer: null,
            callerCandidates: [],
            receiverCandidates: [],
            status: 'ringing',
            createdAt: Date.now()
        };

        activeCalls.set(callId, callData);

        return res.status(200).json({
            callId,
            roomName,
            callType: callData.callType,
            partnerName: targetUser.full_name,
            partnerImage: targetUser.profile_image || '',
            status: 'ringing'
        });
    } catch (err) {
        console.error('Initiate call error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// CHECK CALL STATUS (Caller checks if Receiver accepted/rejected)
exports.checkCallStatus = (req, res) => {
    const { callId } = req.params;
    const call = activeCalls.get(callId);

    if (!call) {
        return res.status(200).json({ status: 'ended' });
    }

    // Auto timeout if ringing > 35s
    if (call.status === 'ringing' && Date.now() - call.createdAt > 35000) {
        call.status = 'timeout';
    }

    res.status(200).json({
        callId: call.callId,
        status: call.status,
        callType: call.callType || 'video',
        roomName: call.roomName,
        answer: call.answer || null
    });
};

// GET INCOMING CALL (Receiver polls to see if anyone is calling them)
exports.getIncomingCall = (req, res) => {
    const userId = parseInt(req.user.id);
    const now = Date.now();

    for (const call of activeCalls.values()) {
        if (call.receiverId === userId && call.status === 'ringing') {
            if (now - call.createdAt <= 35000) {
                return res.status(200).json({
                    incomingCall: {
                        callId: call.callId,
                        callerName: call.callerName,
                        callerImage: call.callerImage,
                        roomName: call.roomName,
                        callerId: call.callerId,
                        callType: call.callType || 'video',
                        offer: call.offer || null
                    }
                });
            } else {
                call.status = 'timeout';
            }
        }
    }

    res.status(200).json({ incomingCall: null });
};

// RESPOND TO CALL (Receiver accepts or rejects/cuts)
exports.respondCall = (req, res) => {
    const userId = parseInt(req.user.id);
    const { callId, action, answer } = req.body;

    const call = activeCalls.get(callId);
    if (!call || call.receiverId !== userId) {
        return res.status(404).json({ message: 'Call not found or expired' });
    }

    if (action === 'accept') {
        call.status = 'accepted';
        if (answer) call.answer = answer;
        return res.status(200).json({
            message: 'Call accepted',
            roomName: call.roomName,
            partnerName: call.callerName,
            callType: call.callType || 'video',
            offer: call.offer || null
        });
    } else {
        call.status = 'rejected';
        return res.status(200).json({ message: 'Call rejected' });
    }
};

// CANCEL CALL (Caller cancels before answered, or either user ends call)
exports.cancelCall = (req, res) => {
    const userId = parseInt(req.user.id);
    const { callId } = req.body;

    const call = activeCalls.get(callId);
    if (call && (call.callerId === userId || call.receiverId === userId)) {
        call.status = 'ended';
    }
    res.status(200).json({ message: 'Call ended' });
};

// SEND CALL SIGNAL (Exchange ICE Candidates)
exports.sendCallSignal = (req, res) => {
    const userId = parseInt(req.user.id);
    const { callId, candidate, role } = req.body;
    const call = activeCalls.get(callId);
    if (!call) return res.status(404).json({ message: 'Call not found' });

    if (candidate) {
        if (role === 'caller' && call.callerId === userId) {
            call.callerCandidates.push(candidate);
        } else if (role === 'receiver' && call.receiverId === userId) {
            call.receiverCandidates.push(candidate);
        }
    }
    res.status(200).json({ status: 'ok' });
};

// GET CALL SIGNALS (Retrieve ICE Candidates from peer)
exports.getCallSignals = (req, res) => {
    const userId = parseInt(req.user.id);
    const { callId } = req.params;
    const { role } = req.query;
    const call = activeCalls.get(callId);
    if (!call) return res.status(200).json({ candidates: [] });

    let candidates = [];
    if (role === 'caller' && call.callerId === userId) {
        candidates = [...call.receiverCandidates];
        call.receiverCandidates = [];
    } else if (role === 'receiver' && call.receiverId === userId) {
        candidates = [...call.callerCandidates];
        call.callerCandidates = [];
    }
    res.status(200).json({ candidates });
};

// ==========================================
// GET RECENT ACTIVITY FEED
// ==========================================
exports.getActivityFeed = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const activities = [];
        const userCache = new Map();

        const getUserName = async (uid) => {
            if (!uid) return 'Member';
            if (userCache.has(uid)) return userCache.get(uid);
            try {
                const uDoc = await db.collection('users').doc(String(uid)).get();
                const name = uDoc.exists ? uDoc.data().full_name : 'Member';
                userCache.set(uid, name);
                return name;
            } catch {
                return 'Member';
            }
        };

        // 1. Parallel fetch of exchange requests, sessions, and messages
        const [sentSnap, recvSnap, sessionsSnap, msgSnap] = await Promise.all([
            db.collection('exchange_requests').where('sender_id', '==', userId).limit(6).get(),
            db.collection('exchange_requests').where('receiver_id', '==', userId).limit(6).get(),
            db.collection('sessions').limit(15).get(),
            db.collection('messages').where('receiver_id', '==', userId).limit(6).get()
        ]);

        // Process sent requests
        for (const doc of sentSnap.docs) {
            const data = doc.data();
            const receiverName = await getUserName(data.receiver_id);

            let title = 'Sent exchange proposal';
            let desc = `You proposed a skill exchange to ${receiverName} for ${data.requested_skill || 'skills'}.`;
            let type = 'request_sent';

            if (data.status === 'Accepted') {
                title = 'Exchange proposal accepted';
                desc = `${receiverName} accepted your skill exchange proposal for ${data.requested_skill || 'skills'}.`;
                type = 'request_accepted';
            } else if (data.status === 'Rejected') {
                title = 'Proposal declined';
                desc = `${receiverName} declined your exchange proposal.`;
                type = 'request_rejected';
            }

            activities.push({
                id: `req-sent-${data.id}`,
                title,
                desc,
                type,
                created_at: data.created_at || new Date().toISOString()
            });
        }

        // Process received requests
        for (const doc of recvSnap.docs) {
            const data = doc.data();
            const senderName = await getUserName(data.sender_id);

            let title = 'New proposal received';
            let desc = `${senderName} wants to exchange ${data.offered_skill || 'skills'} with you.`;
            let type = 'request_received';

            if (data.status === 'Accepted') {
                title = 'Proposal accepted';
                desc = `You accepted the skill exchange with ${senderName}.`;
                type = 'request_accepted';
            }

            activities.push({
                id: `req-recv-${data.id}`,
                title,
                desc,
                type,
                created_at: data.created_at || new Date().toISOString()
            });
        }

        // Process sessions
        const userReqs = new Map();
        sentSnap.forEach(d => userReqs.set(d.data().id, d.data()));
        recvSnap.forEach(d => userReqs.set(d.data().id, d.data()));

        for (const doc of sessionsSnap.docs) {
            const s = doc.data();
            if (userReqs.has(s.request_id)) {
                const er = userReqs.get(s.request_id);
                const partnerId = er.sender_id === userId ? er.receiver_id : er.sender_id;
                const partnerName = await getUserName(partnerId);

                if (s.status === 'Completed') {
                    activities.push({
                        id: `sess-${s.id}`,
                        title: 'Session completed & reviewed',
                        desc: `Completed learning session with ${partnerName}.`,
                        type: 'session_completed',
                        created_at: s.scheduled_at || s.created_at || new Date().toISOString()
                    });
                } else {
                    activities.push({
                        id: `sess-${s.id}`,
                        title: 'Session scheduled',
                        desc: `Upcoming 1-on-1 session booked with ${partnerName}.`,
                        type: 'session_scheduled',
                        created_at: s.created_at || s.scheduled_at || new Date().toISOString()
                    });
                }
            }
        }

        // Process messages
        for (const doc of msgSnap.docs) {
            const m = doc.data();
            const senderName = await getUserName(m.sender_id);

            activities.push({
                id: `msg-${m.id}`,
                title: 'New message received',
                desc: `${senderName}: "${m.message.slice(0, 45)}${m.message.length > 45 ? '...' : ''}"`,
                type: 'message',
                created_at: m.created_at || new Date().toISOString()
            });
        }

        // Sort descending by created_at
        activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // Ensure unique IDs
        const seenActIds = new Set();
        const uniqueActivities = [];
        for (const act of activities) {
            if (!seenActIds.has(act.id)) {
                seenActIds.add(act.id);
                uniqueActivities.push(act);
            }
        }

        return res.status(200).json({ activities: uniqueActivities.slice(0, 6) });
    } catch (err) {
        console.error('Get activity feed error:', err);
        return res.status(500).json({ message: 'Failed to get activity feed' });
    }
};

