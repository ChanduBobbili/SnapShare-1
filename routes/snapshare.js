const fs = require('fs');
const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const db = require('../data/database');

cloudinary.config({
    cloud_name: 'dsxwazqcp',
    api_key: '775779393895268',
    api_secret: 'lN_nwAuHDhRMnR9GhPYbnufkJKM'
});

const storageConfig = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storageConfig });


router.get('/',async function(req,res){
    res.render('home');
});

router.get('/discover',async function(req,res){
    const posts = await db.getDb().collection('basic').find().toArray();
    res.render('discover',{posts: posts});
});

router.get('/upload',function(req, res){
    res.render('upload')
});

router.post('/upload', upload.fields([{ name: 'profile', maxCount: 1 }, { name: 'photos', maxCount: 8 }]), async function(req, res) {
    try {
    
        const profileImage = req.files['profile'][0];
        const profileImageResult = await cloudinary.uploader.upload(profileImage.path, { folder: 'profiles'});
  
        const imageFiles = req.files['photos'];
        const imageResults = await Promise.all(
            imageFiles.map(async (imageFile) => {
            const imageResult = await cloudinary.uploader.upload(imageFile.path, { folder: 'images'});
            return imageResult.secure_url;
            })
        );

        const newPost = {
            name: req.body.fullname,
            email: req.body.email,
            message: req.body.message,
            profilePath: profileImageResult.secure_url,
            imagePath: imageResults
        };
    
        const result = await db.getDb().collection('basic').insertOne(newPost);

        // Remove local files
        fs.unlinkSync(profileImage.path);
        imageFiles.forEach((imageFile) => {
        fs.unlinkSync(imageFile.path);
        });

        res.redirect('/');
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while processing the form.');
        }
});

router.get('/posts/:id', async function(req, res) {
    const postId = req.params.id;
    const result = await db.getDb().collection('basic').find({ _id: new ObjectId(postId) }).toArray();

    if (result.length > 0) {
    const post = result[0];
    res.render('post', { post: post });
    } else {
    res.status(404).json({ error: 'Post not found' });
    }
});

router.post('/upload-local', upload.fields([{ name: 'profile', maxCount: 1 }, { name: 'photos', maxCount: 8 }]), async function(req, res) {
    try {
        const profileFile = req.files['profile'][0];
        const uploadedFiles = req.files['photos'];
        const newPost = {
            name: req.body.fullname,
            caption: req.body.caption,
            email: req.body.email,
            message: req.body.message,
            profilePath: profileFile.path,
            imagePath: uploadedFiles.map(file => file.path)
        };
        const result = await db.getDb().collection('basic').insertOne(newPost);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing the form.');
    }
});


module.exports = router;