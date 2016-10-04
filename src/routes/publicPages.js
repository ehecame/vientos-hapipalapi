var ProjectManager = require('./../managers/project')
var CodeManager = require('./../managers/code')
var SessionController = require('./../controllers/session')
var Bcrypt = require('bcrypt-nodejs')
var multiparty = require('multiparty')
var fs = require('fs')
var _ = require('underscore')

module.exports = function () {
  return [
    {
      method: 'GET',
      path: '/',
      config: {
        handler: function (request  , reply) {
          var lan = request.query.lang == "en" ? "en" : "es"
          setDataAuth(request, function(data){
            data.withFooter = true
            data.categories = getCategoriesArray(lan)
            data.hiddenCats = getHiddenCatsArray(lan)
            data.collaborations = getCollaborationWaysArray(lan)
            data.hiddenColls = getHiddenCollsArray(lan)
            data.principles = getPrinciples(lan)
            data.tags = getIndexTags(lan)
            reply.view('index', data)
          })
        },
        auth: {
           mode: 'try',
           strategy: 'standard'
        },
        plugins: { 'hapi-auth-cookie': { redirectTo: false } }
      }
    }, {
      method: 'GET',
      path: '/home',
      config: {
        handler: function (request, reply) {
          setDataAuth(request, function(data){
            data.withFooter = true
            data.tags = getIndexTags('es')
            reply.view('index2', data, { layout: 'default2' });
          })
        },
        auth: false
      }
    }, {
      method: 'GET',
      path: '/collaborate',
      config: {
        handler: function (request, reply) {
          setDataAuth(request, function(data){
            data.withFooter = false
            data.tags = {
              closeToMe: 'Cerca de mí',
              collaborate: 'Colabora',
              login: 'Inicia sesión',
              logout: 'Cierra sesión',
              myProfile: "Mi Perfil"
            }
            reply.view('collaborate', data)
          })
        }
      // auth: false
      }
    }, {
      method: 'GET',
      path: '/user/register/{code?}',
      config: {
        handler: function (request, reply) {
          setDataAuth(request, function(data){
            data.withFooter = false
            data.code = request.params.code
            reply.view('userRegister', data)
          })
        },
        auth: false
      }
    } , {
      method: 'GET',
      path: '/user/welcome',
      config: {
        handler: function (request, reply) {
          setDataAuth(request, function(data){
            data.withFooter = false
            reply.view('welcome', data)
          })
        },
        auth: false
      }
    } , {
      method: 'GET',

      path: '/howtocollaborate',
      handler: function (request, reply) {
        setDataAuth(request, function(data){
          data.withFooter = true
          reply.view('howToCollaborate', data)
        })
      }
    }, {
      method: 'GET',
      path: '/login',
      config: {
        handler: function (request, reply) {
          var data = {}
          data.redirect = request.query.next ? request.query.next : '/myprofile'
          reply.view('login', data)
        },
        auth: false
      }
    }, {
      method: 'GET',
      path: '/logout',
      config: {
        handler: function (request, reply) {
          if (request.auth.isAuthenticated) {
            request.cookieAuth.clear()
          }
          reply.redirect('/')
        }
      }
    }, {
      method: 'GET',
      path: '/project/{projectId}',
      config: {
        handler: function (request, reply) {
          setDataAuth(request, function(data){
            data.withFooter = false
            var db = request.mongo.db
            var objID = request.mongo.ObjectID
            ProjectManager.findById(db, new objID(request.params.projectId), {}, function (res) {
              data.p = res
              data.isOwner = data.isAdmin ||
                            (
                              data.p.owners &&
                              data.p.owners.indexOf(data.credentials.id) > -1 &&
                              data.credentials.projects &&
                              data.credentials.projects.indexOf(request.params.projectId) > -1
                            )
              if(!data.isAdmin){
                delete data.p.projectCodes
              }
              delete data.p.owners
              if(!data.p.pilot && !data.isOwner){
                data.p.name = 'No ha sido activado'
                delete data.p.description
                delete data.p.logo
                delete data.p.address
                delete data.p.facebook
                delete data.p.twitter
                delete data.p.webpage
                delete data.p.phone
                delete data.p.cellphone
                delete data.p.email
              }
              if(request.query.conf){
                data.showConf = true
              }
              data.p.categoriesIds = _.map(res.categories, function(cat){return cat.catId})
              reply.view('projectProfile', data)
            })
          })
        } /*,
        auth: false*/
      }
    },{
      method: 'POST',
      path: '/uploadPicture',
      config: {
        payload: {
          maxBytes: 209715200,
          output: 'stream',
          parse: false
        },
        handler: function (requset, reply) {
          var form = new multiparty.Form()
          form.parse(requset.payload, function (err, fields, files) {
            if (err) return reply(err)
            else {
              fs.readFile(files.file[0].path, function(err, data) {
                fs.writeFile('./public/img/' + files.file[0].originalFilename, data, function(err) {
                  if (err) return reply(err);
                   else return reply('File uploaded : ' + files.file[0].originalFilename)
                })
              })
            }
          })
        }
      }
    }, {
      method: 'GET',
      path: '/demo/collaborate',
      config: {
        handler: function (request, reply) {
          setDataAuth(request, function(data){
            reply.view('demoCol', data, { layout: 'empty' });
          })
        },
        auth: false
      }
    }, {
      method: 'GET',
      path: '/demo/sidebar',
      config: {
        handler: function (request, reply) {
          setDataAuth(request, function(data){
            reply.view('demoSide', data, { layout: 'empty' });
          })
        },
        auth: false
      }
    }
  ]
}()

