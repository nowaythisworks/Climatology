import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
//Explore more Monday React Components here: https://style.monday.com/
// import List, ListItem, ListItemIcon, Board, Team, ThumbsUp
import Loader from "monday-ui-react-core/dist/Loader.js"
import TextField from "monday-ui-react-core/dist/TextField.js"
import DialogContentContainer from "monday-ui-react-core/dist/DialogContentContainer.js"
import Button from "monday-ui-react-core/dist/Button.js"
import { Container, Col, Row } from 'react-bootstrap'
import RemoteClient from "server/client.js"
import RemoteServer from "server/server.js"
import { enable, disable } from 'darkreader';

const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      name: "",
    };
  }

  componentDidMount() {
    monday.listen("settings", res => {
      this.setState({ settings: res.data });
    });
    let m;
    monday.get('settings').then(res => m = res.data);
    this.state.settings.title = m;
  }
  render() {

    function MouseOver(event) {
      // if type is <b> then set event.target to the parent element
      if (event.target.tagName === "B") {
        event.target = event.target.parentElement;
      }

      // remove class bg-white and text-dark
      event.target.classList.remove("bg-white");
      event.target.classList.remove("text-dark");

      // add class bg-dark and text-white
      event.target.classList.add("bg-primary");
      event.target.classList.add("text-white");
    }
    function MouseOut(event) {
      // if type is <b> then set event.target to the parent element
      if (event.target.tagName === "B") {
        event.target = event.target.parentElement;
      }

      // remove class bg-dark and text-white
      event.target.classList.remove("bg-primary");
      event.target.classList.remove("text-white");

      // add class bg-white and text-dark
      // if element has class "current"
      if (event.target.classList.contains("current")) {
        event.target.classList.add("bg-white");
      }
      event.target.classList.add("text-dark");
    }

    var theme = false;

    function darkTheme() {
      console.log("TOGGLINE DARK THEME... STATE: " + darkTheme)
      if (theme == false)
      {
        enable({
            brightness: 100,
            contrast: 90,
            sepia: 10,
        });
      }
      else
      {
        disable();
      }
      theme = !theme;
    }

    // MONDAY API FUNCTIONS
    // scope - boards:read
    // Gets information on all boards in the account, grabs Climate Action Board ID
    var firstTime = true;
    function activateTakeAction() {
      document.querySelector("#take-action-main").style.display = 'block';
      document.querySelector("#main").style.display = 'none';
      // set the animation for every element classed "solution" to fadeIn 1s, with one iteration and fill forwards
      document.querySelectorAll(".solution").forEach(function (element) {
        element.style.animation = "fadeIn " + ( Math.random() ) + "s 1 forwards";
      });
      // add the "current" class to the "take action" button
      document.querySelector("#take-action-button").classList.add("current");
      // remove the "current" class from the "overview" button
      document.querySelector("#overview-button").classList.remove("current");
      // add the "current" class to the "take action" button
      document.querySelector("#take-action-button").classList.add("bg-white");
      // remove the "current" class from the "overview" button
      document.querySelector("#overview-button").classList.remove("bg-white");

      document.querySelector("#greatest-factor-header").innerHTML = "Greatest Contributing Factor: " + document.querySelector("#greatest-factor").innerHTML;
    }

    function activateOverview() {
      document.querySelector("#take-action-main").style.display = 'none';
      document.querySelector("#main").style.display = 'block';
      // add the "current" class to the "overview" button
      document.querySelector("#overview-button").classList.add("current");
      // remove the "current" class from the "take action" button
      document.querySelector("#take-action-button").classList.remove("current");
      // remove the "current" class from the "overview" button
      document.querySelector("#overview-button").classList.add("bg-white");
      // add the "current" class to the "take action" button
      document.querySelector("#take-action-button").classList.remove("bg-white");
    }

    function updateBoardIdentity() {
      activateOverview();
      document.querySelector("#hide-while-loading").style.display = "none";

      document.getElementsByClassName("dialog-content-container")[0].style.display = "none";
      console.log("Updating Board Identity");

      // gets the board if from the URL which is param boardId
      console.log("URL " + window.location.search);
      // the boardid is in the window.location.search in between "&boardId=" and "&boardViewId"
      let boardId = window.location.search.substring(window.location.search.indexOf("&boardId=") + 9, window.location.search.indexOf("&boardViewId"));
      // remove any non numbers from the boardId
      console.log("FOUND ID " + boardId);


      let query = "{ boards(ids: " + boardId + ") { id name items (limit: 20) { id name column_values { id value text } subitems { id name column_values { id value text } } } } } ";

      fetch("https://api.monday.com/v2", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': document.querySelector("#api-key").value
        },
        body: JSON.stringify({
          'query': query
        })
      })
        .then(res => res.json())
        .then(res => {
          console.log(res);
          updateClimateInfo(res.data.boards[0].items);
        });
    }

    function updateClimateInfo(items) {
      console.log("Updating Climate Info");
      document.querySelector("#loader").style.display = "block";

      let industry, regionCode, currencyUnit, numOfServers, vehiclesDistance, numOfEmployees, numOfOffices, flightFrequency, vacationQuantity;

      // loop through items, if name is one of the variables, set it
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        console.log(item.name);
        let name = item.name;
        let value = item.column_values[1].value;
        if (value == null) continue;
        value = JSON.parse(value).text;

        if (name === "Industry") {
          industry = value;
        } else if (name === "Region Code") {
          regionCode = value;
        } else if (name === "Unit of Currency") {
          currencyUnit = value;
        } else if (name === "Number of Servers") {
          numOfServers = value;
        } else if (name === "Vehicles - Distance Driven") {
          vehiclesDistance = value;
        } else if (name === "Number of Employees") {
          numOfEmployees = value;
        } else if (name === "Number of Offices") {
          numOfOffices = value;
        } else if (name === "Flight Frequency") {
          flightFrequency = value;
        } else if (name === "Vacation Days") {
          vacationQuantity = value;
        }
      }

      const auth = 'Bearer K5GFSCENSKMFW3N40FDWXATF5RH4';

      // make climatiq api request for each value

      function makeRequest(body, callback, url = "https://beta3.api.climatiq.io/estimate") {
        // settimeout to reduce api load
        setTimeout(function () {
          fetch(url, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': auth
            },
            body: body
          })
            .then(res => res.json())
            .then(res => {
              callback(res);
            }
            )
        }, 1000 * (1 + Math.random()));
      }

      const updateMultiplier = 1.21666667;
      let totalAmt = 0;

      let car = 0, officewaste = 0, flight = 0;

      const titles = getFromServer("/titles/relevant")

      function addStrategy(strat) {
        /*
        
                <div class="col-sm-6">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Special title treatment</h5>
                      <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                      <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                  </div>
                </div>
                */

        let main = document.createElement("div");
        main.classList.add("col-sm-6");
        main.classList.add("solution");
        main.style.marginTop = "20px";
        document.querySelector("#solutions-list").appendChild(main);

        let card = document.createElement("div");
        card.classList.add("card");
        main.appendChild(card);

        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        card.appendChild(cardBody);

        let cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        const t = titles[Math.floor(Math.random() * titles.length)];
        cardTitle.innerHTML = "<b>" + t + "</b>";
        titles.splice(titles.indexOf(t), 1);
        cardBody.appendChild(cardTitle);

        let cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.innerText = strat;
        cardBody.appendChild(cardText);
      }

      // pie chart order
      // ["Motor Vehicles", "Office Waste", "Waste", "Computing Power", "Air Travel", "Employee"]
      let pieChartData = "";

      // make request for each value
      // REQUEST FOR VEHICLES
      makeRequest(
        '{ "emission_factor": { "activity_id": "commercial_vehicle-vehicle_type_hgv-fuel_source_bev-engine_size_na-vehicle_age_post_2015-vehicle_weight_gt_10t_lt_12t" }, "parameters": { "distance": 100, "distance_unit": "mi" } }',
        function (res) {
          totalAmt += res.co2e;
          car = res.co2e;
          pieChartData += res.co2e + " ";

          // REQUEST FOR EMPLOYEES
          makeRequest(
            '{ "emission_factor": { "activity_id": "waste_type_books-disposal_method_closed_loop" }, "parameters": { "weight": ' + 147 * numOfEmployees / 1000 + ', "weight_unit": "t" } }',
            function (res) {
              totalAmt += res.co2e;
              officewaste += res.co2e;
              pieChartData += res.co2e + " ";

              makeRequest(
                '{ "emission_factor": { "activity_id": "office_equipment-type_office_machinery_computers" }, "parameters": { "money": ' + (32 * numOfEmployees * numOfOffices) + ', "money_unit": "' + currencyUnit + '" } }',
                function (res) {
                  totalAmt += res.co2e;
                  officewaste += res.co2e;
                  pieChartData += res.co2e + " ";

                  makeRequest(
                    '{ "emission_factor": { "activity_id": "passenger_flight-route_type_domestic-aircraft_type_jet-distance_na-class_na-rf_included" }, "parameters": { "passengers": ' + 4 * flightFrequency + ', "distance": 502, "distance_unit": "mi" } }',
                    function (res) {
                      totalAmt += res.co2e;
                      flight += res.co2e;
                      pieChartData += res.co2e + " ";

                      makeRequest(
                        '{ "emission_factor": { "activity_id": "accommodation_type_holiday" }, "parameters": { "money": ' + 120 * numOfEmployees + ', "money_unit": "' + currencyUnit + '" } }',
                        function (res) {
                          totalAmt += res.co2e;
                          flight += res.co2e;
                          pieChartData += res.co2e;

                          //
                          // PUT THIS AFTER THE LAST REQUEST
                          //

                          // settimeout for 1s
                          if (firstTime == true) {
                            document.querySelector("#hide-while-loading").style.display = "block";
                            document.querySelector("#loader").style.display = "none";

                            firstTime = false;
                            console.log("FIRST DRAW REQUESTED -- COMPLETED");
                          }
                          else
                          {
                            setTimeout(function () {
                              document.querySelector("#hide-while-loading").style.display = "block";
                              document.querySelector("#loader").style.display = "none";
                            }, 1500);
                            console.log("REDRAW REQUESTED -- COMPLETED");
                          }

                          document.querySelector("#total-fp").innerHTML = Math.round(totalAmt * 100) / 100;

                          document.querySelector("#pie-chart-data").innerHTML = pieChartData;

                          const degreeOffset = Math.random() * (1 + Math.random()) / 10;

                          //clear data
                          document.querySelector("#line-chart-data-1").innerHTML = totalAmt;
                          // update data
                          for (let i = 0; i < 6; i++) {
                            const newVal = totalAmt * Math.pow(updateMultiplier, (i + 1) * degreeOffset);
                            document.querySelector("#line-chart-data-1").innerHTML += " " + newVal;
                          }

                          //clear data
                          document.querySelector("#line-chart-data-2").innerHTML = totalAmt;
                          // update data
                          for (let i = 0; i < 6; i++) {
                            const newVal = totalAmt * Math.pow((1 / updateMultiplier), i + 1);
                            document.querySelector("#line-chart-data-2").innerHTML += " " + newVal;
                          }

                          console.log(car + " " + officewaste + " " + flight);

                          let greatestFactor = '';
                          // find greatest factor
                          if (car > officewaste && car > flight) {
                            greatestFactor = 'Motor Vehicles';
                          } else if (officewaste > car && officewaste > flight) {
                            greatestFactor = 'Office Waste';
                          } else if (flight > car && flight > officewaste) {
                            greatestFactor = 'Air Travel';
                          }

                          document.querySelector("#greatest-factor").innerHTML = greatestFactor;

                          // constants
                          // OPENAI REDUCTION METHODS
                          // TODO: Compute reduction methods from the reduction factors. Will require more bakes with GPT-3. Post-beta feature?
                          // Airplane:
                          const airplaneReductions = getFromServer("/red/plane")
                          // Cars:
                          const carReductions = getFromServer("/red/moto")
                          // Office Waste:
                          const officWasteReductions = getFromServer("/red/office")
                          // Computing:
                          const computingReductions = getFromServer("/red/computing")
                          // Employee:
                          const employeeReductions = getFromServer("/red/employee")

                          // first, delete any elements in #solutions-list that are classed "col-sm-6"
                          let solutionsList = document.querySelector("#solutions-list");
                          while (solutionsList.firstChild) {
                            solutionsList.removeChild(solutionsList.firstChild);
                          }

                          // based on the greatest factor, add <li> to the list #reduction-strategies-list with the corresponding strategies
                          if (greatestFactor == 'Motor Vehicles') {
                            for (let i = 0; i < carReductions.length; i++) {
                              addStrategy(carReductions[i]);
                            }
                          } else if (greatestFactor == 'Office Waste') {
                            for (let i = 0; i < officWasteReductions.length; i++) {
                              addStrategy(officWasteReductions[i]);
                            }
                          } else if (greatestFactor == 'Air Travel') {
                            for (let i = 0; i < airplaneReductions.length; i++) {
                              addStrategy(airplaneReductions[i]);
                            }
                          }

                          //
                          // END
                          //

                        }
                      )
                    }
                  )
                }
              )
            }
          )
        }
      );
    }

    return <div className="App" style={{ background: "#F8F9FB" }}>

      <div id="pie-chart-data" style={{ display: 'none' }}>14 23 21 17 15 10</div>
      <div id="line-chart-data-1" style={{ display: 'none' }}>402.37 404.2 408.6 408.6 412.7 418.8 424.2</div>
      <div id="line-chart-data-2" style={{ display: 'none' }}>402.37 400.2 398.32 367.5 355.8 355.2 354.5</div>
      <div class="container">
        <div class="row py-3">
          <div class="col-3 order-1" id="sticky-sidebar">
            <div class="sticky-top">
              <div class="d-flex flex-column flex-shrink-0 p-3 vh-100" >
                <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                  <h5 class="p-2 pt-4">Climatology Dashboard</h5>
                </a>
                <hr />

                <ul class="nav nav-pills flex-column mb-auto">
                  <li onMouseOver={MouseOver} onMouseOut={MouseOut} class="nav-item c-menu-item">
                    <a href="#" id="overview-button" onClick={activateOverview} class="nav-link p-3 text-dark bg-white lightshadow current" aria-current="page">
                      <b>Overview</b>
                    </a>
                  </li>
                  <li onMouseOver={MouseOver} onMouseOut={MouseOut} class="nav-item c-menu-item">
                    <a href="#" id="take-action-button" onClick={activateTakeAction} class="nav-link p-3 text-dark lightshadow" aria-current="page">
                      Take Action
                    </a>
                  </li>
                  <li onMouseOver={MouseOver} onMouseOut={MouseOut} class="nav-item c-menu-item">
                    <a href="#" onClick={updateBoardIdentity} class="nav-link p-3 text-dark lightshadow" aria-current="page">
                      Recalculate
                    </a>
                  </li>
                  <li onMouseOver={MouseOver} onMouseOut={MouseOut} class="nav-item c-menu-item">
                    <a href="https://www.climatiq.io/explorer" target="_blank" class="nav-link p-3 text-dark lightshadow" aria-current="page">
                      Sources
                    </a>
                  </li>
                </ul>
                <div class="card lightshadow" style={{ border: "0", background: "0" }}>
                  <div class="card-body bg-primary text-light" style={{ borderRadius: "8px" }}>
                    <h5 class="card-title">Need help?</h5>
                    <p class="card-text">Take a quick peek at our tutorial and find out how everything works.</p>
                    <a href="https://nowaythis.works/mondayapps" target="_blank" class="btn btn-light">Read Tutorial</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col order-2" id="take-action-main" style={{ display: 'none' }}>
            <div class="col order-2">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb" style={{ marginTop: "37px" }}>
                  <li class="breadcrumb-item">
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '-3px' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    &nbsp;
                    Home
                  </li>
                  <li class="breadcrumb-item active" aria-current="page" id="current-page-name">Take Action</li>
                </ol>
              </nav>

              <h4 id="greatest-factor-header" style={{marginTop: '20px', marginLeft:'2px'}}>Greatest Contributing Factor: Air Travel</h4>
              <h6>The following ideas were suggested based off of your current emissions trend.</h6>
              
              <div class="row" id="solutions-list" style={{width: '80%', marginTop: '-10px'}}>
              </div>

              <h6 style={{position: 'absolute', bottom: '10px'}}><b>Important!</b> This feature is still in beta. Improvements are considered openly on <a href="https://nowaythis.works/mondayapps/" target="_blank">our website</a>.</h6>

            </div>
          </div>

          <div class="col order-2" id="main">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb" style={{ marginTop: "37px" }}>
                <li class="breadcrumb-item">
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '-3px' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                  &nbsp;
                  Home
                </li>
                <li class="breadcrumb-item active" aria-current="page" id="current-page-name">Overview</li>
              </ol>
            </nav>
            <div id="loader" style={{ display: 'none', position: 'absolute', top: '50%', left: '50%', transform: 'translate(50%,-100%)' }} color={Loader.colors.PRIMARY}>
              <Loader size={40} />
            </div>
            <div id="hide-while-loading" style={{ display: 'none' }}>
              <div id="top-data" class="w-auto">
                <div class="data-element bg-primary bg-gradient text-light lightshadow p-3 mx-3" style={{ width: '320px' }}>
                  <div class="row row-cols-2 p-1 px-3 ">
                    <div class="col-md-auto">
                      <div class="data-element-header text-light">Total Footprint</div>
                      <div class="data-element-data pt-1"><b><span id="total-fp">Unknown</span> tons</b>/yr</div>
                    </div>
                    <div class="col-md-auto p-2 rounded" style={{ marginLeft: "45px" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="2" x2="12" y2="9"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="8 6 12 2 16 6"></polyline></svg>
                    </div>
                  </div>
                </div>
                <div class="data-element bg-danger bg-gradient text-light lightshadow p-3 mt-1 mx-3" style={{ width: '320px' }}>
                  <div class="row row-cols-2 p-1 px-3 ">
                    <div class="col-md-auto">
                      <div class="data-element-header text-light">Greatest Emission Factor</div>
                      <div class="data-element-data pt-1"><b id="greatest-factor">Unknown</b></div>
                    </div>
                    <div class="col-md-auto p-2 rounded" style={{ marginLeft: "45px" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row row-cols-2">
                <div class="col-md-auto mx-3">
                  <div class="data-element bg-light bg-gradient lightshadow p-4 mt-3" style={{ boxShadow: "2px 2px 20px rgb(0 0 0 / 0.07)", width: "320px", marginRight: "-9px" }}>
                    <div class="data-element-header" style={{ fontSize: "110%", paddingBottom: "20px" }}>Footprint Expansion Analysis</div>
                    <div id="area-chart">
                      Unable to load chart :(
                    </div>
                  </div>
                </div>
                <div class="col-md-auto">
                  <div class="data-element bg-light bg-gradient lightshadow p-4 mt-3" style={{ boxShadow: "2px 2px 20px rgb(0 0 0 / 0.07)", width: "320px" }}>
                    <div class="data-element-header" style={{ fontSize: "110%", paddingBottom: "20px" }}>Impact Sources Analysis</div>
                    <div id="pie-chart">
                      Unable to load chart :(
                    </div>
                    <div>
                      <u>Insights</u> are generated by <b>Climatology</b> using the <i><a href="https://www.climatiq.io/" target="_blank">Climatiq API</a></i> and are estimates. Always ensure the cofiguration is up-to-date.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="footer vw-100 p-2 py-3">
              <Button onClick={darkTheme} kind={Button.kinds.TERTIARY}>
                Toggle Theme
              </Button>
            </div>
          </div>
        </div>
      </div>
      <DialogContentContainer type={DialogContentContainer.types.MODAL} style={{ position: 'absolute', alignSelf: 'center', width: '400px', height: '185px', borderRadius: '5px', padding: '15px', boxShadow: '0 0 100px 10px rgb(0 0 0 / 0.4)' }}>
        <b style={{ fontSize: '150%' }}></b>

        <TextField
          iconName="fa fa-square"
          placeholder="API Key"
          // showCharCount
          title="API Key:"
          wrapperClassName="monday-storybook-text-field_size"
          id="api-key"
        />
        <p style={{ marginTop: '10px' }}>This can be found <a href="https://developer.monday.com/api-reference/docs/authentication" target="_blank">here</a>.</p>

        <Button onClick={updateBoardIdentity}>
          Calculate
        </Button>
      </DialogContentContainer>
    </div>

  }
}

export default App;
