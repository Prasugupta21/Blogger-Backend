const {Router}=require("express");

const router=Router();
const {userVerification}=require('../middleware/user')
const {createComment,likeComment,editComment,getPostComments,deleteComment,getComments}=require('../controllers/comment');
router.post('/createcomment',userVerification,createComment);
router.get('/getcomments', userVerification, getComments);

router.get('/getpostcomment/:postId',getPostComments);

router.put('/likecomment/:commentId',userVerification,likeComment);
router.put('/editcomment/:commentId',userVerification,editComment);
router.delete('/deletecomment/:commentId', userVerification, deleteComment);
module.exports=router;