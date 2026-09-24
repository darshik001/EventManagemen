const { EventPostStore } = require('../models/EventPost');
const { PostDetailStore } = require('../models/PostDetail');
const { SubscriptionPlanStore } = require('../models/SubscriptionPlan');

// @desc    Get user event posts
// @route   GET /api/user/posts
const getPosts = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { favOnly, tag } = req.query;

    const filter = { userId };
    if (favOnly === 'true') filter.favPost = true;
    if (tag) filter.postTag = tag;

    const posts = await EventPostStore.find(filter);
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Get posts error', error: error.message });
  }
};

// @desc    Create Event Post
// @route   POST /api/user/posts
const createPost = async (req, res) => {
  try {
    const { postTitle, favPost, postTag,content,noteId } = req.body;
    if (!postTitle) {
      return res.status(400).json({ success: false, message: 'Post Title is required' });
    }

    const userId = req.user._id || req.user.id;
    let postImage = '';

    if (req.file) {
      postImage = `/uploads/${req.file.filename}`;
    } else if (req.body.postImage) {
      postImage = req.body.postImage;
    }

    const post = await EventPostStore.create({
      userId,
      postTitle,
      postImage,
      content,
      favPost: favPost === 'true' || favPost === true,
      noteId,
      postTag: postTag || 'General'
    });

    return res.status(201).json({ success: true, message: 'Event post created successfully', data: post });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Create post error', error: error.message });
  }
};

// @desc    Update Event Post
// @route   PUT /api/user/posts/:id
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const post = await EventPostStore.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Event post not found' });
    }

    const updates = { ...req.body };
    if (req.file) {
      updates.postImage = `/uploads/${req.file.filename}`;
    }

    const updated = await EventPostStore.findByIdAndUpdate(id, updates, { new: true });
    return res.status(200).json({ success: true, message: 'Event post updated successfully', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update post error', error: error.message });
  }
};

// @desc    Delete Event Post & associated details
// @route   DELETE /api/user/posts/:id
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const post = await EventPostStore.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Event post not found' });
    }

    await EventPostStore.findByIdAndDelete(id);
    await PostDetailStore.deleteMany({ postId: id });

    return res.status(200).json({ success: true, message: 'Event post and details deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Delete post error', error: error.message });
  }
};

// @desc    Toggle Favourite Post
// @route   PATCH /api/user/posts/:id/favourite
const toggleFavouritePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const post = await EventPostStore.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Event post not found' });
    }

    const newFav = !post.favPost;
    const updated = await EventPostStore.findByIdAndUpdate(id, { favPost: newFav }, { new: true });

    return res.status(200).json({
      success: true,
      message: newFav ? 'Post added to favourites' : 'Post removed from favourites',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Toggle favourite error', error: error.message });
  }
};

// @desc    Get user favourite posts
// @route   GET /api/user/posts/favourites
const getFavouritePosts = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const posts = await EventPostStore.find({ userId, favPost: true });
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Get favourite posts error', error: error.message });
  }
};

// ==================== POST DETAILS ====================

const parseDetailContent = (content) => {
  if (!content) return {};
  if (typeof content === 'object') return content;

  try {
    const parsedContent = JSON.parse(content);
    return parsedContent && typeof parsedContent === 'object' && !Array.isArray(parsedContent)
      ? parsedContent
      : {};
  } catch (error) {
    return {};
  }
};

const getUploadedFiles = (req) => {
  if (Array.isArray(req.files)) return req.files;
  if (req.files && typeof req.files === 'object') return Object.values(req.files).flat();
  return req.file ? [req.file] : [];
};

const normalizeImages = (images) => {
  if (Array.isArray(images)) return images.filter(Boolean);
  if (typeof images === 'string' && images) return [images];
  return [];
};

const normalizeDocuments = (documents) => {
  if (!Array.isArray(documents)) return [];
  return documents.filter((document) => document && document.url);
};

const isTrue = (value) => value === true || value === 'true';

const shouldReplaceUploadedFiles = (postType, body) => (
  postType === 'Documents' ? isTrue(body.replaceDocuments) : isTrue(body.replaceImages)
);

const applyUploadedDetailFiles = (detailContent, postType, files, replaceImages) => {
  if (!files.length) return detailContent;

  const uploadedUrls = files.map((file) => `/uploads/${file.filename}`);
  if (postType === 'Audio') {
    detailContent.audioUrl = uploadedUrls[0];
  } else if (postType === 'Documents') {
    const existingDocuments = replaceImages ? [] : normalizeDocuments(detailContent.documents);
    detailContent.documents = [
      ...existingDocuments,
      ...files.map((file) => ({
        url: `/uploads/${file.filename}`,
        name: file.originalname,
        mimeType: file.mimetype,
        size: file.size
      }))
    ];
  } else if (postType === 'Images') {
    const existingImages = replaceImages ? [] : normalizeImages(detailContent.images);
    detailContent.images = [...existingImages, ...uploadedUrls];
  } else if (postType === 'Drawing') {
    detailContent.drawingUrl = uploadedUrls[0];
  }

  return detailContent;
};

