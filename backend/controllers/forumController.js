const { db, getNextId } = require('../config/firebase');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'skillBinimoySecret2026XYZ';

// Helper to extract currentUserId safely from header or req.user
function getOptionalUserId(req) {
    if (req.user && req.user.id) return parseInt(req.user.id);
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            return parseInt(decoded.id);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// Seed starter posts if collection is completely empty
async function seedStarterPostsIfEmpty() {
    try {
        const snap = await db.collection('forum_posts').limit(1).get();
        if (!snap.empty) return;

        const starterPosts = [
            {
                id: 1,
                author_id: 1,
                title: "How to handle JWT token expiration gracefully with Axios interceptors in React?",
                content: "I am building an authentication flow with refresh tokens and access tokens. When an API call returns 401 Unauthorized, how can I queue subsequent requests, refresh the token once, and replay failed calls without causing infinite loops or race conditions?",
                category: "Web Development",
                skill_related: "React",
                tags: ["React", "JWT", "Axios", "Authentication"],
                reactions: {
                    helpful: [2, 3],
                    insightful: [2],
                    heart: [3],
                    like: [2, 3]
                },
                reaction_counts: {
                    helpful: 2,
                    insightful: 1,
                    heart: 1,
                    like: 2
                },
                comment_count: 2,
                created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
                updated_at: new Date(Date.now() - 3600000 * 5).toISOString()
            },
            {
                id: 2,
                author_id: 2,
                title: "CUDA Out of Memory when fine-tuning PyTorch transformer model on 8GB VRAM GPU",
                content: "I am trying to fine-tune a LLaMA/Mistral 7B model using PyTorch and Hugging Face Transformers. Even with a batch size of 1, I run into `torch.cuda.OutOfMemoryError`. Has anyone implemented QLoRA with 4-bit bitsandbytes quantization successfully? Any configuration tips?",
                category: "Data Science & AI",
                skill_related: "Python",
                tags: ["Python", "PyTorch", "Machine Learning", "Transformers", "CUDA"],
                reactions: {
                    helpful: [1],
                    insightful: [1, 3],
                    heart: [1],
                    like: [1]
                },
                reaction_counts: {
                    helpful: 1,
                    insightful: 2,
                    heart: 1,
                    like: 1
                },
                comment_count: 1,
                created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
                updated_at: new Date(Date.now() - 3600000 * 12).toISOString()
            },
            {
                id: 3,
                author_id: 3,
                title: "Best practice for managing multi-theme design systems (Light / Dark) with Tailwind CSS?",
                content: "We are designing a responsive web app with custom glassmorphism and animated borders. What is the cleanest approach to prevent flash of unstyled theme on initial load, while keeping custom scrollbars and backdrop blur harmonious across light and dark modes?",
                category: "Design & UI/UX",
                skill_related: "UI/UX Design",
                tags: ["UI/UX", "TailwindCSS", "CSS", "Design System"],
                reactions: {
                    helpful: [1, 2],
                    insightful: [1],
                    heart: [2],
                    like: [1, 2]
                },
                reaction_counts: {
                    helpful: 2,
                    insightful: 1,
                    heart: 1,
                    like: 2
                },
                comment_count: 1,
                created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
                updated_at: new Date(Date.now() - 3600000 * 24).toISOString()
            }
        ];

        const starterComments = [
            {
                id: 1,
                post_id: 1,
                author_id: 2,
                content: "You can create an `isRefreshing` boolean flag and a failedQueue array in your Axios response interceptor. When 401 occurs, push unresolved promises to the queue, call `/refresh-token` once, update Axios defaults, and resolve the queue with the new token!",
                parent_id: null,
                reactions: { like: [1], helpful: [1], heart: [] },
                reaction_counts: { like: 1, helpful: 1, heart: 0 },
                created_at: new Date(Date.now() - 3600000 * 4).toISOString()
            },
            {
                id: 2,
                post_id: 1,
                author_id: 3,
                content: "Exactly, and make sure you reject all queued promises if the refresh token itself has expired, then safely trigger `logout()`.",
                parent_id: 1,
                reactions: { like: [1, 2], helpful: [1], heart: [1] },
                reaction_counts: { like: 2, helpful: 1, heart: 1 },
                created_at: new Date(Date.now() - 3600000 * 3).toISOString()
            },
            {
                id: 3,
                post_id: 2,
                author_id: 1,
                content: "Use `BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_compute_dtype=torch.float16)` and enable gradient checkpointing with `model.gradient_checkpointing_enable()`. That drops memory consumption from 16GB down to under 5.5GB!",
                parent_id: null,
                reactions: { like: [2], helpful: [2], heart: [2] },
                reaction_counts: { like: 1, helpful: 1, heart: 1 },
                created_at: new Date(Date.now() - 3600000 * 8).toISOString()
            },
            {
                id: 4,
                post_id: 3,
                author_id: 1,
                content: "Use standard CSS variables (`--bg-page`, `--card-surface`) in Tailwind config instead of hardcoded hex values, and check `localStorage.theme` in an inline `<script>` in `index.html` before DOM mounts.",
                parent_id: null,
                reactions: { like: [3], helpful: [3], heart: [] },
                reaction_counts: { like: 1, helpful: 1, heart: 0 },
                created_at: new Date(Date.now() - 3600000 * 18).toISOString()
            }
        ];

        for (const p of starterPosts) {
            await db.collection('forum_posts').doc(String(p.id)).set(p);
        }
        for (const c of starterComments) {
            await db.collection('forum_comments').doc(String(c.id)).set(c);
        }
    } catch (e) {
        console.warn('Starter forum posts seed notice:', e.message);
    }
}

// ==========================================
// GET FORUM POSTS (Feed with AI Profile Preference)
// ==========================================
exports.getForumPosts = async (req, res) => {
    try {
        await seedStarterPostsIfEmpty();

        const currentUserId = getOptionalUserId(req);
        const { category, search, sort = 'recommended', author_id } = req.query;

        // Fetch user skills to personalize the feed
        let myTeach = [];
        let myLearn = [];
        if (currentUserId) {
            const skillsSnap = await db.collection('skills').where('user_id', '==', currentUserId).get();
            skillsSnap.forEach(doc => {
                const s = doc.data();
                if (s.skill_type === 'teach') myTeach.push(s.skill_name.toLowerCase());
                else if (s.skill_type === 'learn') myLearn.push(s.skill_name.toLowerCase());
            });
        }

        // Fetch all forum posts
        let query = db.collection('forum_posts');
        if (author_id) {
            query = query.where('author_id', '==', parseInt(author_id));
        }

        const postsSnap = await query.get();
        if (postsSnap.empty) {
            return res.status(200).json({ posts: [], total: 0 });
        }

        let rawPosts = postsSnap.docs.map(doc => doc.data());

        // Filter by category
        if (category && category !== 'All' && category !== 'all') {
            rawPosts = rawPosts.filter(p => p.category?.toLowerCase() === category.toLowerCase());
        }

        // Filter by search query
        if (search && search.trim()) {
            const q = search.trim().toLowerCase();
            rawPosts = rawPosts.filter(p => 
                p.title?.toLowerCase().includes(q) ||
                p.content?.toLowerCase().includes(q) ||
                p.skill_related?.toLowerCase().includes(q) ||
                (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
            );
        }

        // Collect distinct author IDs and fetch user details in parallel
        const authorIds = Array.from(new Set(rawPosts.map(p => p.author_id).filter(Boolean)));
        const authorDocs = await Promise.all(
            authorIds.map(uid => db.collection('users').doc(String(uid)).get())
        );
        const authorMap = new Map();
        authorDocs.forEach(doc => {
            if (doc.exists) {
                const u = doc.data();
                authorMap.set(u.id, {
                    name: u.full_name || 'Community Peer',
                    image: u.profile_image || null,
                    headline: u.headline || 'Skill Binimoy Member',
                    rating: u.rating || 5.0
                });
            }
        });

        // Enrich posts with author info, AI preference score, and user reaction status
        const posts = rawPosts.map(p => {
            const author = authorMap.get(p.author_id) || {
                name: 'Community Peer',
                image: null,
                headline: 'Member',
                rating: 5.0
            };

            const reactions = p.reactions || { helpful: [], insightful: [], heart: [], like: [] };
            const reactionCounts = p.reaction_counts || {
                helpful: (reactions.helpful || []).length,
                insightful: (reactions.insightful || []).length,
                heart: (reactions.heart || []).length,
                like: (reactions.like || []).length
            };

            const userReactions = currentUserId ? {
                helpful: (reactions.helpful || []).includes(currentUserId),
                insightful: (reactions.insightful || []).includes(currentUserId),
                heart: (reactions.heart || []).includes(currentUserId),
                like: (reactions.like || []).includes(currentUserId)
            } : { helpful: false, insightful: false, heart: false, like: false };

            // AI Match Calculation based on profile
            let aiScore = 0;
            let matchType = 'none';
            let matchReason = null;

            const postSkill = (p.skill_related || '').toLowerCase();
            const postTags = (p.tags || []).map(t => t.toLowerCase());
            const postText = `${p.title || ''} ${p.content || ''}`.toLowerCase();

            // 1. Can user solve this problem with their teaching skills?
            const matchedTeachSkill = myTeach.find(t => 
                (postSkill && (postSkill.includes(t) || t.includes(postSkill))) ||
                postTags.some(tag => tag.includes(t) || t.includes(tag)) ||
                postText.includes(t)
            );

            // 2. Is this related to what user wants to learn?
            const matchedLearnSkill = myLearn.find(l => 
                (postSkill && (postSkill.includes(l) || l.includes(postSkill))) ||
                postTags.some(tag => tag.includes(l) || l.includes(tag)) ||
                postText.includes(l)
            );

            if (matchedTeachSkill) {
                aiScore = 95;
                matchType = 'can_help';
                matchReason = `✨ You can help: Matches your teaching skill in "${matchedTeachSkill.toUpperCase()}"!`;
            } else if (matchedLearnSkill) {
                aiScore = 80;
                matchType = 'learning';
                matchReason = `🎯 Great insight: Matches your learning goal in "${matchedLearnSkill.toUpperCase()}"!`;
            } else if (p.category && (myTeach.length > 0 || myLearn.length > 0)) {
                aiScore = 40;
                matchType = 'explore';
            }

            // Factor in activity (reactions and comments)
            const totalReactions = (reactionCounts.helpful || 0) + (reactionCounts.insightful || 0) + (reactionCounts.heart || 0) + (reactionCounts.like || 0);
            const totalActivity = totalReactions * 2 + (p.comment_count || 0) * 3;

            return {
                ...p,
                author_name: author.name,
                author_image: author.image,
                author_headline: author.headline,
                author_rating: author.rating,
                is_author: currentUserId ? (parseInt(p.author_id) === currentUserId) : false,
                reactions,
                reaction_counts: reactionCounts,
                user_reactions: userReactions,
                total_reactions: totalReactions,
                ai_match: {
                    score: aiScore,
                    match_type: matchType,
                    reason: matchReason
                },
                _activity_score: aiScore + totalActivity
            };
        });

        // Sorting
        posts.sort((a, b) => {
            if (sort === 'recommended') {
                if (b._activity_score !== a._activity_score) {
                    return b._activity_score - a._activity_score;
                }
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else if (sort === 'popular') {
                return (b.total_reactions + (b.comment_count || 0)) - (a.total_reactions + (a.comment_count || 0));
            } else if (sort === 'unanswered') {
                if ((a.comment_count || 0) !== (b.comment_count || 0)) {
                    return (a.comment_count || 0) - (b.comment_count || 0);
                }
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else {
                // Newest
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
        });

        return res.status(200).json({ posts, total: posts.length });
    } catch (err) {
        console.error('Get forum posts error:', err);
        return res.status(500).json({ message: 'Failed to fetch forum posts' });
    }
};

// ==========================================
// GET FORUM POST BY ID
// ==========================================
exports.getForumPostById = async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const currentUserId = getOptionalUserId(req);

        const postDoc = await db.collection('forum_posts').doc(String(postId)).get();
        if (!postDoc.exists) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const post = postDoc.data();
        const authorDoc = await db.collection('users').doc(String(post.author_id)).get();
        const author = authorDoc.exists ? authorDoc.data() : {};

        const reactions = post.reactions || { helpful: [], insightful: [], heart: [], like: [] };
        const reactionCounts = post.reaction_counts || {
            helpful: (reactions.helpful || []).length,
            insightful: (reactions.insightful || []).length,
            heart: (reactions.heart || []).length,
            like: (reactions.like || []).length
        };

        const userReactions = currentUserId ? {
            helpful: (reactions.helpful || []).includes(currentUserId),
            insightful: (reactions.insightful || []).includes(currentUserId),
            heart: (reactions.heart || []).includes(currentUserId),
            like: (reactions.like || []).includes(currentUserId)
        } : { helpful: false, insightful: false, heart: false, like: false };

        return res.status(200).json({
            post: {
                ...post,
                author_name: author.full_name || 'Community Peer',
                author_image: author.profile_image || null,
                author_headline: author.headline || 'Member',
                author_rating: author.rating || 5.0,
                is_author: currentUserId ? post.author_id === currentUserId : false,
                reactions,
                reaction_counts: reactionCounts,
                user_reactions: userReactions
            }
        });
    } catch (err) {
        console.error('Get forum post by id error:', err);
        return res.status(500).json({ message: 'Failed to fetch post' });
    }
};

// ==========================================
// CREATE FORUM POST
// ==========================================
exports.createForumPost = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const { title, content, category, skill_related, tags } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Problem title is required' });
        }
        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Problem description is required' });
        }

        const postId = await getNextId('forum_posts');
        const now = new Date().toISOString();

        // Process tags
        let tagList = [];
        if (Array.isArray(tags)) {
            tagList = tags.map(t => String(t).trim()).filter(Boolean);
        } else if (typeof tags === 'string' && tags.trim()) {
            tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
        }

        const newPost = {
            id: postId,
            author_id: userId,
            title: title.trim(),
            content: content.trim(),
            category: category ? category.trim() : 'Web Development',
            skill_related: skill_related ? skill_related.trim() : '',
            tags: tagList,
            reactions: {
                helpful: [],
                insightful: [],
                heart: [],
                like: []
            },
            reaction_counts: {
                helpful: 0,
                insightful: 0,
                heart: 0,
                like: 0
            },
            comment_count: 0,
            created_at: now,
            updated_at: now
        };

        await db.collection('forum_posts').doc(String(postId)).set(newPost);

        return res.status(201).json({
            message: 'Problem post submitted to forum successfully!',
            post: newPost
        });
    } catch (err) {
        console.error('Create forum post error:', err);
        return res.status(500).json({ message: 'Failed to create forum post' });
    }
};

