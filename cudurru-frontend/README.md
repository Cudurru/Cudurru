# Cudurru Front-end

## Getting started

Install Yarn: https://classic.yarnpkg.com/en/docs/install/

Start Vagrant:

vagrant up
vagrant provision

Install Project:

`$ yarn install

Start the development server:

`$ yarn dev

## Useful packages

* [babel-plugin-module-resolver](https://github.com/tleunen/babel-plugin-module-resolver): this plugin simplify the import path in your project.
```javascript
// Use this:
import dog from "@images/dog.jpg";
// Instead of that:
import dog from "../../../images/dog.jpg"
```
You just need to add an alias in `.babelrc`:
```
 [
   "module-resolver",
      {
        "root": ["./src"],
        "alias": {
          "@images": "./assets/images"
        }
      }
  ]
```

* [@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html): this plugin let you use class properties.

Without class properties:
```javascript
class Button extends Component {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick() {
    this.setState({ clicked: true });
  }
  
  render() {
    return <button onClick={this.handleClick}>Click Me!</button>;
  }
}
```
With class properties and arrow function, there is no need to bind `this` and the code is shorter:
```javascript
class Button extends Component {
  state = { clicked: false };
  
  handleClick = () => this.setState({ clicked: true });
  
  render() {
    return <button onClick={this.handleClick}>Click Me!</button>;
  }
}
```
