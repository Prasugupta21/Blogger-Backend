const Comment =require('../models/comment');

module.exports.createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return res.status(403).json(
        'You are not allowed to create this comment')
      
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

  return  res.status(201).json({success:true,message:"comment  created success",newComment});
  } catch (error) {
    return  res.status(500).json({success:false,message:"comment  creation error",error});

  }
};
module.exports.getPostComments = async (req, res) => {
  try {
    const comments=await Comment.find({postId:req.params.postId}).sort({createdAt:-1});
  

  return  res.status(200).json({success:true,message:"comment  find success",comments});
  } catch (error) {
    return  res.status(500).json({success:false,message:"comment  find error",error});

  }
};
module.exports.likeComment = async (req, res) => {
    
  try {
    const comment=await Comment.findById(req.params.commentId)
  if(!comment)  return  res.status(404).json({message:"comment  Not Found!"});
  const userIndex=comment.likes.indexOf(req.user.id);
  
  if(userIndex===-1){
    comment.likes.push(req.user.id);
    comment.numberOfLikes+=1;
  }
  else{
    comment.numberOfLikes-=1;
    comment.likes.splice(userIndex,1);

  }
  await comment.save();


  return  res.status(201).json({success:true,message:"comment  liked success",comment});
  } catch (error) {
    return  res.status(500).json({success:false,message:"comment  liked error",error});

  }
};
module.exports.editComment = async (req, res) => {
  try {
    const comment=await Comment.findById(req.params.commentId)
  if(!comment)  return  res.status(404).json({message:"comment  Not Found!"});
 if(req.user.id!==comment.userId)  return res.status(403).json(
   {message: 'You are not allowed to edit this comment'})
  
const editedComment=await Comment.findByIdAndUpdate(
    req.params.commentId,
{
    content:req.body.content
},{new:true}
)
return  res.status(201).json({success:true,message:"comment  edit success",editedComment});

  }
  catch(error){
    return  res.status(500).json({success:false,message:"comment  edit error",error});

  }
};
module.exports.deleteComment = async (req, res) => {
  try {
    const comment=await Comment.findById(req.params.commentId)
  if(!comment)  return  res.status(404).json({message:"comment  Not Found!"});
 if(req.user.id!==comment.userId)  return res.status(403).json({
    message:'You are not allowed to delete this comment'})
  
await Comment.findByIdAndDelete(
    req.params.commentId);
return  res.status(200).json({success:true,message:"comment  delete success",comment});

  }
  catch(error){
    return  res.status(500).json({success:false,message:"comment  delete error",error});

  }
};
module.exports.getComments = async (req, res) => {
    if(!req.user.isAdmin)return res.status(403).json({message:'You are not allowed to get all comments'});

  try {
    const startIndex=parseInt(req.query.startIndex) || 0;
    const sortDirection=req.query.order==='asc'?1 :-1;
    const limit=parseInt(req.query.limit )||9;
    const comments=await Comment.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit);
    const totalComments=await Comment.countDocuments();
    const now=new Date();
    const oneMonthAgo=new Date(
        now.getFullYear(),
        now.getMonth()-1,
        now.getDate()
    )
const lastMonthComments=await Comment.countDocuments({
    createdAt:{$gte:oneMonthAgo}
});
return res.status(200).json({message:"Comment getting Successfully",success:true,
    comments,totalComments,lastMonthComments
});
   }

  
  catch(error){
    return  res.status(500).json({success:false,message:"comment  delete error",error});

  }
};
