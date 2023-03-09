/* Se connecter sur mongoDB */
require('./database/connexion')
const express = require('express')
let app = express()
let path = require('path')
let session = require('express-session')
/* Importer le schéma du client */
let clientModel = require('./models/client')
/* Importer le schéma d'un article */
let productsModel = require('./models/products')

/* Crypter les mots de passe */
let bcrypt = require('bcryptjs')
/* Modifie les requêtes pour formater les différents données */
let bodyParser = require('body-parser')
/* Session */
app.use(session({
    secret: 'a4f8071f-c873-4447-8ee2', 
    resave: false,   
    saveUninitialized: true,
    cookie: {secure: false}
}));

/* Afficher les fichiers ejs  */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

          /* Middleware */

/* Analyser les données des formulaires */
app.use(bodyParser.urlencoded({extended: false}))
/* parse application application/json  */
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());


/* Page d'accueil  */
app.get('/', async function(req, res, next) {

    let products = await productsModel.find()

    /* Initier la session du panier */
    if (req.session.basket == undefined) {
        req.session.basket = []
    }
    if (req.session.user) {
        res.render('menu', {products, item: req.session.basket.length, user: req.session.user.user})
    } 

    res.render('menu', {user: req.session.user, products, item: req.session.basket.length})
})

/* Afficher un produit en détail */
app.get('/article/:id', async  function(req, res) {
    let productId = req.params.id
    let product = await productsModel.findById(productId);
    res.render('article', {user: req.session.user, product, item: req.session.basket.length})
})

/* Afficher le panier */
app.get('/panier', async function(req, res) {
    let products = await productsModel.find()
    res.render('panier', {products, user: req.session.user, basket: req.session.basket, item: req.session.basket.length})
})

/* Ajouter un produit dans le panier  */
app.post('/add', async function(req, res) {
    let products = await productsModel.find()
    req.session.basket.push(products[req.body.position])
    res.render('menu', {products, item: req.session.basket.length})
})


/* Afficher la page de connexion */
app.get('/connexion',  function(req, res) {
    res.render('connexion', {item:req.session.basket.length})
})

/* Se connecter avec son compte  */
app.post('/connexion', async function(req, res) {
    let user = await clientModel.findOne({email: req.body.email})
    let passwordMatch = await bcrypt.compare(req.body.password, user.password)

    let message = []

    if(!user) {
        message.push("L'email est incorrect ou inexistant")
    }

    if(!passwordMatch) {
        message.push("Le mot de passe est incorrect ou inexistant")
    }
    
    if(user && passwordMatch) {
        req.session.user = {
            prenom: user.prenom,
            id: user._id,
        }
        return res.redirect('/')
    } 

    res.render('connexion', {item: req.session.basket.length, message})
})

 /* Affiche la page d'inscription */
app.get('/inscription', function(req, res) {
    res.render('inscription', {item: req.session.basket.length, user:req.session.user})
})

/* Envoyer le formulaire à la base de données */
app.post('/send', async function(req, res) {
    /* Recuperer un email existant sur une base de données  */
    let alreadyExist = await clientModel.findOne({email: req.body.email})
    /* Générer le cryptage des mots de passe */
    let salt = await bcrypt.genSalt()
    let hash = await bcrypt.hash(req.body.password, salt)
    /*  Initialisation du message d'erreur  */
    let message = []

    /* Si l'email est déjà existant, alors on affiche un message d'erreur */
    if (alreadyExist) {
        message.push("L'email est déjà existant. Veuillez en choisir un autre")
    }
     /* Si les deux mots de passe ne sont pas identiques, alors on affiche un message d'erreur */
    if (req.body.password != req.body.password_second) {
        message.push("les mots de passe ne sont pas identiques")
    }

    /* Si l'email n'est pas encore inscrit dans la base de données et que les deux mots de passe sont identiques, 
       alors on envoie le formulaire dans la base de données  */
    if (alreadyExist != req.body.email && req.body.password == req.body.password_second) {
        let newClient = new clientModel({
            nom: req.body.nom,
            prenom: req.body.prenom,
            gender: req.body.gender,
            email: req.body.email,
            address: req.body.address,
            password: hash
        })
        /* On stocke le modèle de l'inscription dans une variable et avec la variable, 
           on affecte le id et prenom du modèle dans la session user */ 
        let client = await newClient.save()
        req.session.user = {
            prenom: client.prenom,
            id: client._id
        }
        /* On redirige vers la page du menu  */
        return res.redirect('/')
    }

    res.render('inscription', {message, item:req.session.basket})
})

            /*  Client */
app.get('/monCompte', function(req,res) {
    res.render('monCompte', {user: req.session.user ,item:req.session.basket.length})
})

/* Mettre fin à la session AKA se deconnecter */
app.get('/logout', function(req, res) {
    req.session.user = null
    res.redirect('/')
});

/* ERROR 404 */
app.get('*', function(req, res) {
    res.render('404')
})

/* Lancer le localhost */
app.listen(3000, () => {
    console.log("Serveur lancé")
})  