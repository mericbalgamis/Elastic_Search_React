import React, { Component } from "react";
import './App.css';
import SplitterLayout from 'react-splitter-layout';
import CsvDownload from 'react-json-to-csv'
import 'react-splitter-layout/lib/index.css';
import Panel from 'muicss/lib/react/panel';
import DynamicForm from './components/dynamicForm/dynamicForm';
import myJson from './datatypes.json';
import txt_input from './datatypes.txt';
import txt_output from './datatypes_output.txt';
import json from './config/simple.json';
import axios from 'axios';
import { CSVLink } from "react-csv";
import JSONPretty from 'react-json-pretty';
import { github } from 'react-json-pretty/themes/monikai.css';
import queryBuilder, { filtersAggregation } from 'elastic-builder';
import Papa from  'papaparse';
import { iif } from "rxjs";

const form_type = "output";
const output_query =
{
  "aggregations": {
    "average_echo_time": {
      "avg": {
        "field": "DCMs.Echo_Time.Value"
      }
    },
    "minimum_echo_time": {
      "min": {
        "field": "DCMs.Echo_Time.Value"
      }
    },
    "maximum_echo_time": {
      "max": {
        "field": "DCMs.Echo_Time.Value"
      }
    },
    "max_repetition_time": {
      "max": {
        "field": "DCMs.Repetition_Time.Value"
      }
    },
    "min_repetition_time": {
      "min": {
        "field": "DCMs.Repetition_Time.Value"
      }
    },
    "average_repetition_time": {
      "avg": {
        "field": "DCMs.Repetition_Time.Value"
      }
    },
    "max_slice_thickness": {
      "max": {
        "field": "DCMs.Slice_Thickness.Value"
      }
    },
    "min_slice_thickness": {
      "min": {
        "field": "DCMs.Slice_Thickness.Value"
      }
    },
    "average_slice_thickness": {
      "avg": {
        "field": "DCMs.Slice_Thickness.Value"
      }
    },
    "average_slab_thickness": {
      "avg": {
        "field": "DCMs.MR_Spatial_Saturation_Sequence.Slab_Thickness.Value"
      }
    },
    "max_age": {
      "max": {
        "field": "DCMs.AGE.Value"
      }
    },
    "min_age": {
      "min": {
        "field": "DCMs.AGE.Value"
      }
    },
    "average_age": {
      "avg": {
        "field": "DCMs.AGE.Value"
      }
    },
    "max_flip_angle": {
      "max": {
        "field": "DCMs.Flip_Angle.Value"
      }
    },
    "min_flip_angle": {
      "min": {
        "field": "DCMs.Flip_Angle.Value"
      }
    },
    "average_flip_angle": {
      "avg": {
        "field": "DCMs.Flip_Angle.Value"
      }
    },
    "max_SAR": {
      "max": {
        "field": "DCMs.SAR.Value"
      }
    },
    "min_SAR": {
      "min": {
        "field": "DCMs.SAR.Value"
      }
    },
    "average_SAR": {
      "avg": {
        "field": "DCMs.SAR.Value"
      }
    },
    "max_Number_of_Averages": {
      "max": {
        "field": "DCMs.Number_of_Averages.Value"
      }
    },
    "min_Number_of_Averages": {
      "min": {
        "field": "DCMs.Number_of_Averages.Value"
      }
    },
    "average_Number_of_Averages": {
      "avg": {
        "field": "DCMs.Number_of_Averages.Value"
      }
    }
  }
};

var fileDownload = require('react-file-download');
var formJson = {
  "name": "ABCz Form",
  "fields": []
};

class App extends Component {