// ==========================================
// DELETE FORUM POST
// ==========================================
exports.deleteForumPost = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const postId = parseInt(req.params.id);

        const postDoc = await db.collection('forum_posts').doc(String(postId)).get();
        if (!postDoc.exists) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const post = postDoc.data();
        if (parseInt(post.author_id) !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this post' });
        }

        // Delete post
        await db.collection('forum_posts').doc(String(postId)).delete();

        // Delete comments for this post
        const commentsSnap = await db.collection('forum_comments').where('post_id', '==', postId).get();
        const batch = db.batch();
        commentsSnap.forEach(doc => batch.delete(doc.ref));
        await batch.commit();

        return res.status(200).json({ message: 'Post and discussions removed' });
    } catch (err) {
        console.error('Delete forum post error:', err);
        return res.status(500).json({ message: 'Failed to delete post' });
    }
};

// ==========================================
// REACT TO FORUM POST
// ==========================================
exports.reactToForumPost = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const postId = parseInt(req.params.id);
        const { reaction_type = 'helpful' } = req.body;

        const validReactions = ['helpful', 'insightful', 'heart', 'like'];
        if (!validReactions.includes(reaction_type)) {
            return res.status(400).json({ message: 'Invalid reaction type' });
        }

        const postRef = db.collection('forum_posts').doc(String(postId));
        const postDoc = await postRef.get();
        if (!postDoc.exists) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const post = postDoc.data();
        const reactions = post.reactions || { helpful: [], insightful: [], heart: [], like: [] };
        validReactions.forEach(t => {
            if (!reactions[t]) reactions[t] = [];
        });

        const list = reactions[reaction_type];
        const userIndex = list.indexOf(userId);
        let userReacted = false;

        if (userIndex > -1) {
            // Toggle off
            list.splice(userIndex, 1);
            userReacted = false;
        } else {
            // Toggle on
            list.push(userId);
            userReacted = true;
        }

        reactions[reaction_type] = list;
        const reactionCounts = {
            helpful: reactions.helpful.length,
            insightful: reactions.insightful.length,
            heart: reactions.heart.length,
            like: reactions.like.length
        };

        await postRef.update({
            reactions,
            reaction_counts: reactionCounts
        });

        return res.status(200).json({
            message: userReacted ? 'Reaction added' : 'Reaction removed',
            reaction_type,
            user_reacted: userReacted,
            reaction_counts: reactionCounts
        });
    } catch (err) {
        console.error('React to forum post error:', err);
        return res.status(500).json({ message: 'Failed to react to post' });
    }
};

