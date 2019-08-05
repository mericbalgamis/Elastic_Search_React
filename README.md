## Available Scripts

In this project consists of two parts, Phton and React. <br>
&nbsp;&nbsp;&nbsp;1)ELASTIC SEARCH installation (https://www.elastic.co/downloads/elasticsearch) <br>
&nbsp;&nbsp;&nbsp;2)Run bin/elasticsearch on unix, or bin\elasticsearch.bat on windows. <br>
&nbsp;&nbsp;&nbsp;3)React installation (https://github.com/mericbalgamis/Elastic_Search_React.git) <br>
&nbsp;&nbsp;&nbsp;4)$ `run app.py` <br>
&nbsp;&nbsp;&nbsp;5)$ `yarn && yarn start` <br>

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.<br>

## Usage

Load form and use datatypes.txt to write data and datatypes_output.txt to read data. <br>
datatypes.txt of the fields are generic and any number of fields can be entered. For example, the sample form fields are as follows:<br>

&nbsp;&nbsp;&nbsp;Image_Type array (DERIVED,SECONDARY,OTHER,SHM) \n <br>
&nbsp;&nbsp;&nbsp;Instance_Creation_Date date \n <br>
&nbsp;&nbsp;&nbsp;Instance_Creation_Time time \n <br>
&nbsp;&nbsp;&nbsp;SOP_Class_UID text \n <br>
&nbsp;&nbsp;&nbsp;SOP_Instance_UID text \n <br>
&nbsp;&nbsp;&nbsp;Study_Date date \n <br>
&nbsp;&nbsp;&nbsp;Content_Date date \n <br>
&nbsp;&nbsp;&nbsp;Study_Time time \n <br>
&nbsp;&nbsp;&nbsp;Accession_Number number \n <br>
&nbsp;&nbsp;&nbsp;Modality text \n <br>

(Image_Type --> input json file's name, array ---> field's type) <br>

datatypes_output.txt of the fields are generic and any number of fields can be entered.For example, the sample form fields are as follows:<br>

&nbsp;&nbsp;&nbsp;Modality text \n <br>
&nbsp;&nbsp;&nbsp;Institution_Name text \n <br>
&nbsp;&nbsp;&nbsp;Manufacturer text \n <br>
&nbsp;&nbsp;&nbsp;MR_Acquisition_Type text \n <br>
&nbsp;&nbsp;&nbsp;subset_id text \n <br>

## Versions
Runs the app with yarn version v1.17.3<br>
Runs the app with phyton version 3.6<br>
(yarns comes with yarns v1.17.3 , see https://yarnpkg.com/en/docs/install)<br>

