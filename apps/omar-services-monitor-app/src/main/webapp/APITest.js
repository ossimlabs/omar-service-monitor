import React, {Component} from 'react'
import ReactDOM, { render } from 'react-dom'

class APITest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        }
    }

componentDidMount() {
    fetch('https://jenkins.ossim.io/api/json', {
        method: 'GET',
        mode: 'no-cors',
        headers: {
            ContentType: 'application/x-www-form-url-encoded',
            Username: ''
        }
    })
        .then(response => response.json())
        .then(
        (result) => {
            this.setState({
            isLoaded: true,
            items: result.items
            });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
            this.setState({
            isLoaded: true,
            error
            });
        })
}

render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.name}>
              {item.name} {item.price}
            </li>
          ))}
        </ul>
      );
    }
  }
}

export default APITest