// ==========================================
// GET FORUM COMMENTS (with Threaded Replies)
// ==========================================
exports.getForumComments = async (req, res) => {
    try {
        const postId = parseInt(req.params.postId);
        const currentUserId = getOptionalUserId(req);

        const commentsSnap = await db.collection('forum_comments')
            .where('post_id', '==', postId)
            .get();

        if (commentsSnap.empty) {
            return res.status(200).json({ comments: [] });
        }

        const rawComments = commentsSnap.docs.map(doc => doc.data());

        // Fetch author profiles in parallel
        const authorIds = Array.from(new Set(rawComments.map(c => c.author_id).filter(Boolean)));
        const authorDocs = await Promise.all(
            authorIds.map(uid => db.collection('users').doc(String(uid)).get())
        );
        const authorMap = new Map();
        authorDocs.forEach(doc => {
            if (doc.exists) {
                const u = doc.data();
                authorMap.set(u.id, {
                    name: u.full_name || 'Community Peer',
                    image: u.profile_image || null,
                    headline: u.headline || 'Member'
                });
            }
        });

        // Enrich comments
        const enriched = rawComments.map(c => {
            const author = authorMap.get(c.author_id) || { name: 'Community Peer', image: null, headline: 'Member' };
            const reactions = c.reactions || { like: [], helpful: [], heart: [] };
            const reactionCounts = c.reaction_counts || {
                like: (reactions.like || []).length,
                helpful: (reactions.helpful || []).length,
                heart: (reactions.heart || []).length
            };

            const userReactions = currentUserId ? {
                like: (reactions.like || []).includes(currentUserId),
                helpful: (reactions.helpful || []).includes(currentUserId),
                heart: (reactions.heart || []).includes(currentUserId)
            } : { like: false, helpful: false, heart: false };

            return {
                ...c,
                author_name: author.name,
                author_image: author.image,
                author_headline: author.headline,
                is_author: currentUserId ? c.author_id === currentUserId : false,
                reactions,
                reaction_counts: reactionCounts,
                user_reactions: userReactions,
                replies: []
            };
        });

        // Thread into hierarchy
        const commentMap = new Map();
        enriched.forEach(c => commentMap.set(c.id, c));

        const rootComments = [];
        enriched.forEach(c => {
            if (c.parent_id && commentMap.has(c.parent_id)) {
                commentMap.get(c.parent_id).replies.push(c);
            } else {
                rootComments.push(c);
            }
        });

        // Sort comments by created_at ascending
        rootComments.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        rootComments.forEach(r => {
            r.replies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        });

        return res.status(200).json({ comments: rootComments });
    } catch (err) {
        console.error('Get forum comments error:', err);
        return res.status(500).json({ message: 'Failed to fetch comments' });
    }
};