  constructor(props) {

    super(props);
    this.state = {

      form: formJson,
      response: 'jghf'
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
        //alert(JSON.stringify(responseJson));
        console.log(responseJson);
        const json = JSON.stringify(responseJson, null, 4)


        this.setState({

          response: json

        });
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


  handleDownload = () => {
    fileDownload(this.state.response, 'response.json');
  }

  handleCSV = () => {
    var csv = Papa.unparse(output_query);
    console.log(csv)
  }

  removeEmptyFields = (requestBody, name, field) => {
    if (field == "filter") {
      for (var i = 0; i < requestBody._body.query._body.bool.filter.length; i++) {

        if (requestBody._body.query._body.bool.filter[i]._field.includes(name.replace(/ /g, '_'))) {
          requestBody._body.query._body.bool.filter.splice(i, 1)

        }
      }


    }
    else if (field == "must") {
      for (var i = 0; i < requestBody._body.query._body.bool.must.length; i++) {
        if (requestBody._body.query._body.bool.must[i]._field.includes(name.replace(/ /g, '_'))) {
          requestBody._body.query._body.bool.must.splice(i, 1)

        }
      }
      return requestBody;

    }

  }

  generateQuery = (formResults) => {

    var form = JSON.parse(formResults);
    let requestBodyUpdated;

    if (form_type == "input") {

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

      for (var i = 0; i <= form.data.length - 1; i++) {
        console.log("girdi")
        if (i != form.data.length - 1 && form.data[i].name == form.data[i + 1].name) {
          if (form.data[i].value == "") {
            requestBodyUpdated = this.removeEmptyFields(requestBody, form.data[i].name, "filter")
          }
          i++;
        }
        else if (i == form.data.length) {
          if (form.data[i].value == "") {
            requestBodyUpdated = this.removeEmptyFields(requestBody, form.data[i].name, "must")
          }
        }
        else {
          if (form.data[i].value == "") {
            requestBodyUpdated = this.removeEmptyFields(requestBody, form.data[i].name, "must")

          }
        }
      }

      if (requestBody._body.query._body.bool.must.length > 0) {
        for (var i = 0; i < requestBody._body.query._body.bool.must.length; i++) {

          if (requestBody._body.query._body.bool.must[i]._field.includes("Image_Type")) {
            requestBody._body.query._body.bool.must.splice(i, 1)

          }
        }
      }

      if (requestBody._body.query._body.bool.filter.length == 0) {
        delete requestBody._body.query._body.bool.filter;
      }

      if (requestBody._body.query._body.bool.must.length == 0) {
        delete requestBody._body.query._body.bool.must;
      }

      if (requestBody._body.query._body.bool.filter.length != 0) {

        for (var i = 0; i < requestBody._body.query._body.bool.filter.length; i++) {

          if (requestBody._body.query._body.bool.filter[i]._field.includes("Instance_Creation_Time")) {
            let time_gt = requestBody._body.query._body.bool.filter[i]._queryOpts.gt;
            let time_lte = requestBody._body.query._body.bool.filter[i]._queryOpts.lte;

            time_gt = time_gt.replace(":", "");
            time_lte = time_lte.replace(":", "");

            time_gt = time_gt + "00.000";
            time_lte = time_lte + "00.000";

            requestBody._body.query._body.bool.filter[i]._queryOpts.gt = time_gt;
            requestBody._body.query._body.bool.filter[i]._queryOpts.lte = time_lte;

          }

          if (requestBody._body.query._body.bool.filter[i]._field.includes("Study_Time")) {
            let time_gt = requestBody._body.query._body.bool.filter[i]._queryOpts.gt;
            let time_lte = requestBody._body.query._body.bool.filter[i]._queryOpts.lte;

            time_gt = time_gt.replace(":", "");
            time_lte = time_lte.replace(":", "");

            time_gt = time_gt + "00.000";
            time_lte = time_lte + "00.000";

            requestBody._body.query._body.bool.filter[i]._queryOpts.gt = time_gt;
            requestBody._body.query._body.bool.filter[i]._queryOpts.lte = time_lte;


          }
        }
      }

      requestBodyUpdated = requestBody;
      console.log(requestBody)
      //this.sendRequest(JSON.stringify(requestBodyUpdated));
    }
    else if (form_type == "output") {

      // Bool query
      const requestBody = queryBuilder.requestBodySearch().query(
        queryBuilder.boolQuery()
          .must(queryBuilder.matchQuery("DCMs." + form.data[0].name.replace(/ /g, '_') + ".Value", form.data[0].value))
          .must(queryBuilder.matchQuery("DCMs." + form.data[1].name.replace(/ /g, '_') + ".Value", form.data[1].value))
          .must(queryBuilder.matchQuery("DCMs." + form.data[2].name.replace(/ /g, '_') + ".Value", form.data[2].value))
          .must(queryBuilder.matchQuery("DCMs." + form.data[3].name.replace(/ /g, '_') + ".Value", form.data[3].value))
          .must(queryBuilder.matchQuery("DCMs." + form.data[4].name.replace(/ /g, '_') + ".Value", form.data[4].value))
      );

      console.log(requestBody.toJSON())
      for (var i = form.data.length - 1; i >= 0; i--) {
        if (form.data[i].value == "") {
          requestBody._body.query._body.bool.must.splice(i, 1);
        }
      }

      let str_requestBody = (JSON.stringify(requestBody));
      str_requestBody = str_requestBody.substring(0, str_requestBody.length - 1);
      let str_output_query = JSON.stringify(output_query);
      str_output_query = str_output_query.substring(1, str_output_query.length);
      str_requestBody = str_requestBody + "," + str_output_query;

      this.sendRequest(str_requestBody);
    }

  }

  componentWillMount() {
    if (form_type == "input") {

      fetch(txt_input)
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
    else if (form_type == "output") {


      fetch(txt_output)
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
  }

  render() {
    return (
      <div className="App">

        <SplitterLayout>
          <div className="Form">

            <DynamicForm id="form" config={this.state.form} onSubmit={(event) => this.submitHandler(event)}></DynamicForm>

          </div>


          <div className="PanelRight">
            <button id="download" onClick={() => this.handleDownload()}>Download</button>
            <button id="download" onClick={() => this.handleCSV()}>Download CSV</button>

            <JSONPretty id="resultPanel" json={this.state.response} theme={github} />
          </div>
        </SplitterLayout>

      </div>
    );
  }
}

export default App;

