import React, { Component } from 'react';
import './App.css';
import ScenarioOptionsData from './data/ScenarioOptionsData'
import Graphs from './components/Graphs';
import DropdownMenuScenarios from './components/DropdownMenuScenarios';
import Indicators from './components/Indicators';
import LanguageSelector from './components/LanguageSelector';
import Feedback from './components/Feedback'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        regionalLevelsData: [],
        regionsData: [],
        scenariosData: [],

        selectedRegionallevel: {},
        selectedRegion: {},
        selectedScenariocollection: {},
        selectedScenarios: null,
        selectedPeriod: null,
        selectedIndicators: null,
        selectedLanguage: 'fi',

        dataGotFromAPI: false
      };    
  }

  componentDidMount(){
    ScenarioOptionsData.getAllRegionLevelData(this.state.selectedLanguage).then(result => {
      this.setState({ regionalLevelsData: result });
      this.setState({ selectedRegionallevel: result[0] }, () => {
        ScenarioOptionsData.getRegionData(this.state.selectedRegionallevel.id, this.state.selectedLanguage).then(regionresult => {
          this.setState({ regionsData: regionresult });
          this.setState({ selectedRegion: regionresult[0] });
          this.setState({ selectedScenariocollection: regionresult[0].scenarioCollections[0] }, () => {
            ScenarioOptionsData.getScenarioCollectionData(this.state.selectedRegion.id, this.state.selectedScenariocollection.id, this.state.selectedLanguage).then(scenarioResult => {
              this.setState({ scenariosData: scenarioResult });
              this.setState({ selectedScenariocollection: scenarioResult[0] }, () => {
                this.setState({dataGotFromAPI: true});
              })
            })
          })
        })
      })
    })
  }

  updateScenarioOptions = () => {
    ScenarioOptionsData.getRegionData(this.state.selectedRegionallevel.id, this.state.selectedLanguage).then(regionresult => {
        this.setState({ regionsData: regionresult });
        ScenarioOptionsData.getScenarioCollectionData(this.state.selectedRegion.id, this.state.selectedScenariocollection.id, this.state.selectedLanguage).then(scenarioResult => {
          this.setState({ scenariosData: scenarioResult });
        });      
    })
  };

  getChoicesFromScenarioMenu = (regionalleveli, regioni, scenariocollectioni, scenarioi, periodi) => {
    this.setState({selectedRegionallevel : regionalleveli});
    this.setState({selectedRegion: regioni});
    this.setState({selectedScenariocollection: scenariocollectioni});
    this.setState({selectedScenarios: scenarioi});
    this.setState({selectedPeriod: periodi}, () => {
      this.updateScenarioOptions();
    });
  }

  getChoicesFromIndicatorMenu = (gottenIndicators) => {
    this.setState({selectedIndicators: gottenIndicators});
  }

  getLanguageSelection = (language) => {
    this.setState({ selectedLanguage:language }, ()=> {
      ScenarioOptionsData.getAllRegionLevelData(this.state.selectedLanguage).then(result => {
        this.setState({ regionalLevelsData: result });
      })
      this.updateScenarioOptions();
    });
  }

  render() {
    return (
      <div className="App">            
        <h1 className="App-title">{this.state.selectedLanguage==='fi'?'Metsämittari':'Forest Indicator'}</h1>
        <LanguageSelector sendLanguageToApp={this.getLanguageSelection}/>
        <Feedback language={this.state.selectedLanguage}/>
        {this.state.dataGotFromAPI ? 
          <div className="container">
          <div className="row">          
              <div className="col-sm-3">
                <div className="ScenarioMenu"> 
                  <DropdownMenuScenarios  regionalLevelsDataFromParent={this.state.regionalLevelsData}
                                          regionsDataFromParent={this.state.regionsData}
                                          scenariosDataFromParent={this.state.scenariosData}
                                          language={this.state.selectedLanguage}
                                          sendChoicesToApp={this.getChoicesFromScenarioMenu}/>
                </div>
              </div>
              <div className="col-sm-6"><Graphs regionobject = {this.state.selectedRegion}
                                                periodobject = {this.state.selectedPeriod} 
                                                scenarioobject = {this.state.selectedScenarios}
                                                scenariosDataFromParent={this.state.scenariosData}
                                                language={this.state.selectedLanguage}
                                                indicatorobject = {this.state.selectedIndicators}/>
              </div>
              <div className="col-sm-3">
              <div className="IndicatorMenu"><Indicators scenariosDataFromParent={this.state.scenariosData}
                                                    language={this.state.selectedLanguage}
                                                    sendIndicatorChoicesToApp={this.getChoicesFromIndicatorMenu}/></div>
              </div>
          </div>
        </div> 
          : <p>Loading...</p>}
      </div>
    );
  }
}



export default App;