function setDataAuth(request, callback){
  var data = {
    isAuthenticated: SessionController.isAuthenticated(request),
  }
  if (data.isAuthenticated) {
    data.credentials = SessionController.getSession(request)
    data.isAdmin = data.credentials.scope &&
                  ( data.credentials.scope == 'admin' ||
                    data.credentials.scope.indexOf('admin')>0)
    if(data.credentials.projects){
      SessionController.getProjects(request, function(res){
        data.myProjects = res
        callback(data)
      })
    } else callback(data)
  } else callback(data)
}

function getCategoriesArray(lan){
  var cats = {
    es: [
      { id: 'humanrights', icon: 'fa-globe', catTag: 'Derechos Humanos'},
      { id: 'productsservices', icon: 'fa-shopping-basket', catTag: 'Consumo Ético'},
      { id: 'environment', icon: 'fa-pagelines', catTag: 'Medio Ambiente'},
      { id: 'artculture', icon: 'fa-paint-brush', catTag: 'Arte y Cultura'},
      { id: 'gender', icon: 'fa-transgender-alt', catTag: 'Género'}
    ],
    en: [
      { id: 'humanrights', icon: 'fa-globe', catTag: 'Human Rights'},
      { id: 'productsservices', icon: 'fa-shopping-basket', catTag: 'Products and services '},
      { id: 'environment', icon: 'fa-pagelines', catTag: 'Environment '},
      { id: 'artculture', icon: 'fa-paint-brush', catTag: 'Art and Culture'},
      { id: 'gender', icon: 'fa-transgender-alt', catTag: 'Gender & Sexuality'}
    ]
  }
  return _.shuffle(cats[lan])
}

function getHiddenCatsArray(lan){
  var hCats = {
    es: [
      { id: 'health', icon: 'fa-medkit', catTag: 'Salud'},
      { id: 'education', icon: 'fa-book', catTag: 'Educación'},
      { id: 'food', icon: 'fa-cutlery', catTag: 'Alimentación'},
      { id: 'housing', icon: 'fa-home', catTag: 'Vivienda'},
      { id: 'clothing', icon: 'fa-scissors', catTag: 'Vestido'},
      { id: 'communication', icon: 'fa-bullhorn', catTag: 'Comunicación'},
      { id: 'technology', icon: 'fa-cogs', catTag: 'Tecnología'},
      { id: 'transport', icon: 'fa-bicycle', catTag: 'Transporte'},
      { id: 'networks', icon: 'fa-cubes', catTag: 'Red'}
    ],
    en: [
      { id: 'health', icon: 'fa-medkit', catTag: 'Health'},
      { id: 'education', icon: 'fa-book', catTag: 'Education'},
      { id: 'food', icon: 'fa-cutlery', catTag: 'Nutrition '},
      { id: 'housing', icon: 'fa-home', catTag: 'Housing '},
      { id: 'clothing', icon: 'fa-scissors', catTag: 'Clothing'},
      { id: 'communication', icon: 'fa-bullhorn', catTag: 'Communication'},
      { id: 'technology', icon: 'fa-cogs', catTag: 'Technology '},
      { id: 'transport', icon: 'fa-bicycle', catTag: 'Transport'},
      { id: 'networks', icon: 'fa-cubes', catTag: 'Network'}
    ]
  }
  return _.shuffle(hCats[lan])
}

function getCollaborationWaysArray(lan){
  var colls ={
    es: [
      { icon: 'material', collTag: 'Materiales y Herramientas'},
      { icon: 'knowledge', collTag: 'Conocimientos y Habilidades'},
      { icon: 'event',collTag: 'Eventos y Talleres'},
      { icon: 'volunteer', collTag: 'Trabajo Comunitario'},
      { icon: 'spread', collTag: 'Difusión de proyectos'}
    ],
    en: [
      { icon: 'material', collTag: 'Tools and Materials'},
      { icon: 'knowledge', collTag: 'Knowledge and Skills'},
      { icon: 'event',collTag: 'Activities and Events'},
      { icon: 'volunteer', collTag: 'Volunteering'},
      { icon: 'spread', collTag: 'Spread the word'}
    ]
  }
  return _.shuffle(colls[lan])
}

