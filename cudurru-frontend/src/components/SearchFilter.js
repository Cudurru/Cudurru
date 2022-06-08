import React, {Component} from "react";
import Autocomplete from "react-google-autocomplete";

class SearchFilter extends Component {
  constructor(props){
    super(props);
    this.state = {
      }
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  handleCheckboxChange(e) {
    let name = e.target.name;
    // console.log(this.state.priceFilter);
    if (name == "priceFilter") {
      if (this.state.priceFilter == true) {
      this.setState({
          bedFilter: false,
          bathFilter: false,
          sqftFilter: false,
          priceFilter: false
        });
      } else {
        this.setState({
          bedFilter: false,
          bathFilter: false,
          sqftFilter: false,
          priceFilter: true
        });
      }
    }
    if (name == "sqftFilter") {
      if (this.state.sqftFilter == true) {
      this.setState({
          bedFilter: false,
          bathFilter: false,
          sqftFilter: false,
          priceFilter: false
        });
      } else {
        this.setState({
          bedFilter: false,
          bathFilter: false,
          sqftFilter: true,
          priceFilter: false
        });
      }
    }
    if (name == "bathFilter") {
      if (this.state.bathFilter == true) {
      this.setState({
          bedFilter: false,
          bathFilter: false,
          sqftFilter: false,
          priceFilter: false
        });
      } else {
        this.setState({
          bedFilter: false,
          bathFilter: true,
          sqftFilter: false,
          priceFilter: false
        });
      }
    }
    if (name == "bedFilter") {
      if (this.state.bedFilter == true) {
      this.setState({
          bedFilter: false,
          bathFilter: false,
          sqftFilter: false,
          priceFilter: false
        });
      } else {
        this.setState({
          bedFilter: true,
          bathFilter: false,
          sqftFilter: false,
          priceFilter: false
        });
      }
    }
  }

  render() {
  return (
    <div className="listing-search-filter">
    	<form>
    	<div className="search">
    		<Autocomplete className="search-box"
                    onPlaceSelected={(place) => {
                    // console.log(place);
                }}
                    types={['address']}
                    componentRestrictions={{country: "us"}} />
    		<button className="filter-submit"></button>
		  </div>
		  <div className="filters">
        <div className="button bed-filter">
          <input type="checkbox" checked={this.state.bedFilter} id="bedFilter" name="bedFilter" className="button-checkbox" onChange={this.handleCheckboxChange} />
          <label htmlFor="bedFilter" className="button-label">Beds</label>
          <div className="filter-dropdown">
            <input type="checkbox" id="bed1" name="bed1" value="1" />
            <label htmlFor="bed1">1</label><br />
            <input type="checkbox" id="bed2" name="bed2" value="2" />
            <label htmlFor="bed2">2</label><br />
            <input type="checkbox" id="bed3" name="bed3" value="3" />
            <label htmlFor="bed3">3</label><br />
            <input type="checkbox" id="bed4" name="bed4" value="4" />
            <label htmlFor="bed4">4</label><br />
            <input type="checkbox" id="bed5" name="bed5" value="5" />
            <label htmlFor="bed5">5</label><br />
            <input type="checkbox" id="bed6-plus" name="bed6-plus" value="6" />
            <label htmlFor="bed6">6+</label>
          </div>
        </div>
        <div className="button bath-filter">
          <input type="checkbox" id="bathFilter" checked={this.state.bathFilter} name="bathFilter" className="button-checkbox" onChange={this.handleCheckboxChange} />
          <label htmlFor="bathFilter" className="button-label">Baths</label>
          <div className="filter-dropdown">
            <input type="checkbox" id="bath1" name="bath1" value="1" />
            <label htmlFor="bath1">1</label><br />
            <input type="checkbox" id="bath2" name="bath2" value="2" />
            <label htmlFor="bath2">2</label><br />
            <input type="checkbox" id="bath3" name="bath3" value="3" />
            <label htmlFor="bath3">3</label><br />
            <input type="checkbox" id="bath4-plus" name="bath4-plus" value="4" />
            <label htmlFor="bath4">4+</label>
          </div>
        </div>
        <div className="button sqft-filter">
          <input type="checkbox" id="sqftFilter" checked={this.state.sqftFilter} name="sqftFilter" className="button-checkbox" onChange={this.handleCheckboxChange} />
          <label htmlFor="sqftFilter" className="button-label">Sq ft</label>
          <div className="filter-dropdown">
          c
          </div>
        </div>
        <div className="button price-filter">
          <input type="checkbox" id="priceFilter" checked={this.state.priceFilter} name="priceFilter" className="button-checkbox" onChange={this.handleCheckboxChange} />
          <label htmlFor="priceFilter" className="button-label">Price</label>
          <div className="filter-dropdown">
          d
          </div>
        </div>
		   </div>
		  </form>
	 </div>
  );
}
}

export default SearchFilter;