const express = require('express')
let path = require('path')
let session = require('express-session')
const app = express()
app.use(session({secret: 'a4f8071f-c873-4447-8ee2', resave: false,   saveUninitialized: false,}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());

let products = [ 
    {
        id: 1,
        title: "Blade Runner",
        price:"12,99",
        description:"Le mouton n'était pas mal, avec sa laine et ses bêlements plus vrais que nature - les voisins n'y ont vu que du feu. Mais il arrive en fin de carrière : ses circuits fatigués ne maintiendront plus longtemps l'illusion de la vie. Il va falloir le remplacer. Pas par un autre simulacre, non, par un véritable animal. Deckard en rêve, seulement ce n'est pas avec les maigres primes que lui rapporte la chasse aux androïdes qu'il parviendra à mettre assez de côté. Holden, c'est lui qui récupère toujours les boulots les plus lucratifs - normal, c'est le meilleur. Mais ce coup-ci, ça n'a pas suffi. Face aux Nexus-6 de dernière génération, même Holden s'est fait avoir. Alors, quand on propose à Deckard de reprendre la mission, il serre les dents et signe. De toute façon, qu'at-il à perdre ?",
        img: "/images/livre/blade_runner.png"
    },
    {
        id: 2,
        title: "Neuromancien",
        price:"23,99",
        description:"Case était le meilleur Hacker sur les autoroutes de l'information. Son cerveau étant directement relié à la matrice, il savait comme personne se frayer un chemin dans le cyberespace pour pirater des données pour le compte de riches clients. Voulant dépasser un de ses employeur, Case a été amputé de son système nerveux, le privant ainsi de l'accès à la matrice. Complètement déprimé, le jeune homme n'a plus aucun moyen de s'évader de la prison qu'est son corps, jusqu'au jour où une mystérieuse conspiration va lui offrir une seconde chance...",
        img:"/images/livre/neuromancien.png"
    },
    {
        id: 3,
        title: "1984",
        price:"9,90",
        description: "Année 1984 en Océanie. 1984 ? Winston ne saurait en jurer. Le passé a été réinventé, Winston est lui-même chargé de récrire les archives qui contredisent le présent et les promesses de Big Brother. Grâce à une technologie de pointe, ce dernier sait tout, voit tout, connait les pensées de tout le monde. On ne peut se fier à personne et les enfants sont encore les meilleurs espions qui soient. Liberté est Servitude. Ignorance est Puissance. Telles sont les devises du régime de Big Brother. La plupart des Océaniens n'y voient guère à redire, surtout les plus jeunes qui n'ont pas connu l'époque de leurs grands-parents et le sens initial du mot « libre ». Winston refuse de perdre espoir. Il entame une liaison interdite avec l'insoumise Julia et tous deux vont tenter d'intégrer la Fraternité, une organisation ayant pour but de renverser Big Brother. Mais celui-ci veille...",
        img:"/images/livre/1984.webp"
    }, 
    {
        id: 4,
        title: "Chainsaw Man",
        price:"6,90",
        description:"Pour rembourser ses dettes, Denji, jeune homme dans la dèche la plus totale, est exploité en tant que Devil Hunter avec son chien-démon-tronçonneuse, Pochita. Mais suite à une cruelle trahison, il voit enfin une possibilité de se tirer des bas-fonds où il croupit ! Devenu surpuissant après sa fusion avec Pochita, Denji est recruté par une organisation et part à la chasse aux démons...",
        img:"/images/livre/chainsaw.jpg"
    },
    {   
        id: 5,          
        title: "Berserk",
        price:"10,90",
        description:"Dans un monde médiéval et marqué par un passé difficile, erre un mercenaire solitaire nommé Guts, décidé à être seul maître de son destin. Autrefois contraint par un pari perdu à rejoindre les Faucons, une troupe de mercenaires dirigés par Griffith, Guts fut acteur de nombreux combats sanglants et témoin de sombres intrigues politiques. Mais il réalisa soudain que la fatalité n'existe pas et qu'il pouvait reprendre sa liberté s'il le désirait vraiment...Mais un mal le traque sans relâche.",
        img:"/images/livre/berserk.jpeg"
    },
    {
        id: 6,
        title: "One Piece",
        price:"5,90",
        description: "Il fut un temps où Gold Roger était le plus grand de tous les pirates, le Roi des Pirates était son surnom. A sa mort, son trésor d'une valeur inestimable connu sous le nom de One Piece fut caché quelque part sur Grand Line. De nombreux pirates sont partis à la recherche de ce trésor mais tous sont morts avant même de l'atteindre. Monkey D. Luffy rêve de retrouver ce trésor légendaire et de devenir le nouveau Roi des Pirates. Après avoir mangé un fruit du démon, il possède un pouvoir lui permettant de réaliser son rêve. Il lui faut maintenant trouver un équipage pour partir à l'aventure !",
        img:'/images/livre/onepiece.jpeg'
    }
  ]

app.get('/', function(req, res) {
    if(req.session.basket == undefined) {
        req.session.basket = []
    }
    res.render('menu', {products, item: req.session.basket.length})
})

app.post('/add', function(req, res) {
    req.session.basket.push(products[req.body.position])
    res.render('menu', {products, item: req.session.basket.length})
})

app.get('/panier', function(req, res) {
    res.render('panier', {basket:req.session.basket, item:req.session.basket.length})
})

app.get('/article', function(req, res) {
    console.log(req.query)
    let id = req.query.id; 
    let title= req.query.title;
    let price = req.query.price;
    let img = req.query.img;
    let description = req.query.description
    res.render('article', {title, id, price, img, description, item: req.session.basket.length})
})

app.get('/connexion', function(req, res) {
    res.render('connexion')
})

app.get('/inscription', function(req, res) {
    res.render('inscription')
})

app.listen(3000, () => {
    console.log("Serveur lancé")
})