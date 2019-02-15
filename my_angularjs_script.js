
var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/:post", {
        templateUrl: function(params){return 'Posts/' + params.post +'.html';},
        controller : "postController",
    }).
    otherwise({
      redirectTo: '/'
    });
});

var viewCtrl =  app.controller("postController", function ($scope,$route,$routeParams) {
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]); // redo mathjax typesetting
  // gtag('event', 'postClicked', {'postID': $routeParams.post,'value':$routeParams.post});
  gtag('config', 'UA-125128411-1', {'page_path': 'Posts/' + $routeParams.post +'.html'});
});


var mainCtrl = app.controller("mainCtrl", function ($scope) {
  $scope.languages = {
    "norwegian": {
      name: 'Norwegian',
      checkedDoc:   true,
      checkedPost:  true
    },
    "english": {
      name: 'English',
      checkedDoc:   true,
      checkedPost:  true
    }
  };
  $scope.tags = {
      "math": {
      name: 'Mathematics',
      indicator: "math",
      checkedAnim:  true,
      checkedDoc:   true,
      checkedPost:  true},
      "phys": {
      name: 'Physics',
      indicator: "phys",
      checkedAnim:  true,
      checkedDoc:   true,
      checkedPost:  true},
      "prog": {
      name: 'Programming',
      indicator: "prog",
      checkedAnim:  true,
      checkedDoc:   true,
      checkedPost:  true},
      "other": {
      name: 'Other',
      indicator: "other",
      checkedAnim:  true,
      checkedDoc:   true,
      checkedPost:  true}
  };

  $scope.postItems = [
    {
      name: 'Brachistochroneproblemet',
      description: "This is a post about the famous Brachistochrone problem which introduced variational calculus. This includes a simple physics question -- what is the trajectory that makes a ball roll fastest from one point to another? We take a look at Newton's ingenious solution to this problem.",
      reference: "Brachistochroneproblemet",
      tag: $scope.tags["phys"],
      language: $scope.languages["norwegian"]},
    {
      name: 'Baselproblemet',
      description: "A text on the solution of the famous 'Basel Problem'.",
      reference: "Baselproblemet",
      tag: $scope.tags["math"],
      language: $scope.languages["norwegian"]},
    {
      name: 'Fluid Mechanics',
      description: "Text on basic equations in fluid dynamics.",
      reference: "FluidMechanics",
      tag: $scope.tags["phys"],
      language: $scope.languages["english"]},
    {
      name: 'Quaternioic Babbling',
      description: "A text exploring the history and algebra of the Quaternions.",
      reference: "Quaternions",
      tag: $scope.tags["math"],
      language: $scope.languages["english"]},
    {
      name: 'Test post',
      description: "This is just a post to test functionality of the web page.",
      reference: "FirstPost",
      tag: $scope.tags["prog"],
      language: $scope.languages["english"]}
    ];


    $scope.docItems = [
      {
        name: 'Linearized gravity',
        description: "Notes on linear perturbations of Minkowskian spacetime and gravitational waves.",
        reference: "Linearized gravity.pdf",
        tag: $scope.tags["phys"],
        language: $scope.languages["english"]},
      {
        name: 'Advanced Quantum Field theory',
        description: 'A brief and incomplete introduction to quantum field theory.',
        reference: 'Advanced Quantum Field theory.pdf',
        tag: $scope.tags["phys"],
        language: $scope.languages["english"]},
      {
        name: 'Atomic modelling of Argon lattice',
        description: 'A project in Computational physics about simulating thermodynamic properties of a FCC crystal of argon atoms.',
        reference: 'Atomic modelling of Argon lattice.pdf',
        tag: $scope.tags["prog"],
        language: $scope.languages["english"]},
      {
        name: 'Classical Mechanics and Minimal Action',
        description: 'Brief and incomplete notes on Classical Mechanics.',
        reference: 'Classical Mechanics and Minimal Action.pdf',
        tag: $scope.tags["phys"],
        language: $scope.languages["english"]},
      {
        name: 'En hyllest til Euklid.pdf',
        description: "A text on proposisjon 35 in book III of Euclid's Elements with some notes on the modern onderstanding of the statement.",
        reference: 'En hyllest til Euklid.pdf',
        tag: $scope.tags["math"],
        language: $scope.languages["norwegian"]},
      {
        name: 'Felttur i elektromagnetisme 2017',
        description: 'Notes for lectures held on a field trip in an introductory course on Electromagnetism.',
        reference: 'Felttur i elektromagnetisme 2017.pdf',
        tag: $scope.tags["phys"],
        language: $scope.languages["norwegian"]},
      {
        name: 'Spinntur',
        description: 'Notes for lectures held on a field trip about Angular Momentum.',
        reference: 'Spinntur.pdf',
        tag: $scope.tags["phys"],
        language: $scope.languages["norwegian"]},
      {
        name: 'The Faddeev-Popov process',
        description: 'Notes on the so-called Faddeev-Popov process that enables calculation of a non-divergent expression for the photon propagator.',
        reference: 'The Faddeev-Popov process.pdf',
        tag: $scope.tags["phys"],
        language: $scope.languages["english"]},
      {
        name: 'The Schwinger-Dyson equations',
        description: 'Notes on the Schwinger-Dyson equations that serve as a quantum analogue of the equations of motion.',
        reference: 'The Schwinger-Dyson equations.pdf',
        tag: $scope.tags["phys"],
        language: $scope.languages["english"]}
      ];


      $scope.animItems = [
        {
          name: 'Black Hole Raytracing',
          description: 'A very simple raytracing simulation of a black hole attached to the mouse lensing a star in the Andromeda galaxy.',
          reference: 'Black Hole Raytracing/',
          tag: $scope.tags["phys"]
        },{
          name: 'Chaos fractal generator',
          description: 'A visualization of how pretty fractals can emerge from probabilistic processes.',
          reference: 'Chaos fractal generator/',
          tag: $scope.tags["math"]
        },{
          name: 'Double Pendulum',
          description: 'A simple visualization of a double pendulum.',
          reference: 'Double Pendulum/',
          tag: $scope.tags["phys"]
        },{
          name: 'Elastic collisions',
          description: 'Visualization of the physics of elastic collisions.',
          reference: 'Elastic collisions/',
          tag: $scope.tags["phys"]
        },{
          name: 'Feigenbaum',
          description: 'Visualization of how chaos emerges from applying simple functions repeatedly.',
          reference: 'Feigenbaum/',
          tag: $scope.tags["math"]
        },{
          name: 'Interactive Fractals',
          description: 'Some famous fractals and sliders and knobs for controlling them.',
          reference: 'Interactive Fractals/',
          tag: $scope.tags["math"]
        },{
          name: 'Ising model',
          description: "A real-time visualization of the Ising model for a two-dimensional grid of half-integer spin particles. You can control inverse temperature to discover the ferromagnetic phase transition.",
          reference: 'Ising model/',
          tag: $scope.tags["phys"]
        },{
          name: 'Lennard Jones force networks',
          description: 'Just a silly simulation of particles interacting via the Lennard Jones potential.',
          reference: 'Lennard Jones force networks/',
          tag: $scope.tags["phys"]
        },{
          name: 'The Wave Equation',
          description: 'Real-time simulation of the wave equation with custom barriers and damping.',
          reference: 'The Wave Equation/',
          tag: $scope.tags["phys"]
        },{
          name: 'Planetary',
          description: 'Simulation of planets (or circles if you want) that interact gravitationally and merge conserving mass (area), momentum and center of mass.',
          reference: 'Planetary/',
          tag: $scope.tags["phys"]
        },{
          name: 'Rainbow',
          description: 'A devoted rendering of how rays refracts and reflects through a drop of water.',
          reference: 'Rainbow/',
          tag: $scope.tags["phys"]
        },{
          name: "Evolution",
          description: "This is an extensive, but basic experiment with reinforcement learning. Digital 'Animals' spawn with random DNA and blank brains. With mutating the neural network for every new boid, they gradually evolve to handle the environment better. There are three views: The simulator itself, a visualization of the 'best' boid and a control panel where environment and mutation properties can be altered. Have fun!",
          reference: "Evolution/",
          tag: $scope.tags["other"]
        },
        {
          name: "Complex Mappings",
          description: "This is a simple visualization of Complex mappings. That is, it parametrizes and animates the effect of complex mappings on a cartesian grid on C.",
          reference: "Complex Mappings/",
          tag: $scope.tags["math"]
        },
        {
          name: "Wallpaper Groups",
          description: "This is a simple rendering of the first wallpaper groups. It allows you to draw them in a way such that the symmetries are enforced.",
          reference: "wallpaperGroups",
          tag: $scope.tags["math"]
        }
      ];
});
