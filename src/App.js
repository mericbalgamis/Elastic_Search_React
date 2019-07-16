import React, { Component } from "react";
import './App.css';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import Panel from 'muicss/lib/react/panel';
import DynamicForm from './components/dynamicForm/dynamicForm';
import myJson from './datatypes.json';
import txt from './datatypes.txt';
import json from './config/simple.json';


var formJson = {
  "name": "ABCz Form",
  "fields": []
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {form: formJson};

  };


submitHandler = (event) => {
  let json = JSON.stringify(event, null, 4);
  console.log(json);
}

componentWillMount() {

  fetch(txt)
    .then((r) => r.text())
    .then(text => {
      let myarray = text.split('\n');

      myarray.map((element, i) => {

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

          data = {
            "id": name,
            "label": name,
            "description": "",
            "type": type,
            "value": "",
            "required": "false",
            "placeholder": "",
            "definition": optionData.options
          };
        }

        else if (array.length === 3) {
          let name = array[0];
          name = name.replace(/_/g, ' ');
          let type = array[1];

          data = {
            "id": name,
            "label": name,
            "description": "",
            "type": type,
            "value": "",
            "required": "false",
            "placeholder": ""
          };
        }

        console.log(json)
        this.setState({form : this.state.form.fields.push(data)});
        //console.log(formJson);

      })

      //this.setState({form : formJson});
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
          <Panel>
            {"sdknsdjsk"}
          </Panel>
        </div>
      </SplitterLayout>

    </div>
  );
}
}

export default App;
