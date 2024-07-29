const Post= require("../models/post");



module.exports.createPost=async(req,res)=>{
    if (!req.user.isAdmin) {
        return res.status(403).json({message:'You are not  allowed to create Post'})
    }
    try {
        
        
        // if(!req.user.isAdmin)return res.status(403).json({message:"You are not allowed to create post"});
        if(!req.body.title || !req.body.content)return res.status(400).json({message:"Please fill all the fields"});
        const slug=req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'');
        const newPost= await Post.create({
        
            ...req.body,
            slug,
            userId:req.user.id
        });
    
        return res.status(201).json({message:"Post created Successfully",success:true,newPost});
    } catch (e) {
        console.error('Error', e)
        return res.status(500).json({message:"Post creation Error",success:false});

    }
    
}

module.exports.getPosts=async(req,res)=>{
    try {
        const startIndex=parseInt(req.query.startIndex) || 0;
        const sortDirection=req.query.order==='asc'?1 :-1;
        const limit=req.query.limit || 9;
     const posts=await Post.find({
            ...(req.query.userId && {userId:req.query.userId}),
            ...(req.query.category && {category:req.query.category}),
            ...(req.query.slug && {slug:req.query.slug}),
            ...(req.query.postId) && {_id:req.query.postId},
            ...(req.query.searchTerm && {
                $or:[{title:{$regex:req.query.searchTerm,$options:'i'}},
                    {content:{$regex:req.query.searchTerm,$options:'i'}}
                ]
            })
        }).sort({updatedAt:sortDirection}).skip(startIndex).limit(limit);
        
        const totalPosts=await Post.countDocuments();
        const now=new Date();
        const monthAgo=new Date(
now.getFullYear(),
now.getMonth()-1,
now.getDate()
        )
        const lastMonthPosts=await Post.countDocuments({
            createdAt:monthAgo
        })

    
    
        return res.status(200).json({message:"Post getting Successfully",success:true,
            posts,totalPosts,lastMonthPosts
        });
    } catch (e) {
        console.error('Error', e)
        return res.status(500).json({message:"Post getting Error",success:false});

    }
    
}

module.exports.deletePost=async(req,res)=>{
 

    if(!req.user.isAdmin && req.params.userId!==req.user.id)return res.status(403).json({message:"You are not allowed to delete post"});
 
    try  {
        await Post.findByIdAndDelete(req.params.postId);

    
        return res.status(200).json({message:"Post Deleted Successfully",success:true});
    } catch (e) {
        console.error('Error', e)
        return res.status(500).json({message:"Post Deletion Error",success:false});

    }
    
}
module.exports.updatePost=async(req,res)=>{
  
    if(!req.user.isAdmin || req.params.userId!==req.user.id)return res.status(403).json({message:"You are not allowed to update post"});


    try  {
        const post=await Post.findByIdAndUpdate(req.params.postId,{
          
            $set:{
                title:req.body.title,
                content:req.body.content,
                category:req.body.category,
                image:req.body.image
            },
        
        },    {new:true});


    
        return res.status(201).json({message:"Post Updated Successfully",success:true,post});
    } catch (e) {
        console.error('Error', e)
        return res.status(500).json({message:"Post Updation Error",success:false});

    }
    
}