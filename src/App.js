import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './Component/FaceRecognition/FaceRecognition';
import Navigation from './Component/Navigation/Navigation';
import SignIn from './Component/SignIn/SignIn';
import Register from './Component/Register/Register';
import Logo from './Component/Logo/Logo';
import ImageLinkForm from './Component/ImageLinkForm/ImageLinkForm';
import Rank from './Component/Rank/Rank';
import './App.css';




//You must add your own API key here from Clarifai.




const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}
const initialState = {
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

class App extends Component {
  constructor() {
    super();
    this.state = initialState
    
  }


  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
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
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }
  // onkeyPress = ()=> {
  //   this.setState({imageUrl: this.state.input}) 
  //   window.addEventListener("keypress", (event)=>{
  //     // if(event.keyCode === 13) {
  //       console.log('hi')
  //       app.models
  //       .predict(
  //         Clarifai.FACE_DETECT_MODEL,
  //         this.state.input)
  //       .then(response => {
  //         if (response) {
  //           fetch('http://localhost:3000/image', {
  //             method: 'put',
  //             headers: { 'Content-Type': 'application/json' },
  //             body: JSON.stringify({
  //               id: this.state.user.id
  //             })
  //           })
  //             .then(response => response.json())
  //             .then(count => {
  //               this.setState(Object.assign(this.state.user, { entries: count }))
  //             })
  
  //         }
  //         this.displayFaceBox(this.calculateFaceLocation(response))
  //       })
  //       .catch(err => console.log(err));
      
  //   })
  // }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch('https://ubiquitous-rugelach-506407.netlify.app//imageUrl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    }).then(data => {
      return data.json()
    })
      .then(response => {
        if (response) {
          fetch('https://ubiquitous-rugelach-506407.netlify.app//image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home'
          ? <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
              onkeyPress = {this.onkeyPress}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
          : (
            route === 'signin'
              ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;