// ==========================================
// ADD FORUM COMMENT OR REPLY
// ==========================================
exports.addForumComment = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const postId = parseInt(req.params.postId);
        const { content, parent_id } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const commentId = await getNextId('forum_comments');
        const now = new Date().toISOString();

        const newComment = {
            id: commentId,
            post_id: postId,
            author_id: userId,
            content: content.trim(),
            parent_id: parent_id ? parseInt(parent_id) : null,
            reactions: {
                like: [],
                helpful: [],
                heart: []
            },
            reaction_counts: {
                like: 0,
                helpful: 0,
                heart: 0
            },
            created_at: now
        };

        await db.collection('forum_comments').doc(String(commentId)).set(newComment);

        // Increment post comment count
        const postRef = db.collection('forum_posts').doc(String(postId));
        const postDoc = await postRef.get();
        if (postDoc.exists) {
            const count = (postDoc.data().comment_count || 0) + 1;
            await postRef.update({ comment_count: count });
        }

        // Attach author details for immediate UI response
        const userDoc = await db.collection('users').doc(String(userId)).get();
        const userData = userDoc.exists ? userDoc.data() : {};

        return res.status(201).json({
            message: 'Comment posted!',
            comment: {
                ...newComment,
                author_name: userData.full_name || 'You',
                author_image: userData.profile_image || null,
                author_headline: userData.headline || 'Member',
                is_author: true,
                user_reactions: { like: false, helpful: false, heart: false },
                replies: []
            }
        });
    } catch (err) {
        console.error('Add forum comment error:', err);
        return res.status(500).json({ message: 'Failed to post comment' });
    }
};

