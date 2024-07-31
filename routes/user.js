const {Router}=require("express");

const router=Router();
const {Signup,Login,Logout, updateUser,getUser, getUsers,deleteUser,Google} =require( '../controllers/user');
const {userVerification} =require('../middleware/user')
router.get('/',(req,res)=>{
    res.send('Home Page');
})
router.post("/signup",Signup);
router.post("/login",Login);
router.get('/getusers',userVerification,getUsers);
router.post('/update/:id',userVerification,updateUser);
router.delete('/delete/:id', userVerification, deleteUser);
router.get('/:id',getUser);

router.post("/logout",Logout);


//google 

router.post('/google',Google)
module.exports=router;
