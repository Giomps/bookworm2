// Se connecter sur mongoDB
require('./database/connexion')
const express = require('express')
let app = express()
let path = require('path')
let session = require('express-session')
let clientModel = require('./models/client')
// Crypter les mots de passe
let bcrypt = require('bcryptjs')

app.use(session({secret: 'a4f8071f-c873-4447-8ee2', resave: false,   saveUninitialized: false,}));

/* Pour accéder au serveur  */
app.use(express.urlencoded({extended: false}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());

                    
                            /* Les produits */
let products = [ 
    {
        title: "Blade Runner",
        price:"12,99",
        description:"Le mouton n'était pas mal, avec sa laine et ses bêlements plus vrais que nature - les voisins n'y ont vu que du feu. Mais il arrive en fin de carrière : ses circuits fatigués ne maintiendront plus longtemps l'illusion de la vie. Il va falloir le remplacer. Pas par un autre simulacre, non, par un véritable animal. Deckard en rêve, seulement ce n'est pas avec les maigres primes que lui rapporte la chasse aux androïdes qu'il parviendra à mettre assez de côté. Holden, c'est lui qui récupère toujours les boulots les plus lucratifs - normal, c'est le meilleur. Mais ce coup-ci, ça n'a pas suffi. Face aux Nexus-6 de dernière génération, même Holden s'est fait avoir. Alors, quand on propose à Deckard de reprendre la mission, il serre les dents et signe. De toute façon, qu'at-il à perdre ?",
        img: "/images/livre/blade_runner.png"
    },
    {
        title: "Neuromancien",
        price:"23,99",
        description:"Case était le meilleur Hacker sur les autoroutes de l'information. Son cerveau étant directement relié à la matrice, il savait comme personne se frayer un chemin dans le cyberespace pour pirater des données pour le compte de riches clients. Voulant dépasser un de ses employeur, Case a été amputé de son système nerveux, le privant ainsi de l'accès à la matrice. Complètement déprimé, le jeune homme n'a plus aucun moyen de s'évader de la prison qu'est son corps, jusqu'au jour où une mystérieuse conspiration va lui offrir une seconde chance...",
        img:"/images/livre/neuromancien.png"
    },
    {
        title: "1984",
        price:"9,90",
        description: "Année 1984 en Océanie. 1984 ? Winston ne saurait en jurer. Le passé a été réinventé, Winston est lui-même chargé de récrire les archives qui contredisent le présent et les promesses de Big Brother. Grâce à une technologie de pointe, ce dernier sait tout, voit tout, connait les pensées de tout le monde. On ne peut se fier à personne et les enfants sont encore les meilleurs espions qui soient. Liberté est Servitude. Ignorance est Puissance. Telles sont les devises du régime de Big Brother. La plupart des Océaniens n'y voient guère à redire, surtout les plus jeunes qui n'ont pas connu l'époque de leurs grands-parents et le sens initial du mot « libre ». Winston refuse de perdre espoir. Il entame une liaison interdite avec l'insoumise Julia et tous deux vont tenter d'intégrer la Fraternité, une organisation ayant pour but de renverser Big Brother. Mais celui-ci veille...",
        img:"/images/livre/1984.webp"
    }, 
    {
        title: "Chainsaw Man",
        price:"6,90",
        description:"Pour rembourser ses dettes, Denji, jeune homme dans la dèche la plus totale, est exploité en tant que Devil Hunter avec son chien-démon-tronçonneuse, Pochita. Mais suite à une cruelle trahison, il voit enfin une possibilité de se tirer des bas-fonds où il croupit ! Devenu surpuissant après sa fusion avec Pochita, Denji est recruté par une organisation et part à la chasse aux démons...",
        img:"/images/livre/chainsaw.jpg"
    },
    {          
        title: "Berserk",
        price:"10,90",
        description:"Dans un monde médiéval et marqué par un passé difficile, erre un mercenaire solitaire nommé Guts, décidé à être seul maître de son destin. Autrefois contraint par un pari perdu à rejoindre les Faucons, une troupe de mercenaires dirigés par Griffith, Guts fut acteur de nombreux combats sanglants et témoin de sombres intrigues politiques. Mais il réalisa soudain que la fatalité n'existe pas et qu'il pouvait reprendre sa liberté s'il le désirait vraiment...Mais un mal le traque sans relâche.",
        img:"/images/livre/berserk.jpeg"
    },
    {
        title: "One Piece",
        price:"5,90",
        description: "Il fut un temps où Gold Roger était le plus grand de tous les pirates, le Roi des Pirates était son surnom. A sa mort, son trésor d'une valeur inestimable connu sous le nom de One Piece fut caché quelque part sur Grand Line. De nombreux pirates sont partis à la recherche de ce trésor mais tous sont morts avant même de l'atteindre. Monkey D. Luffy rêve de retrouver ce trésor légendaire et de devenir le nouveau Roi des Pirates. Après avoir mangé un fruit du démon, il possède un pouvoir lui permettant de réaliser son rêve. Il lui faut maintenant trouver un équipage pour partir à l'aventure !",
        img:'/images/livre/onepiece.jpeg'
    }
  ]
                     
                         /* Internaute  */
   
/* Initier la session */ 
app.get('/', function(req, res) {
    if(req.session.basket == undefined) {
        req.session.basket = []
    }
    res.render('menu', {products, item: req.session.basket.length})
})

/* Ajouter des articles sur le panier */
app.post('/add', function(req, res) {
    req.session.basket.push(products[req.body.position])
    res.render('menu', {products, item: req.session.basket.length})
})

/* Affiche les articles du panier */
app.get('/panier', function(req, res) {
    res.render('panier', {panier:req.session.basket, products, item:req.session.basket.length})
})

/* Affiche un produit en détail */
app.get('/article', function(req, res) {
    console.log(req.query)
    let title= req.query.title;
    let price = req.query.price;
    let img = req.query.img;
    let description = req.query.description
    res.render('article', {products, title, price, img, description, item: req.session.basket.length})
})

/* Affiche la page de connexion */
app.get('/connexion', async function(req, res) {
    let emailExist = await clientModel.findOne({email: req.body.email})
    let passwordExist = await clientModel.findOne({password: req.body.password}) 
    res.render('connexion', {item:req.session.basket.length})
})

 /* Affiche la page d'inscription */
app.get('/inscription', function(req, res) {
    res.render('inscription', {item: req.session.basket.length})
})

/* Envoyer le formulaire à la base de données */
app.post('/send', async function(req, res) {

        /* Recuperer un email existant dans le backend */
        let alreadyExist = await clientModel.findOne({ email: req.body.email});
        console.log(alreadyExist)

        /* Générer le cryptage des mots de passe */
        let salt = await bcrypt.genSalt()
        let hash = await bcrypt.hash(req.body.password, salt)

       /*  Initialisation du message d'erreur  */
        let message = []

        /* Si les mots de passe ne sont pas identiques, alors on affiche un message d'erreur    */
        if(req.body.password != req.body.password_second) {
           return message.push('Les mots de passe ne correspondent pas')
        } else {
            res.redirect('/welcome')
        }

        /* Si l'email inscrit est déjà utilisé, alors on envoie un message d'erreur */ 
        if(alreadyExist) {
            return message.push('Cet email est déjà utilisé. Veuillez en choisir un autre')
        } else {
            res.redirect('/welcome')
        }

        /* Si durant l'inscription, aucun message est affiché alors, on envoie le formulaire dans la base de données  */
        if(message.length === 0){
            let newClient = new clientModel({
              nom: req.body.nom,
              prenom: req.body.prenom,
              gender: req.body.gender,
              address: req.body.address,
              email: req.body.email,
              password: hash
            })
            await newClient.save();
            res.redirect('/welcome')
        } 
        res.render('inscription', {message, item:req.session.basket})
})

                              /* Client */
app.get('/welcome', function(req, res) {
    res.render('welcome', {item: req.session.basket.length})
})                            
                              /* ERROR 404 */
app.get('*', function(req, res) {
    res.render('404')
})

/* Lancer le localhost */
app.listen(3000, () => {
    console.log("Serveur lancé")
})