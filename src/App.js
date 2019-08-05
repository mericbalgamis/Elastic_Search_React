import React, { Component } from "react";
import './App.css';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import Panel from 'muicss/lib/react/panel';
import DynamicForm from './components/dynamicForm/dynamicForm';
import myJson from './datatypes.json';
import txt from './datatypes.txt';
import txt_output from './datatypes_output.txt';
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

  sendRequest(requestBody) {
    //console.log("handleclick")
    var panel = document.getElementById("resultPanel");
    console.log("requestBody: " + requestBody)
    fetch('http://127.0.0.1:5000/query', {
      method: "POST",//Request Type 
      body: requestBody,//post body 
      headers: {//Header Defination 
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        alert(JSON.stringify(responseJson));
        console.log(responseJson);
        panel.value = responseJson;
      })
      //If response is not in json then in error 
      .catch((error) => {
        alert(JSON.stringify(error));
        //console.error(error);
      });


  }

  submitHandler = (event) => {
    let json = JSON.stringify(event, null, 4);
    this.generateQuery(json);
    //console.log(json);
  }

  generateQuery = (formResults) => {

    var form = JSON.parse(formResults);
    
    // Bool query
    const requestBody = queryBuilder.requestBodySearch().query(
      queryBuilder.boolQuery()
        .must(queryBuilder.matchQuery("studies.DCMs." + form.data[0].name.replace(/ /g, '_') + ".Value", form.data[0].value))
        .filter(queryBuilder.rangeQuery("studies.DCMs." + form.data[1].name.replace(/ /g, '_') + ".Value").gt(form.data[1].value).lte(form.data[2].value))
        .filter(queryBuilder.rangeQuery("studies.DCMs." + form.data[3].name.replace(/ /g, '_') + ".Value").gt(form.data[3].value).lte(form.data[4].value))
        .must(queryBuilder.matchQuery("studies.DCMs." + form.data[5].name.replace(/ /g, '_') + ".Value", form.data[5].value))
        .must(queryBuilder.matchQuery("studies.DCMs." + form.data[6].name.replace(/ /g, '_') + ".Value", form.data[6].value))
        .filter(queryBuilder.rangeQuery("studies.DCMs." + form.data[7].name.replace(/ /g, '_') + ".Value").gt(form.data[7].value).lte(form.data[8].value))
        .filter(queryBuilder.rangeQuery("studies.DCMs." + form.data[9].name.replace(/ /g, '_') + ".Value").gt(form.data[9].value).lte(form.data[10].value))
        .filter(queryBuilder.rangeQuery("studies.DCMs." + form.data[11].name.replace(/ /g, '_') + ".Value").gt(form.data[11].value).lte(form.data[12].value))
        .filter(queryBuilder.rangeQuery("studies.DCMs." + form.data[13].name.replace(/ /g, '_') + ".Value").gt(form.data[13].value).lte(form.data[14].value))
        .must(queryBuilder.matchQuery("studies.DCMs." + form.data[15].name.replace(/ /g, '_') + ".Value", form.data[15].value))
    );

    console.log(form)

    for (var i = 0; i <= form.data.length-1; i++) {

      if(i != form.data.length-1 && form.data[i].name == form.data[i+1].name){
        if(form.data[i].value == ""){
          requestBody._body.query._body.bool.filter.splice(i,1)
        }
        i++;
      }
      else if(i == form.data.length){
        if(form.data[i].value == "")
          requestBody._body.query._body.bool.must.splice(i, 1);
      }
      else{
        if(form.data[i].value == "")
          requestBody._body.query._body.bool.must.splice(i, 1);
      }
    }

    // formu gezerek boş olan alanları request body den çıkarmak gerekiyor.

    /*
  // Bool query
  const requestBody = queryBuilder.requestBodySearch().query(
    queryBuilder.boolQuery()
      .must(queryBuilder.matchQuery("DCMs."+form.data[0].name.replace(/ /g, '_')+".Value", form.data[0].value))
      .must(queryBuilder.matchQuery("DCMs."+form.data[1].name.replace(/ /g, '_')+".Value", form.data[1].value))
      .must(queryBuilder.matchQuery("DCMs."+form.data[2].name.replace(/ /g, '_')+".Value", form.data[2].value))
      .must(queryBuilder.matchQuery("DCMs."+form.data[3].name.replace(/ /g, '_')+".Value", form.data[3].value))
      .must(queryBuilder.matchQuery("DCMs."+form.data[4].name.replace(/ /g, '_')+".Value", form.data[4].value))
  );
    console.log(requestBody.toJSON())
    for (var i = form.data.length - 1; i >= 0; i--) {
      if (form.data[i].value == "" && ) {
        //console.log(i)
        requestBody._body.query._body.bool.must.splice(i, 1);
        //console.log(query)
      }
    }*/

    console.log(requestBody)
    this.sendRequest(JSON.stringify(requestBody));


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
    }
    
    // Multi Match Query
    requestBody = queryBuilder.requestBodySearch().query(
      queryBuilder.multiMatchQuery(['title', 'body'], 'Quick brown fox')
        .type('best_fields')
        .tieBreaker(0.3)
        .minimumShouldMatch('30%')
    );
    
    requestBody.toJSON();
    {
      "multi_match": {
        "query": "Quick brown fox",
        "type": "best_fields",
        "fields": ["title", "body"],
        "tie_breaker": 0.3,
        "minimum_should_match": "30%"
      }
    }
    
    // Aggregation
    requestBody = queryBuilder.requestBodySearch()
      .size(0)
      .agg(queryBuilder.termsAggregation('popular_colors', 'color'));
    
      
    requestBody.toJSON();
    {
      "size": 0,
      "aggs": {
        "popular_colors": {
          "terms": { "field": "color" }
        }
      }
    }
    
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
    }
    */


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
