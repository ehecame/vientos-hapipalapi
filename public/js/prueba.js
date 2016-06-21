var markers = new L.FeatureGroup()
var map
var neCornerLat = 19.467827
var neCornerLon = -99.085597
var latDif = 0.117062
var swCornerLat = 19.350765
var swCornerLon = -99.189814
var lonDif = 0.104217

$(document).ready(function () {
  setSideMenuScrollFunc()
  addMap()
  setClosePopUpAction()
  addAllMarkers()
  setCloseMapSideBarFunc()
  setHoverCollaborationCategoryFunc()
  $('#btnCloseToMe').click(centerMapMyLocation)
})

function rmAllMarkers () {
  map.removeLayer(markers)
  markers = new L.FeatureGroup()
}

function getRandomLat () {
  var lat = Math.random() * latDif + swCornerLat
  console.log('lat: ' + lat)
  return lat
}

function getRandomLon () {
  var lon = Math.random() * lonDif + swCornerLon
  console.log('lon: ' + lon)
  return lon
}

function getRandomProjectType () {
  var projectTypes = [
    {
      type: 'Cooperative',
      color: '#800000'
    },
    {
      type: 'Collective',
      color: '#008B8B'
    },
    {
      type: 'NGO',
      color: '#556B2F'
    },
    {
      type: 'Ethical Business',
      color: '#B8860B'
    },
    {
      type: 'Citizen Initiative',
      color: '#C63D1E'
    },
    {
      type: 'Startup',
      color: '#58376C'
    }
  ]
  return projectTypes[Math.floor((Math.random() * 6))]
}

function addAllMarkers () {
  rmAllMarkers()
  addHealthMarkers()
  addEducationMarkers()
  addFoodMarkers()
  addHousingMarkers()
  addClothingMarkers()
  addArtCultureMarkers()
  addProductsServicesMarkers()
  addWorkshopsCoursesMarkers()
  addCommunityMarkers()
  addCommunicationMarkers()
  addHumanRigthsMarkers()
  addEnvironmentMarkers()
  addTechnologyMarkers()
  addTransportationMarkers()
  addGenderMarkers()
  map.addLayer(markers)
}

function addMarkers (markerList) {
  var marker
  var myIcon
  console.log(markerList)
  $.each(markerList, function (i, m) {
    console.log(m)
    console.log(m.categories[0].icon)
    console.log(m.projectType.color)
    myIcon = L.divIcon({
      html: '<div class="myIcon fa-stack fa-2x">' +
        '<i class="fa fa-map-marker fa-stack-2x" style="color:' + m.projectType.color + ';"></i>' +
        '<i class="fa fa-circle fa-stack-1x" style="margin-top: -.2em; color:' + m.projectType.color + ';"></i> ' +
        '<i class="fa ' + m.categories[0].icon + ' fa-stack-1x" style="margin-top: -.3em; font-size: .7em; color: white; " ></i>' +
        '<div class="markerPopUp">' +
        '<div class="markerPopUpTriangle" ></div>' +
        '<div class="markerPopUpName" >' + m.name + '</div>' +
        '<div class="markerPopUpDescription">' + m.description + '</div>' +
        '</div>' +
        '</div> ',
      popupAnchor: new L.Point(-5, -40)
    })
    marker = L.marker([getRandomLat(), getRandomLon()], {icon: myIcon})
    marker.on('mouseover', function (e) {
      $(this._icon).find('.markerPopUp').show()
      $(this._icon).find('.markerPopUpName').show()
      $(this._icon).find('.markerPopUpDescription').show()
    })
    marker.on('mouseout', function (e) {
      popUpBehaviorByZoom()
    })
    marker.on('click', function (e) {
      showMapSideBar(m)
    })
    markers.addLayer(marker)
  })
  map.addLayer(markers)
}

