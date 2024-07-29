const {Router}=require("express");

const router=Router();
const  { userVerification } =require( '../middleware/user');
const {  createPost, getPosts,deletePost, updatePost} =require('../controllers/post');




router.post('/create', userVerification, createPost);
router.get('/getposts', getPosts)
router.delete('/deletepost/:postId/:userId', userVerification, deletePost)
router.put('/updatepost/:postId/:userId', userVerification, updatePost)


module.exports=router;