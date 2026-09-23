const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protectUser } = require('../middleware/authMiddleware');
const { checkPlanFeature, checkPostCreationLimit, checkNoteCreationLimit } = require('../middleware/planAccessMiddleware');

const {
  registerUser,
  loginUser,
  forgotPassword,
  changePassword,
  logoutUser
} = require('../controllers/authController');

const {
  getProfile,
  updateProfile,
  updateTheme,
  updateLanguage
} = require('../controllers/profileController');

const {
  getLabels,
  createLabel,
  updateLabel,
  deleteLabel
} = require('../controllers/labelController');

const {
  getSubscriptionPlans,
  subscribeToPlan,
  getMySubscription
} = require('../controllers/subscriptionController');

const {
  getNotes,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController');

const {
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
} = require('../controllers/postController');

const {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const {
  getQuickNotes,
  createQuickNote,
  updateQuickNote,
  deleteQuickNote
} = require('../controllers/quickNoteController');

const {
  submitFeedback,
  getMyFeedback
} = require('../controllers/feedbackController');

// Authentication Routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/change-password', changePassword);
router.post('/auth/logout', logoutUser);

// Profile Routes
router.get('/profile', protectUser, getProfile);
router.put('/profile', protectUser, upload.single('profileImage'), updateProfile);
router.patch('/profile/theme', protectUser, updateTheme);
router.patch('/profile/language', protectUser, updateLanguage);

// Label Routes
router.get('/labels', protectUser, getLabels);
router.post('/labels', protectUser, createLabel);
router.put('/labels/:id', protectUser, updateLabel);
router.delete('/labels/:id', protectUser, deleteLabel);

// Subscription Plan Routes
router.get('/subscription/plans', getSubscriptionPlans);
router.post('/subscription/subscribe', protectUser, subscribeToPlan);
router.get('/subscription/my-plan', protectUser, getMySubscription);

// Notes / Event Routes
router.get('/notes', protectUser, getNotes);
router.post('/notes', protectUser, checkNoteCreationLimit, createNote);
router.put('/notes/:id', protectUser, updateNote);
router.delete('/notes/:id', protectUser, deleteNote);

// Event Post Routes
router.get('/posts', protectUser, getPosts);
router.post('/posts', protectUser, checkPostCreationLimit, upload.single('postImage'), createPost);
router.put('/posts/:id', protectUser, upload.single('postImage'), updatePost);
router.delete('/posts/:id', protectUser, deletePost);
router.patch('/posts/:id/favourite', protectUser, toggleFavouritePost);
router.get('/posts/favourites', protectUser, getFavouritePosts);

// Post Details Routes
const postDetailUploads = upload.fields([
  { name: 'files', maxCount: 10 },
  { name: 'file', maxCount: 10 },
  { name: 'audio', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]);
router.post('/posts/:postId/details', protectUser, postDetailUploads, addPostDetail);
router.put('/posts/details/:detailId', protectUser, postDetailUploads, updatePostDetail);
router.get('/posts/:postId/details', protectUser, getPostDetails);
router.delete('/posts/details/:detailId', protectUser, deletePostDetail);

// Appointment Routes (Protected by Plan Feature Access)
// router.get('/appointments', protectUser, checkPlanFeature('canAccessAppointments'), getAppointments);
// router.post('/appointments', protectUser, checkPlanFeature('canAccessAppointments'), createAppointment);
// router.put('/appointments/:id', protectUser, checkPlanFeature('canAccessAppointments'), updateAppointment);
// router.delete('/appointments/:id', protectUser, checkPlanFeature('canAccessAppointments'), deleteAppointment);

router.get('/appointments', protectUser, getAppointments);
router.post('/appointments', protectUser, createAppointment);
router.put('/appointments/:id', protectUser, updateAppointment);
router.delete('/appointments/:id', protectUser, deleteAppointment);

// Task Routes
router.get('/tasks', protectUser, getTasks);
router.post('/tasks', protectUser, createTask);
router.put('/tasks/:id', protectUser, updateTask);
router.delete('/tasks/:id', protectUser, deleteTask);

// Quick Note Routes
router.get('/quick-notes', protectUser, getQuickNotes);
router.post('/quick-notes', protectUser, createQuickNote);
router.put('/quick-notes/:id', protectUser, updateQuickNote);
router.delete('/quick-notes/:id', protectUser, deleteQuickNote);

// Feedback Routes
router.post('/feedback', protectUser, submitFeedback);
router.get('/feedback/my', protectUser, getMyFeedback);

module.exports = router;