function addHealthMarkers () {
  healthDummies = [
    {
      name: 'Alternative Medicine Cooperative ',
      description: 'Working on alternative medicine in the southern region of the city since 1999. We organize community events to spread awareness on alternative medicine and give different therapies and treatments',
      phone: '123456789',
      mobile: '+1 901 23456789',
      email: 'test@mail.com',
      facebook: 'http://www.facebook.com/test',
      twitter: 'http://www.twitter.com/Test',
      address: 'Test st. #123, Test City, Test',
      projectType: {
        type: 'Cooperative',
        color: '#800000'
      },
      categories: [
        {
          name: 'health',
          icon: 'fa-medkit'
        }
      ],
      needs: [
        {
          name: 'Medical equipment'
        },
        {
          name: 'Chairs for consulting room'
        },
        {
          name: 'Specialist in neurology'
        },
        {
          name: 'Food for event on alternative medicine'
        },
        {
          name: 'Lollipops for brave kids'
        }
      ],
      offers: [
        {
          name: 'Workshop on alternative medicine'
        },
        {
          name: 'Available room on Sunday for medical practices'
        },
        {
          name: 'Specialist on elbow massages'
        }
      ]
    }
  ]
  addMarkers(healthDummies)
}

function addEducationMarkers () {
  var educationDummies = [
    {
      name: 'Autonomous school ',
      description: 'We teach holistic programs focused on the common good',
      phone: '123456789',
      mobile: '+1 901 23456789',
      email: 'test@mail.com',
      facebook: 'http://www.facebook.com/test',
      twitter: 'http://www.twitter.com/Test',
      address: 'Test st. #123, Test City, Test',
      projectType: {
        type: 'Collective',
        color: '#008B8B'
      },
      categories: [
        {
          name: 'education',
          icon: 'fa-book'
        }
      ],
      needs: [
        {
          name: 'Books for the 3th grade',
          icon: 'fa-material'
        },
        {
          name: 'Help with designing science class event',
          icon: 'fa-event'
        },
        {
          name: 'Alliance with nearby school for communal greenhouse',
          icon: 'fa-connection'
        },
        {
          name: 'Funds for teachers´ romantic evening',
          icon: 'fa-funding'
        }
      ],
      offers: [
        {
          name: 'Volunteers for designing educational projects',
          icon: 'fa-volunteer'
        },
        {
          name: 'Courses on the dangers of the privatization of schools',
          icon: 'fa-knowledge'
        },
        {
          name: 'Guidance for educational startups',
          icon: 'fa-knowledge'
        }
      ]
    }
  ]
  addMarkers(educationDummies)
}

function addFoodMarkers () {
  var foodDummies = [
    {
      name: 'Food not politics ',
      description: 'We recycle food, provide food as support for social projects, create awareness about food waste',
      phone: '123456789',
      mobile: '+1 901 23456789',
      email: 'test@mail.com',
      facebook: 'http://www.facebook.com/test',
      twitter: 'http://www.twitter.com/Test',
      address: 'Test st. #123, Test City, Test',
      projectType: {
        type: 'NGO',
        color: '#556B2F'
      },
      categories: [
        {
          name: 'food',
          icon: 'fa-cutlery'
        }
      ],
      needs: [
        {
          name: 'Surplus food from markets',
          icon: 'fa-productsservices'
        },
        {
          name: 'Connections with local producers',
          icon: 'fa-connection'
        },
        {
          name: 'Funds for hiring specialists',
          icon: 'fa-funding'
        }
      ],
      offers: [
        {
          name: ' Prepared food for events on agroecology or urban gardening',
          icon: 'fa-productsservices'
        },
        {
          name: 'Research videos on the relation between food and new economic paradigms',
          icon: 'fa-knowledge'
        },
        {
          name: 'Cheap boxes and packages',
          icon: 'fa-productsservices'
        },
        {
          name: 'donuts for happy people',
          icon: 'fa-productsservices'
        }
      ]
    }
  ]
  addMarkers(foodDummies)
}

