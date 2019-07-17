import React, { Component } from "react";
import './App.css';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import Panel from 'muicss/lib/react/panel';
import DynamicForm from './components/dynamicForm/dynamicForm';
import myJson from './datatypes.json';
import txt from './datatypes.txt';
import json from './config/simple.json';
import axios from 'axios';
import JSONPretty from 'react-json-prettify';
import { github } from 'react-json-prettify/dist/themes';



var formJson = {
  "name": "ABCz Form",
  "fields": []
};

class App extends Component {

  constructor(props) {

    super(props);
    this.state = {

      form: formJson,
      response: ''
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    axios.get()
      .then(res => {
        this.setState({
          todo: res.data
        })
      })
  }

  sendRequest() {
    //console.log("handleclick")
    var panel = document.getElementById("resultPanel");
    axios.get('http://127.0.0.1:5000/query')
      .then(response => {
        //console.log(response);
        this.setState({
          response: response.data
        })
        //panel.innerHTML=response.data; 
      });
  }

  generateQuery = (formResults) => {
    console.log(formResults)
  }

  submitHandler = (event) => {
    let json = JSON.stringify(event, null, 4);
    this.generateQuery(json);
    this.sendRequest();
    //console.log(json);
  }

  componentWillMount() {

    fetch(txt)
      .then((r) => r.text())
      .then(text => {
        let myarray = text.split('\n');
        let dataArray = myarray.map((element, i) => {


          var array = element.split(' ');

          if (array.length === 4) {

            let name = array[0];
            name = name.replace(/_/g, ' ');
            let type = array[1];
            let options = array[2];
            options = options.replace(/\)/g, '');
            options = options.replace(/\(/g, '');
            let optionsArray = options.split(',');

            var optionData = { "options": [] };
            var data = {};
            optionsArray.map((option, i) => {
              optionData.options.push({ "display": option });
            })

            return {
              "id": name,
              "label": name,
              "description": "",
              "type": type,
              "value": "",
              "required": "false",
              "placeholder": "",
              "definition": optionData
            };
            console.log(data)

          }

          else if (array.length === 3) {
            let name = array[0];
            name = name.replace(/_/g, ' ');
            let type = array[1];

            return {
              "id": name,
              "label": name,
              "description": "",
              "type": type,
              "value": "",
              "required": "false",
              "placeholder": ""
            };
          }

        })

        this.setState({
          form: {
            fields: dataArray
          }
        });
        console.log(dataArray);

      })
  }

  render() {
    return (
      <div className="App">

        <SplitterLayout>
          <div>Build a Query !
            <DynamicForm id="form" config={this.state.form} onSubmit={(event) => this.submitHandler(event)}></DynamicForm>

          </div>


          <div>
            <Panel id="resultPanel"><JSONPretty json={this.state.response} theme={github} /></Panel>
          </div>
        </SplitterLayout>

      </div>
    );
  }
}

export default App;