// ==========================================
// REACT TO FORUM COMMENT
// ==========================================
exports.reactToForumComment = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const commentId = parseInt(req.params.commentId);
        const { reaction_type = 'like' } = req.body;

        const validReactions = ['like', 'helpful', 'heart'];
        if (!validReactions.includes(reaction_type)) {
            return res.status(400).json({ message: 'Invalid reaction type' });
        }

        const commentRef = db.collection('forum_comments').doc(String(commentId));
        const commentDoc = await commentRef.get();
        if (!commentDoc.exists) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const comment = commentDoc.data();
        const reactions = comment.reactions || { like: [], helpful: [], heart: [] };
        validReactions.forEach(t => {
            if (!reactions[t]) reactions[t] = [];
        });

        const list = reactions[reaction_type];
        const userIndex = list.indexOf(userId);
        let userReacted = false;

        if (userIndex > -1) {
            list.splice(userIndex, 1);
            userReacted = false;
        } else {
            list.push(userId);
            userReacted = true;
        }

        reactions[reaction_type] = list;
        const reactionCounts = {
            like: reactions.like.length,
            helpful: reactions.helpful.length,
            heart: reactions.heart.length
        };

        await commentRef.update({
            reactions,
            reaction_counts: reactionCounts
        });

        return res.status(200).json({
            message: userReacted ? 'Reaction added' : 'Reaction removed',
            reaction_type,
            user_reacted: userReacted,
            reaction_counts: reactionCounts
        });
    } catch (err) {
        console.error('React to forum comment error:', err);
        return res.status(500).json({ message: 'Failed to react to comment' });
    }
};

