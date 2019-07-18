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
import queryBuilder from 'elastic-builder';

//const elasticsearch = require('elastic-search');
//const esb = require('elastic-builder');


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
    var form = JSON.parse(formResults);
    //console.log(form.data[0].name)
    //console.log(form.data[0].value)

    // Bool query
    const requestBody = queryBuilder.requestBodySearch().query(
      queryBuilder.boolQuery()
        .must(queryBuilder.matchQuery('last_name', 'smith'))
        .filter(queryBuilder.rangeQuery('age').gt(30))
    );
    let json = JSON.stringify(requestBody, null, 4);

      console.log(json)

    /*
    requestBody.toJSON();

  "query": {
    "bool": {
      "must": {
        "match": { "last_name": "smith" }
      },
      "filter": {
        "range": { "age": { "gt": 30 } }
      }
    }
  }
}*/

// Multi Match Query
requestBody = queryBuilder.requestBodySearch().query(
  queryBuilder.multiMatchQuery(['title', 'body'], 'Quick brown fox')
    .type('best_fields')
    .tieBreaker(0.3)
    .minimumShouldMatch('30%')
);
/*
requestBody.toJSON();
{
  "multi_match": {
    "query": "Quick brown fox",
    "type": "best_fields",
    "fields": ["title", "body"],
    "tie_breaker": 0.3,
    "minimum_should_match": "30%"
  }
}*/

// Aggregation
requestBody = queryBuilder.requestBodySearch()
  .size(0)
  .agg(queryBuilder.termsAggregation('popular_colors', 'color'));

  /*
requestBody.toJSON();
{
  "size": 0,
  "aggs": {
    "popular_colors": {
      "terms": { "field": "color" }
    }
  }
}*/

// Sort
requestBody = queryBuilder.requestBodySearch()
  .query(queryBuilder.boolQuery().filter(queryBuilder.termQuery('message', 'test')))
  .sort(queryBuilder.sort('timestamp', 'desc'))
  .sorts([
    queryBuilder.sort('channel', 'desc'),
    queryBuilder.sort('categories', 'desc'),
    // The order defaults to desc when sorting on the _score,
    // and defaults to asc when sorting on anything else.
    queryBuilder.sort('content'),
    queryBuilder.sort('price').order('desc').mode('avg')
  ]);

  /*
requestBody.toJSON();
{
  "query": {
    "bool": {
      "filter": {
        "term": { "message": "test" }
      }
    }
  },
  "sort": [
    { "timestamp": { "order": "desc" } },
    { "channel": { "order": "desc" } },
    { "categories": { "order": "desc" } },
    "content",
    { "price": { "order": "desc", "mode": "avg" } }
  ]
}*/


    this.sendRequest();

  }

  submitHandler = (event) => {
    let json = JSON.stringify(event, null, 4);
    this.generateQuery(json);
    console.log(json);
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
