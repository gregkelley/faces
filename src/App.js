import React, { Component, Fragment } from 'react';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import './App.css';

const app = new Clarifai.App({
  apiKey: 'ecbb37ac0bf74a87a87fb57c6d19cd51'
 });

const particleOptions = {
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 800
      }
    }  
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //     .then(response => response.json())
  //     .then(console.log);  // shorthand for: .then(data => console.log(data))
  // }

  // called by register screen. load the new user into the db.
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined //new Date()

    }})
  }

  calculateFaceLocation = (data) => {
    //console.log (data);
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    //console.log(clarifaiFace);
    const image = document.getElementById('inputimage');
    // const width = Number(image.offsetWidth);
    // const height = Number(image.offsetHeight);
    // const left = Number(image.offsetLeft);
    // const top = Number(image.offsetTop);
    // console.log(left, width, top, height);
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    //this.setState({box: box});
    this.setState({box});
    //console.log(box);
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
    //console.log(event.target.value);
  }

  // onButtonSubmit in instructor version
  onSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict( 
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
      .then(response => {
        if (response) {

          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id,
            })
          })
          .then(response => response.json())
          .then(count => {
            // if we try to just setState on the user, the whole object 
            // gets changed instead of just entries.
            // this.setState({user: {
            //   entries: count
            // }})
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
        }
        this.displayFaceBox( this.calculateFaceLocation(response))
      })
      .catch( err => console.log(err));
    }

  onRouteChange = (nroute) => {
    if (nroute === 'signout') {
      this.setState({isSignedIn: false});
    } else if (nroute === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: nroute});
  }

  render() {
    // destructuring within this block, so don't have to map variables with this. keyword
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particleOptions} />

        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        
        { route === 'home' 
          ? 
            <Fragment>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onSubmit={this.onSubmit} 
                />
              
              <FaceRecognition imageUrl={imageUrl} box={box} />
            </Fragment>
          : (
              this.state.route === 'signin' 
              ?  <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              :  <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
}}

export default App;