// ==========================================
// DELETE FORUM COMMENT
// ==========================================
exports.deleteForumComment = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const commentId = parseInt(req.params.commentId);

        const commentRef = db.collection('forum_comments').doc(String(commentId));
        const commentDoc = await commentRef.get();
        if (!commentDoc.exists) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const comment = commentDoc.data();
        let isAuthorized = parseInt(comment.author_id) === userId;

        const postId = comment.post_id;
        const postRef = db.collection('forum_posts').doc(String(postId));
        const postDoc = await postRef.get();

        if (!isAuthorized && postDoc.exists) {
            if (parseInt(postDoc.data().author_id) === userId) {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }

        // Delete any nested replies to this comment
        const repliesSnap = await db.collection('forum_comments')
            .where('parent_id', '==', commentId)
            .get();

        const batch = db.batch();
        batch.delete(commentRef);
        repliesSnap.forEach(d => batch.delete(d.ref));
        await batch.commit();

        const totalDeleted = 1 + repliesSnap.size;

        if (postDoc.exists) {
            const currentCount = postDoc.data().comment_count || 0;
            const newCount = Math.max(0, currentCount - totalDeleted);
            await postRef.update({ comment_count: newCount });
        }

        return res.status(200).json({
            message: 'Comment deleted successfully',
            deleted_id: commentId,
            post_id: postId
        });
    } catch (err) {
        console.error('Delete forum comment error:', err);
        return res.status(500).json({ message: 'Failed to delete comment' });
    }
};

// ==========================================
// GET USER FORUM POSTS (For Profile Page)
// ==========================================
exports.getUserForumPosts = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId || (req.user && req.user.id));
        const currentUserId = getOptionalUserId(req);

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const postsSnap = await db.collection('forum_posts')
            .where('author_id', '==', userId)
            .get();

        if (postsSnap.empty) {
            return res.status(200).json({ posts: [] });
        }

        const posts = postsSnap.docs.map(doc => {
            const p = doc.data();
            const reactions = p.reactions || { helpful: [], insightful: [], heart: [], like: [] };
            const reactionCounts = p.reaction_counts || {
                helpful: (reactions.helpful || []).length,
                insightful: (reactions.insightful || []).length,
                heart: (reactions.heart || []).length,
                like: (reactions.like || []).length
            };
            const userReactions = currentUserId ? {
                helpful: (reactions.helpful || []).includes(currentUserId),
                insightful: (reactions.insightful || []).includes(currentUserId),
                heart: (reactions.heart || []).includes(currentUserId),
                like: (reactions.like || []).includes(currentUserId)
            } : { helpful: false, insightful: false, heart: false, like: false };

            return {
                ...p,
                reactions,
                reaction_counts: reactionCounts,
                user_reactions: userReactions,
                total_reactions: (reactionCounts.helpful || 0) + (reactionCounts.insightful || 0) + (reactionCounts.heart || 0) + (reactionCounts.like || 0)
            };
        });

        posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return res.status(200).json({ posts });
    } catch (err) {
        console.error('Get user forum posts error:', err);
        return res.status(500).json({ message: 'Failed to fetch user forum posts' });
    }
};