function addHousingMarkers () {
  var housingDummies = [
    {
      name: 'Bioconstruction collective ',
      description: 'We build urban ecovillages, design tree houses with fair trade wood, advise on sustainability regarding construction',
      phone: '123456789',
      mobile: '+1 901 23456789',
      email: 'test@mail.com',
      facebook: 'http://www.facebook.com/test',
      twitter: 'http://www.twitter.com/Test',
      address: 'Test st. #123, Test City, Test',
      projectType: {
        type: 'Collective',
        color: '#008B8B'
      },
      categories: [
        {
          name: 'housing',
          icon: 'fa-home'
        }
      ],
      needs: [
        {
          name: 'Bricks for pizza oven',
          icon: 'fa-material'
        },
        {
          name: 'Available land to start an intentional housing community',
          icon: 'fa-space'
        },
        {
          name: 'Knowledge on bridge and spacecraft construction',
          icon: 'fa-knowledge'
        }
      ],
      offers: [
        {
          name: 'Cheap housing in the West of the city',
          icon: 'fa-space'
        },
        {
          name: 'Workshop on crowdfunding',
          icon: 'fa-knowledge'
        },
        {
          name: 'Specialist on hexagonal buildings with Jacuzzis',
          icon: 'fa-knowledge'
        }
      ]
    }
  ]
  addMarkers(housingDummies)
}

function addClothingMarkers () {
  var clothingDummies = [
    {
      name: 'Knitting project ',
      description: 'We are a group of indigenous men and women who work on the conservation of traditional knitting practices and selling textiles',
      phone: '123456789',
      mobile: '+1 901 23456789',
      email: 'test@mail.com',
      facebook: 'http://www.facebook.com/test',
      twitter: 'http://www.twitter.com/Test',
      address: 'Test st. #123, Test City, Test',
      projectType: {
        type: 'Citizen Initiative',
        color: '#C63D1E'
      },
      categories: [
        {
          name: 'clothing',
          icon: 'fa-scissors'
        }
      ],
      needs: [
        {
          name: 'A table',
          icon: 'fa-material'
        },
        {
          name: 'Advertisement in the neighbourhood',
          icon: 'fa-idea'
        },
        {
          name: 'Volunteers for local event',
          icon: 'fa-volunteer'
        }
      ],
      offers: [
        {
          name: 'Free large pants from last season',
          icon: 'fa-productsservices'
        },
        {
          name: 'Knitting lessons',
          icon: 'fa-knowledge'
        },
        {
          name: 'Graphic design expert',
          icon: 'fa-knowledge'
        }
      ]
    }
  ]
  addMarkers(clothingDummies)
}

function addArtCultureMarkers () {
  var artCultureDummies = [
    {
      name: 'Art and Culture NGO ',
      description: 'Organization working on crowdsourced art inspiration, community-building through art, and programs for children',
      phone: '123456789',
      mobile: '+1 901 23456789',
      email: 'test@mail.com',
      facebook: 'http://www.facebook.com/test',
      twitter: 'http://www.twitter.com/Test',
      address: 'Test st. #123, Test City, Test',
      projectType: {
        type: 'NGO',
        color: '#556B2F'
      },
      categories: [
        {
          name: 'artculture',
          icon: 'fa-paint-brush'
        }
      ],
      needs: [
        {
          name: 'Funds for new exposition on Koalas',
          icon: 'fa-funding'
        },
        {
          name: 'Frames for artwork',
          icon: 'fa-material'
        },
        {
          name: 'Allies for experimental project on the consequences of parachuting with a bag of blue painting',
          icon: 'fa-connection'
        }
      ],
      offers: [
        {
          name: 'Organic crayons from last failed experiment',
          icon: 'fa-productsservices'
        },
        {
          name: 'Guidelines for art projects in schools',
          icon: 'fa-knowledge'
        },
        {
          name: 'Painting your house when kids mess with it',
          icon: 'fa-productsservices'
        }
      ]
    }
  ]
  addMarkers(artCultureDummies)
}

function addProductsServicesMarkers () {
  var prodServDummies = [
    {
      name: 'Ethical tomatoes business',
      description: 'Local business using fair trade and organic products from the local area. We sell pizza, smoothies, and ice cream.',
      phone: '123456789',
      mobile: '+1 901 23456789',
      email: 'test@mail.com',
      facebook: 'http://www.facebook.com/test',
      twitter: 'http://www.twitter.com/Test',
      address: 'Test st. #123, Test City, Test',
      projectType: {
        type: 'Ethical Business',
        color: '#B8860B'
      },
      categories: [
        {
          name: 'productsservices',
          icon: 'fa-shopping-basket'
        }
      ],
      needs: [
        {
          name: 'Advertisement in the neighbourhood',
          icon: 'fa-idea'
        },
        {
          name: 'Organic honey for our local smoothies,',
          icon: 'fa-productsservices'
        },
        {
          name: 'Help with branding.',
          icon: 'fa-knowledge'
        }
      ],
      offers: [
        {
          name: 'Expertise on organic certification',
          icon: 'fa-knowledge'
        },
        {
          name: 'Contacts with local producers from the area',
          icon: 'fa-connection'
        },
        {
          name: 'Low-cost brandy, ',
          icon: 'fa-productsservices'
        },
        {
          name: 'Retail spot local products',
          icon: 'fa-space'
        }
      ]
    }
  ]
  addMarkers(prodServDummies)
}

