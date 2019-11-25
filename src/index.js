import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {
  Button,
  Dropdown,
  DropdownList,
  DropdownListItem
} from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

export class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  detachExternalChangeHandler = null;

  constructor(props) {
    super(props);
    this.state = {
      value: props.sdk.field.getValue() || 'Select Artist',
      isOpen: false,
      hasLoaded: false,
      items: ["Not Available"],
    };
    
    this.loadSpreadsheet = this.loadSpreadsheet.bind(this);
    this.d3Gsheet = this.d3Gsheet.bind(this);
  }

  d3Gsheet(key, sheetName, callback) {
    if (arguments.length < 3) { callback = sheetName; sheetName = null; };

    let cb = "&tqx=responseHandler:d3.gsheet_google_callback",
        sheet = sheetName ? "&sheet=" + sheetName : '',
        url = "https://spreadsheets.google.com/a/google.com/tq?key=" + key + sheet + cb,
        script;

    function parse(response) {
        var cols = response.table.cols,
            rows = response.table.rows,
            data = rows.map(function(row) {
                var o = [];
                row.c.forEach(function(c, j) { o.push(c.v); });
                return o;
            });
        return data;
    }

    function google_callback(response) {
        callback(parse(response));
        script.remove();
    }

    d3.gsheet_google_callback = google_callback;

    script = d3.select('head')
        .append('script')
        .attr('type', 'text/javascript')
        .attr('src', url);
  }

  loadSpreadsheet = async (sheetID) => {
      this.d3Gsheet(sheetID, "Sheet1", function(data) {
          let items = data;
          this.setState({
            hasLoaded: true,
            items
          });
      }.bind(this)); 
  };
  
  componentDidMount() {
    this.props.sdk.window.startAutoResizer();
    
    const gSheetID = this.props.sdk.parameters.instance.sheetID;
      
    // Handler for xternal field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
    
    this.loadSpreadsheet(gSheetID);
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = value => {
    this.setState({ value });
  };

  toggleDropdown = e => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  onClick = value => {  
    this.setState({ value });
    
    if (value) {
      this.props.sdk.field.setValue(value);
    } else {
      this.props.sdk.field.removeValue();
    }
    
    this.toggleDropdown();
  };

  render() {      
      return (
         <div className="model-dropdown">
            <Dropdown className="custom-dd"
              isOpen={this.state.isOpen}
              position="top-left"
              toggleElement={
                <Button
                  size="large"
                  buttonType="muted"
                  indicateDropdown
                  isFullWidth
                  onClick={e => this.setState({ isOpen: !this.state.isOpen })}>
                    {this.state.value}
                </Button>
              }>
                <DropdownList className="custom-dd-list" maxHeight={100}>
                    {this.state.items.map((item, index) => (
                        <DropdownListItem key={`key-${index}`} onClick={e => this.onClick(item)}>
                            {item}
                        </DropdownListItem>
                    ))}
                </DropdownList>
            </Dropdown>
        </div>
      );
    }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});
