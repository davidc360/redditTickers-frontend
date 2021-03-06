import logo from './logo.svg';
import './App.css';

import Nav from './components/Nav'
import About from './components/About'
import Home from './components/TIckers'
import Contact from './components/Contact'

import { BrowserRouter, Route, Switch, useParams } from 'react-router-dom'

function App() {
    return (
        <BrowserRouter>
                <div className="App">
                <Nav />
                <Switch>    
                    <Route exact path='/' component={Home} />
                    <Route path='/about' component={About} />
                    <Route path='/contact' component={Contact} />
                   
                    <Route path='*' component={()=>(<div>Oh no!!!! Page not found.</div>)} />
                </Switch>
                </div>
        </BrowserRouter>
    );
}

export default App;