function addWorkshopsCoursesMarkers () {
  var classesWorkshopDummies = [
    {
      name: 'Cultural Center',
      description: 'We are a community-driven space for local residents to give and take workshops and courses regarding the arts and social change ',
      phone: '123456789',
      mobile: '+1 901 23456789',
      email: 'test@mail.com',
      facebook: 'http://www.facebook.com/test',
      twitter: 'http://www.twitter.com/Test',
      address: 'Test st. #123, Test City, Test',
      projectType: {
        type: 'Citizen Initiative',
        color: '#C63D1E'
      },
      categories: [
        {
          name: 'workshopscourses',
          icon: 'fa-puzzle-piece'
        }
      ],
      needs: [
        {
          name: 'Yoga teacher',
          icon: 'fa-job'
        },
        {
          name: 'Available space for Sunday´s salsa lessons, ',
          icon: 'fa-space'
        },
        {
          name: 'Ceramic and spoons for innovative game',
          icon: 'fa-material'
        }
      ],
      offers: [
        {
          name: 'Workshop tools',
          icon: 'fa-material'
        },
        {
          name: 'Origami teacher, ',
          icon: 'fa-knowledge'
        },
        {
          name: 'Clown cloth',
          icon: 'fa-productsservices'
        },
        {
          name: 'Career opportunities for dancing enthusiasts',
          icon: 'fa-job'
        }
      ]
    }
  ]
  addMarkers(classesWorkshopDummies)
}

function addCommunityMarkers () {
  var communityDummies = [
    {
      name: 'Citizen Initiative  ABC',
      description: 'Group of local residents working together to better our neighbourhood ',
      phone: '123456789',
      mobile: '+1 901 23456789',
      email: 'test@mail.com',
      facebook: 'http://www.facebook.com/test',
      twitter: 'http://www.twitter.com/Test',
      address: 'Test st. #123, Test City, Test',
      projectType: {
        type: 'Citizen Initiative',
        color: '#C63D1E'
      },
      categories: [
        {
          name: 'community',
          icon: 'fa-users'
        }
      ],
      needs: [
        {
          name: 'Local organizations interested in local events',
          icon: 'fa-connection'
        },
        {
          name: 'Moderators for interfaith meetings',
          icon: 'fa-knowledge'
        },
        {
          name: 'Fertilizer for community garden',
          icon: 'fa-productsservices'
        }
      ],
      offers: [
        {
          name: 'Weekly workshop on community-building techniques',
          icon: 'fa-knowledge'
        },
        {
          name: 'Funds for local worker cooperatives',
          icon: 'fa-funding'
        },
        {
          name: 'Specialist in data analysis',
          icon: 'fa-job'
        },
        {
          name: 'Second-hand kitchen items',
          icon: 'fa-material'
        }
      ]
    }
  ]
  addMarkers(communityDummies)
}

