import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DropdownMenuScenarios from './components/DropdownMenuScenarios'
import ScenarioOptionsData from './data/ScenarioOptionsData'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        titleText: "Forest Indicator Service",
    
        regionalLevelsData: [],
        regionsData: [],
        scenariosData: [],

        selectedRegionallevel: {id: 1},
        selectedRegion: {id: 24},
        selectedScenariocollection: {id: 6},
        selectedScenarios: [10],
        selectedPeriod: {},

        ScenarioMenureadytogo: false
      };    
  }

  componentDidMount(){
    ScenarioOptionsData.getAllRegionLevelData().then(result => {
      this.setState({ regionalLevelsData: result });
      this.setState({ selectedRegionallevel: result[0] }, () => {
        ScenarioOptionsData.getRegionData(this.state.selectedRegionallevel.id).then(regionresult => {
          this.setState({ regionsData: regionresult });
          this.setState({ selectedRegion: regionresult[0] }, () => {
            ScenarioOptionsData.getScenarioCollectionData(this.state.selectedRegion.id, this.state.selectedScenariocollection.id).then(scenarioResult => {
              this.setState({ scenariosData: scenarioResult });
              this.setState({ selectedScenariocollection: scenarioResult[0] }, () => {
                this.setState({ScenarioMenureadytogo: true});
              })
            })
          })
        })
      })
    })
  }

  updateScenarioOptions = () => {
    ScenarioOptionsData.getRegionData(this.state.selectedRegionallevel.id).then(regionresult => {
        this.setState({ regionsData: regionresult });
        ScenarioOptionsData.getScenarioCollectionData(this.state.selectedRegion.id, this.state.selectedScenariocollection.id).then(scenarioResult => {
          this.setState({ scenariosData: scenarioResult }, function(){
            this.setState({ScenarioMenureadytogo: true});
          });
          
        })
    })
  };

  callback = (regionalleveli, regioni, scenariocollectioni, scenarioiID, scenarioiName, periodi) => {
    this.setState({selectedRegionallevel : regionalleveli});
    this.setState({selectedRegion: regioni});
    this.setState({selectedScenariocollection: scenariocollectioni});
    this.setState({selectedScenarios: {name: scenarioiName,
                                       id: scenarioiID}});
    this.setState({selectedPeriod: periodi}, () => {
      this.updateScenarioOptions();
    });
    
  }

  render() {
    return (
      <div className="App">
        <h1>{this.state.titleText}</h1>
        {this.state.ScenarioMenureadytogo ? <DropdownMenuScenarios  regionalLevelsDataFromParent={this.state.regionalLevelsData}
                                                                    regionsDataFromParent={this.state.regionsData}
                                                                    scenariosDataFromParent={this.state.scenariosData}
                                                                    sendChoicesToApp={this.callback}/>
        : <p>loading</p>}
      </div>
    );
  }
}

export default App;