const checkPostDetailPlanAccess = async (req, res, postType) => {
  const planId = req.user.subscription?.planId || 'free_plan';
  const plan = await SubscriptionPlanStore.findById(planId);
  const perms = plan?.permissions || {};

  if (postType === 'Audio' && perms.canAccessAudio === false) {
    res.status(403).json({
      success: false,
      error: 'PLAN_RESTRICTION',
      message: 'Your plan does not allow adding Audio Post Details. Please upgrade your subscription plan.'
    });
    return false;
  }

  if (postType === 'Appointment' && perms.canAccessAppointments === false) {
    res.status(403).json({
      success: false,
      error: 'PLAN_RESTRICTION',
      message: 'Your plan does not allow adding Appointment Post Details. Please upgrade your subscription plan.'
    });
    return false;
  }

  return true;
};

// @desc    Add Detail item to Post (Text, Location, Images, Audio, Documents, CheckList, Appointment, Contact, Drawing)
// @route   POST /api/user/posts/:postId/details
const addPostDetail = async (req, res) => {
  try {
    const { postId } = req.params;
    const { postDetailsTitle, postType, content } = req.body;
    const userId = req.user._id || req.user.id;

    if (!postDetailsTitle || !postType) {
      return res.status(400).json({ success: false, message: 'postDetailsTitle and postType are required' });
    }

    const post = await EventPostStore.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Event post not found' });
    }

    if (!await checkPostDetailPlanAccess(req, res, postType)) return;

    const detailContent = applyUploadedDetailFiles(
      parseDetailContent(content),
      postType,
      getUploadedFiles(req),
      shouldReplaceUploadedFiles(postType, req.body)
    );

    const detail = await PostDetailStore.create({
      postId,
      userId,
      postDetailsTitle,
      postType,
      content: detailContent
    });

    return res.status(201).json({ success: true, message: 'Post detail added successfully', data: detail });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Add post detail error', error: error.message });
  }
};

// @desc    Update a post detail item, including adding or replacing image/document files
// @route   PUT /api/user/posts/details/:detailId
const updatePostDetail = async (req, res) => {
  try {
    const { detailId } = req.params;
    const userId = req.user._id || req.user.id;
    const detail = await PostDetailStore.findById(detailId);

    if (!detail || detail.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Post detail not found' });
    }

    const postType = req.body.postType || detail.postType;
    if (!await checkPostDetailPlanAccess(req, res, postType)) return;

    const updates = {};
    if (req.body.postDetailsTitle !== undefined) updates.postDetailsTitle = req.body.postDetailsTitle;
    if (req.body.postType !== undefined) updates.postType = postType;

    const hasContent = req.body.content !== undefined;
    const files = getUploadedFiles(req);
    if (hasContent || files.length) {
      const submittedContent = hasContent ? parseDetailContent(req.body.content) : {};
      const detailContent = { ...(detail.content || {}), ...submittedContent };
      if (postType === 'Images' && hasContent && !isTrue(req.body.replaceImages)) {
        detailContent.images = [
          ...normalizeImages(detail.content?.images),
          ...normalizeImages(submittedContent.images)
        ];
      }
      if (postType === 'Documents' && hasContent && !isTrue(req.body.replaceDocuments)) {
        detailContent.documents = [
          ...normalizeDocuments(detail.content?.documents),
          ...normalizeDocuments(submittedContent.documents)
        ];
      }
      updates.content = applyUploadedDetailFiles(
        detailContent,
        postType,
        files,
        shouldReplaceUploadedFiles(postType, req.body)
      );
    }

    const updated = await PostDetailStore.findByIdAndUpdate(detailId, updates, { new: true });
    return res.status(200).json({ success: true, message: 'Post detail updated successfully', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update post detail error', error: error.message });
  }
};

// @desc    Get details for a post
// @route   GET /api/user/posts/:postId/details
const getPostDetails = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id || req.user.id;

    const details = await PostDetailStore.find({ postId, userId });
    return res.status(200).json({ success: true, data: details });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Get post details error', error: error.message });
  }
};

// @desc    Delete post detail
// @route   DELETE /api/user/posts/details/:detailId
const deletePostDetail = async (req, res) => {
  try {
    const { detailId } = req.params;
    const userId = req.user._id || req.user.id;

    const detail = await PostDetailStore.findById(detailId);
    if (!detail || detail.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Post detail not found' });
    }

    await PostDetailStore.findByIdAndDelete(detailId);
    return res.status(200).json({ success: true, message: 'Post detail deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Delete post detail error', error: error.message });
  }
};

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  toggleFavouritePost,
  getFavouritePosts,
  addPostDetail,
  updatePostDetail,
  getPostDetails,
  deletePostDetail
};