function addCommunicationMarkers () {
  var comunicationDummies = [
    {
      name: 'Community Newspaper',
      description: 'Newspaper focused on community issues and public health ',
      phone: '123456789',
      mobile: '+1 901 23456789',
      email: 'test@mail.com',
      facebook: 'http://www.facebook.com/test',
      twitter: 'http://www.twitter.com/Test',
      address: 'Test st. #123, Test City, Test',
      projectType: {
        type: 'Startup',
        color: '#58376C'
      },
      categories: [
        {
          name: 'communication',
          icon: 'fa-bullhorn'
        }
      ],
      needs: [
        {
          name: 'Coffee',
          icon: 'fa-productsservices'
        },
        {
          name: 'Recycled paper for local newspaper',
          icon: 'fa-material'
        },
        {
          name: 'Web designer',
          icon: 'fa-job'
        },
        {
          name: 'Funds for indigenous radio event',
          icon: 'fa-funding'
        }
      ],
      offers: [
        {
          name: 'Available computers on the weekends',
          icon: 'fa-productsservices'
        },
        {
          name: 'Spots on radio program about health issues, ',
          icon: 'fa-knowledge'
        },
        {
          name: 'Photo collection of historical buildings for architectural research',
          icon: 'fa-camera-retro'
        },
        {
          name: 'Help with marketing',
          icon: 'fa-knowledge'
        }
      ]
    }
  ]
  addMarkers(comunicationDummies)
}

function addHumanRigthsMarkers () {
  var humanRightsDummies = [
    {
      name: 'Human rights association',
      description: 'Association of academics bored with academia and interested in human rights',
      phone: '123456789',
      mobile: '+1 901 23456789',
      email: 'test@mail.com',
      facebook: 'http://www.facebook.com/test',
      twitter: 'http://www.twitter.com/Test',
      address: 'Test st. #123, Test City, Test',
      projectType: {
        type: 'Collective',
        color: '#008B8B'
      },
      categories: [
        {
          name: 'humanrigths',
          icon: 'fa-globe'
        }
      ],
      needs: [
        {
          name: 'Chairs and tables for event',
          icon: 'fa-material'
        },
        {
          name: 'Help with grant-making procedures',
          icon: 'fa-knowledge'
        },
        {
          name: 'food and shelter for migrants',
          icon: 'fa-space'
        }
      ],
      offers: [
        {
          name: 'Research papers on Asian human rights defenders',
          icon: 'fa-productsservices'
        },
        {
          name: 'Workshop on children rights',
          icon: 'fa-knowledge'
        },
        {
          name: 'Help with project management',
          icon: 'fa-productsservices'
        },
        {
          name: 'Coffee machine',
          icon: 'fa-material'
        }
      ]
    }
  ]
  addMarkers(humanRightsDummies)
}

function addEnvironmentMarkers () {
  var enviromentalDummies = [
    {
      name: 'Environment project',
      description: 'Project working on the intersection between smart cities and sustainable practices',
      phone: '123456789',
      mobile: '+1 901 23456789',
      email: 'test@mail.com',
      facebook: 'http://www.facebook.com/test',
      twitter: 'http://www.twitter.com/Test',
      address: 'Test st. #123, Test City, Test',
      projectType: {
        type: 'NGO',
        color: '#556B2F'
      },
      categories: [
        {
          name: 'environment',
          icon: 'fa-pagelines'
        }
      ],
      needs: [
        {
          name: 'Books on rainforests',
          icon: 'fa-productsservices'
        },
        {
          name: 'Local pesticides',
          icon: 'fa-productsservices'
        },
        {
          name: 'Funds for river cleaning',
          icon: 'fa-funding'
        },
        {
          name: 'Chairs',
          icon: 'fa-material'
        }
      ],
      offers: [
        {
          name: 'Coworking space available on Wednesdays',
          icon: 'fa-space'
        },
        {
          name: 'Contact with organizations from the Southern region of the city',
          icon: 'fa-connection'
        },
        {
          name: 'Data on pollution levels',
          icon: 'fa-knowledge'
        }
      ]
    }
  ]
  addMarkers(enviromentalDummies)
}

function addTechnologyMarkers () {
  var technologyDummies = [
    {
      name: 'Open Source Collective',
      description: 'Helping social projects and elements of the solidarity economy to use open source technology for the common good',
      phone: '123456789',
      mobile: '+1 901 23456789',
      email: 'test@mail.com',
      facebook: 'http://www.facebook.com/test',
      twitter: 'http://www.twitter.com/Test',
      address: 'Test st. #123, Test City, Test',
      projectType: {
        type: 'Collective',
        color: '#008B8B'
      },
      categories: [
        {
          name: 'technology',
          icon: 'fa-cogs'
        }
      ],
      needs: [
        {
          name: 'Keyboards',
          icon: 'fa-material'
        },
        {
          name: 'Help translating French documents',
          icon: 'fa-knowledge'
        },
        {
          name: 'Advisor on open source technology',
          icon: 'fa-knowledge'
        }
      ],
      offers: [
        {
          name: 'Public library',
          icon: 'fa-space'
        },
        {
          name: 'Tech support',
          icon: 'fa-knowledge'
        },
        {
          name: 'Funds for tech non-for-profit projects',
          icon: 'fa-funding'
        },
        {
          name: 'Specialist on data mining',
          icon: 'fa-job'
        }
      ]
    }
  ]
  addMarkers(technologyDummies)
}