function getHiddenCollsArray(lan){
  var hiddenColls = {
    es: [
      { icon: 'product', collTag: 'Productos'},
      { icon: 'service', collTag: 'Servicios'},
      { icon: 'job',collTag: 'Chambas'},
      { icon: 'space', collTag: 'Espacios'},
      { icon: 'link', collTag: 'Recomienda y vincula'},
      { icon: 'art', collTag: 'Comparte tu arte'},
      { icon: 'funding', collTag: 'Fondeo Colectivo'}
    ],
    en: [
      { icon: 'product', collTag: 'Products'},
      { icon: 'service', collTag: 'Services'},
      { icon: 'job',collTag: 'Jobs'},
      { icon: 'space', collTag: 'Spaces'},
      { icon: 'link', collTag: 'Connect and Recommend'},
      { icon: 'art', collTag: 'Share your Art'},
      { icon: 'funding', collTag: 'Crowdfunding'}
    ]
  }
  return _.shuffle(hiddenColls[lan])
}

function getPrinciples(lan){
  var principles = {
    es: [
      {size:4, tag:'Sustentabilidad'},
      {size:4, tag:'Cultura en Red'},
      {size:4, tag:'Apoyo mutuo'},
      {size:6, tag:'Producción Local y Artesanal '},
      {size:6, tag:'Cuidado del Medio Ambiente'},
      {size:6, tag:'Distribución de la Riqueza'},
      {size:4, tag:'Trabajo digno'}
    ],
    en: [
      {size:4, tag:'Sustainability'},
      {size:4, tag:'Local economic development'},
      {size:4, tag:'Collaborative culture'},
      {size:6, tag:'Community engagement'},
      {size:6, tag:'Artisans and small producers'},
      {size:6, tag:'Protection of the environment'},
      {size:4, tag:'Equitable distribution of wealth'}
    ]
  }
  return _.shuffle(principles[lan])
}

function getIndexTags(lan){
  var tags = {
    es: {
      closeToMe: 'Cerca de mí',
      collaborate: 'Colabora',
      login: 'Inicia sesión',
      logout: 'Cierra sesión',
      myProfile: "Mi Perfil",
      together: 'Juntxs',
      collaborating: 'Colaborando en',
      showMore:'¡Ver todas!',
      youCanCollaborate: 'Puedes colaborar',
      inLotsOfWays: 'de muchas maneras',
      solidarityEconomy: 'Economía Solidaria',
      solidarityEconomyBullets: [
        "Red Comercio justo y solidario",
        "Cuenta la historia de tu negocio",
        "Compra, venta y trueque",
        "Productos y Servicios de tu comunidad"
      ],
      individuals: "Personas",
      individualsBullets: [
        "Colabora con proyectos sociales",
        "Eventos, clases y talleres",
        "Chambas y voluntariado",
        "Compra local. Apoya negocios éticos",
        "Tus intereses. Tus habilidades"
      ],
      socialProjects: "Proyectos Sociales",
      socialProjectsBullets: [
        "Recursos compartidos en tu zona",
        "No gastes, colabora",
        "Agrega tu proyecto al mapa",
        "Difunde tu proyecto y actividades"
      ],
      register: "Regístrate",
      topCollaborators: "Más colaboradores",
      aboutUs: "Nosotrxs",
      aboutUsTexts: [
        "Vientos es una plataforma de fortalecimiento de proyectos sociales y de la economía solidaria mediante la colaboración entre ellos y con su comunidad.",
        "Somos un proyecto independiente, sin fines de lucro y bajo los principios de código libre y tecnología cívica.",
        "Los criterios que definen qué tan ético es un proyecto o negocio son votados por todos los usuarios de la página."
      ],
      principlesTitle: "Impulsamos y practicamos valores como:"
    },
    en: {
      closeToMe: 'Close to me',
      collaborate: 'Collaborate',
      login: 'Log in',
      logout: 'Log out',
      myProfile: 'My Profile',
      together: 'Together',
      collaborating: 'Collaborating on',
      showMore:'See all!',
      youCanCollaborate: 'You can collaborate',
      inLotsOfWays: 'in lots of ways',
      solidarityEconomy: 'Solidarity Economy',
      solidarityEconomyBullets:  [
        "Fair trade and solidarity network",
        "Tell your business story",
        "Buy, sell, lend, borrow, barter",
        "Local products and services"
      ],
      individuals: "Individuals",
      individualsBullets: [
        "Collaborate with social projects ",
        "Events, classes and workshops",
        "Jobs and volunteering ",
        "Buy local. Support ethical businesses ",
        "Your Interests. Your Skills"
      ],
      socialProjects: "Social Projects",
      socialProjectsBullets:[
        "Shared resources in your area",
        "Save money, collaborate ",
        "Add your project to the map",
        "Spread the word about your activities "
      ],
      register: "Register",
      topCollaborators: "Top Collaborators",
      aboutUs: "About Us",
      aboutUsTexts: [
        "Vientos is a platform that fosters collaboration and networks of support for social projects and ethical businesses.",
        "We are a nonprofit, independent project that promotes the principles of civic technology and open source.",
        "The criteria for ethical businesses is voted for by all users of the platform."
      ],
      principlesTitle: "We further values such as:"
    }

  }
  return tags[lan]
}