function addTransportationMarkers () {
  var transportDummies = [
    {
      name: 'Transportation Cooperative',
      description: 'Organizing public art collectives through events, research, and bike-repair workshops',
      phone: '123456789',
      mobile: '+1 901 23456789',
      email: 'test@mail.com',
      facebook: 'http://www.facebook.com/test',
      twitter: 'http://www.twitter.com/Test',
      address: 'Test st. #123, Test City, Test',
      projectType: {
        type: 'Cooperative',
        color: '#800000'
      },
      categories: [
        {
          name: 'transportation',
          icon: 'fa-bicycle'
        }
      ],
      needs: [
        {
          name: 'Painting for streets,',
          icon: 'fa-productsservices'
        },
        {
          name: 'Help with walkability project',
          icon: 'fa-knowledge'
        },
        {
          name: 'Volunteers for cycling awareness week',
          icon: 'fa-volunteer'
        },
        {
          name: 'Gallery space for next exhibition',
          icon: 'fa-space'
        }
      ],
      offers: [
        {
          name: 'Construction tools to borrow',
          icon: 'fa-material'
        },
        {
          name: 'Help revamping public spaces',
          icon: 'fa-volunteer'
        },
        {
          name: 'Contact with local authorities',
          icon: 'fa-connection'
        }
      ]
    }
  ]
  addMarkers(transportDummies)
}

function addGenderMarkers () {
  var genderDummies = [
    {
      name: 'Gender Civil Society Organization',
      description: 'We give courses on gender issues, promote gender-neutral taxonomies on science, and do events on gender inequality',
      phone: '123456789',
      mobile: '+1 901 23456789',
      email: 'test@mail.com',
      facebook: 'http://www.facebook.com/test',
      twitter: 'http://www.twitter.com/Test',
      address: 'Test st. #123, Test City, Test',
      projectType: {
        type: 'Citizen Initiative',
        color: '#C63D1E'
      },
      categories: [
        {
          name: 'gender',
          icon: 'fa-transgender-alt'
        }
      ],
      needs: [
        {
          name: 'Books on social movements, ',
          icon: 'fa-productsservices'
        },
        {
          name: 'Space for event on eco-feminism',
          icon: 'fa-space'
        },
        {
          name: 'Funds for next advocacy campaign',
          icon: 'fa-funding'
        },
        {
          name: 'Contact with local media',
          icon: 'fa-connection'
        }
      ],
      offers: [
        {
          name: 'Workshop on gender discrimination,',
          icon: 'fa-productsservices'
        },
        {
          name: 'Feminist artwork',
          icon: 'fa-knowledge'
        },
        {
          name: 'Books on governance within worker cooperatives',
          icon: 'fa-productsservices'
        },
        {
          name: 'Fair trade tacos with guacamole',
          icon: 'fa-productsservices'
        }
      ]
    }
  ]
  addMarkers(genderDummies)
}

function setSideMenuScrollFunc () {
  $('.sideMenuTab a[href*=#]').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
      && location.hostname == this.hostname) {
      var $target = $(this.hash)
      $target = $target.length && $target
      || $('[name=' + this.hash.slice(1) + ']')
      if ($target.length) {
        var targetOffset = $target.offset().top
        $('html,body').animate({scrollTop: targetOffset}, 1000)
        return false
      }
    }
  })
  $('.sideMenuTab').click(function (e) {
    var targetOffset = $($($(this).children()[0]).attr('href')).offset().top
    $('html,body').animate({scrollTop: targetOffset}, 1000)
  })
}

function addMap () {
  L.Map = L.Map.extend({
    openPopup: function (popup, latlng, options) {
      if (!(popup instanceof L.Popup)) {
        var content = popup

        popup = new L.Popup(options).setContent(content)
      }

      if (latlng) {
        popup.setLatLng(latlng)
      }

      if (this.hasLayer(popup)) {
        return this
      }

      // this.closePopup()
      this._popup = popup
      return this.addLayer(popup)
    }
  })
  map = L.map('map')
  console.log(map)
  map.setView([19.425, -99.135], 12)
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'ralexrdz.nnh64i75',
    accessToken: 'pk.eyJ1IjoicmFsZXhyZHoiLCJhIjoiY2lpZ2prZWV1MDJndXZ0bTFnMjlqNzNqciJ9.3oLuB9mb5jJlL5nYhlibZw'
  }).addTo(map)
  map.on('zoomend', popUpBehaviorByZoom)
}

function popUpBehaviorByZoom () {
  var zoom = map.getZoom()
  if (zoom < 14) {
    $('.markerPopUp').hide()
  } else {
    $('.markerPopUp').show()
    $('.markerPopUpName').show()
    if (zoom < 16) {
      $('.markerPopUpDescription').hide()
    } else {
      $('.markerPopUpDescription').show()
    }
  }
}

function setClosePopUpAction () {
  $('#registerPopUp').click(function () {$(this).find('.close')[0].click()})
  $('#loginPopUp').click(function () {$(this).find('.close')[0].click()})
}

function showMapSideBar (m) {
  console.log(m)
  $('#mapSideBar').find('#projectName').html(m.name)
  $('#mapSideBar').find('#projectDescription').html(m.description)
  $('#mapSideBar').find('#projectType').html(m.projectType.type)
  $('#mapSideBar').find('#projectType').css('background-color', m.projectType.color)
  $('#mapSideBar').find('#projectFacebook').attr('href', m.facebook)
  $('#mapSideBar').find('#projectTwitter').attr('href', m.twitter)
  $('#mapSideBar').find('#projectPhone').html(m.phone)
  $('#mapSideBar').find('#projectMobile').html(m.mobile)
  $('#mapSideBar').find('#projectEmail').html(m.email)
  $('#mapSideBar').find('#projectAddress').html(m.address)
  $('#mapSideBar').find('#projectOffers').html(createOffersMarkup(m.offers))
  $('#mapSideBar').find('#projectNeeds').html(createNeedsMarkup(m.needs))

  $('#mapSideBar').show()
  $('#mapSideBar').animate({width: '35%'})
}

function centerMapMyLocation (e) {
  navigator.geolocation.getCurrentPosition(setMapView)
}

function setMapView (location) {
  map.setView([location.coords.latitude, location.coords.longitude], 15)
}

function createOffersMarkup (offers) {
  var html = ''
  $.each(offers, function (i, offer) {
    html += '<div class="need"><i class="' + offer.icon + '"></i>' + offer.name + '</div>'
  })
  return html
}

function createNeedsMarkup (needs) {
  var html = ''
  $.each(needs, function (i, need) {
    html += '<div class="need"><i class="' + need.icon + '"></i>' + need.name + '</div>'
  })
  return html
}

function hideMapSideBar () {
  $('#mapSideBar').animate({width: '0px'}, function () {
    $('#mapSideBar').hide()
  })
}

function setCloseMapSideBarFunc () {
  $(document).mouseup(function (e) {
    var container = $('#mapSideBar:visible')
    if (container.is(':visible') && // has to be visible
      !container.is(e.target) // if the target of the click isn't the container...
      && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
      hideMapSideBar()
    }
  })
}

function setHoverCollaborationCategoryFunc () {
  $('.collaborationCategory').hover(
    function (e) {
      console.log('hover')
      console.log($(this).siblings('.collaborationSubCategory'))
      $(this).siblings('.collaborationSubCategory').css({opacity: 0, visibility: 'visible'}).animate({opacity: 1}, 800)
    },
    function (e) {
      console.log('no hover')
      console.log($(this).siblings('.collaborationSubCategory'))
      $(this).siblings('.collaborationSubCategory').css({opacity: 1, visibility: 'visible'}).animate({opacity: 0}, 800)
    }
  )
}
